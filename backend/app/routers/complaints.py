import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, WasteCategory, User
from ..schemas import ComplaintCreateResponse, ComplaintOut, ComplaintOverrideRequest, ComplaintStatusUpdate, WasteCategoryOut
from ..storage import get_storage_provider
from ..ai_service import classifier_service, CATEGORY_SEVERITY_MAP
from ..priority import calculate_priority_score
from ..auth import get_optional_user, require_admin

router = APIRouter(prefix="/complaints", tags=["Complaints"])

def generate_tracking_number() -> str:
    today_str = datetime.utcnow().strftime("%Y%m%d")
    short_hash = uuid.uuid4().hex[:4].upper()
    return f"CMP-{today_str}-{short_hash}"

@router.get("/categories", response_model=List[WasteCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(WasteCategory).all()

@router.post("", response_model=ComplaintCreateResponse, status_code=status.HTTP_201_CREATED)
async def submit_complaint(
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(...),
    manual_category: Optional[str] = Form(None),
    reported_by_email: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    # Validate coordinate bounds
    if not (-90.0 <= latitude <= 90.0) or not (-180.0 <= longitude <= 180.0):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude coordinates")

    # Read and validate image
    contents = await photo.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image size exceeds maximum limit of 10 MB")

    content_type = photo.content_type or "image/jpeg"
    if not (content_type.startswith("image/") or photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))):
        raise HTTPException(status_code=400, detail="Only image files (.jpg, .jpeg, .png, .webp) are supported")

    # AI Classification
    ai_result = classifier_service.classify_image(contents)
    predicted_cat = ai_result["category"]
    confidence = ai_result["confidence"]

    # Check if manual category was supplied upon submission
    is_overridden = False
    if manual_category and manual_category in CATEGORY_SEVERITY_MAP:
        final_category = manual_category
        severity = CATEGORY_SEVERITY_MAP[manual_category]
        is_overridden = (manual_category != predicted_cat)
    else:
        final_category = predicted_cat
        severity = ai_result["severity"]

    # Find matching WasteCategory row
    cat_row = db.query(WasteCategory).filter(WasteCategory.code == final_category).first()

    # Upload to storage (Local or S3)
    storage = get_storage_provider()
    storage_key, access_url = storage.save_file(contents, photo.filename or "upload.jpg", content_type)

    # Calculate initial priority score
    active_complaints = db.query(Complaint).filter(Complaint.status != "RESOLVED").all()
    active_dicts = [{"latitude": c.latitude, "longitude": c.longitude} for c in active_complaints]
    
    priority_score = calculate_priority_score(
        severity_level=severity,
        created_at=datetime.utcnow(),
        latitude=latitude,
        longitude=longitude,
        all_active_complaints=active_dicts
    )

    user_email = (current_user.email if current_user else reported_by_email)

    tracking_num = generate_tracking_number()
    complaint = Complaint(
        tracking_number=tracking_num,
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_storage_key=storage_key,
        image_url=access_url,
        category_id=cat_row.id if cat_row else None,
        predicted_category=final_category,
        confidence_score=confidence,
        is_user_overridden=is_overridden,
        severity_level=severity,
        priority_score=priority_score,
        status="PENDING",
        reported_by_email=user_email
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "id": complaint.id,
        "tracking_number": complaint.tracking_number,
        "description": complaint.description,
        "latitude": complaint.latitude,
        "longitude": complaint.longitude,
        "image_url": complaint.image_url,
        "predicted_category": complaint.predicted_category,
        "confidence_score": complaint.confidence_score,
        "severity_level": complaint.severity_level,
        "priority_score": complaint.priority_score,
        "status": complaint.status,
        "created_at": complaint.created_at
    }

@router.get("/track/{tracking_number}", response_model=ComplaintOut)
def track_complaint(tracking_number: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.tracking_number == tracking_number.strip().upper()).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint with specified tracking number not found")
    return complaint

@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint_by_id(complaint_id: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.get("", response_model=List[ComplaintOut])
def list_complaints(
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status.upper())
    if category:
        query = query.filter(Complaint.predicted_category == category)
    return query.order_by(Complaint.priority_score.desc(), Complaint.created_at.desc()).limit(limit).all()

@router.patch("/{complaint_id}/override", response_model=ComplaintOut)
def override_category(
    complaint_id: str,
    override_data: ComplaintOverrideRequest,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    code = override_data.category_code
    if code not in CATEGORY_SEVERITY_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid waste category code '{code}'")

    complaint.predicted_category = code
    complaint.is_user_overridden = True
    complaint.severity_level = override_data.severity_level or CATEGORY_SEVERITY_MAP[code]

    cat_row = db.query(WasteCategory).filter(WasteCategory.code == code).first()
    if cat_row:
        complaint.category_id = cat_row.id

    # Recalculate priority
    active_complaints = db.query(Complaint).filter(Complaint.status != "RESOLVED").all()
    active_dicts = [{"latitude": c.latitude, "longitude": c.longitude} for c in active_complaints]
    complaint.priority_score = calculate_priority_score(
        severity_level=complaint.severity_level,
        created_at=complaint.created_at,
        latitude=complaint.latitude,
        longitude=complaint.longitude,
        all_active_complaints=active_dicts
    )

    db.commit()
    db.refresh(complaint)
    return complaint

@router.patch("/{complaint_id}/status", response_model=ComplaintOut)
def update_complaint_status(
    complaint_id: str,
    status_update: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    new_status = status_update.status.upper()
    if new_status not in ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail=f"Invalid complaint status '{new_status}'")

    complaint.status = new_status
    if new_status == "RESOLVED":
        complaint.resolved_at = datetime.utcnow()
    else:
        complaint.resolved_at = None

    db.commit()
    db.refresh(complaint)
    return complaint
