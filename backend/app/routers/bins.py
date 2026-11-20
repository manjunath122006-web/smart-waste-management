from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import WasteBin, User
from ..schemas import WasteBinOut, WasteBinUpdate
from ..auth import get_optional_user

router = APIRouter(prefix="/bins", tags=["Waste Bins"])

@router.get("", response_model=List[WasteBinOut])
def list_bins(
    zone: Optional[str] = Query(None, description="Filter by operational zone"),
    status: Optional[str] = Query(None, description="Filter by bin status: NORMAL, WARNING, CRITICAL, COLLECTING"),
    waste_type: Optional[str] = Query(None, description="Filter by waste category"),
    db: Session = Depends(get_db)
):
    query = db.query(WasteBin)
    if zone:
        query = query.filter(WasteBin.zone == zone)
    if status:
        query = query.filter(WasteBin.status == status)
    if waste_type:
        query = query.filter(WasteBin.waste_type == waste_type)
    return query.order_by(WasteBin.priority_score.desc()).all()

@router.get("/{bin_id}", response_model=WasteBinOut)
def get_bin(bin_id: str, db: Session = Depends(get_db)):
    bin_obj = db.query(WasteBin).filter((WasteBin.id == bin_id) | (WasteBin.bin_code == bin_id)).first()
    if not bin_obj:
        raise HTTPException(status_code=404, detail="Waste bin not found")
    return bin_obj

@router.patch("/{bin_id}", response_model=WasteBinOut)
def update_bin(bin_id: str, payload: WasteBinUpdate, db: Session = Depends(get_db)):
    bin_obj = db.query(WasteBin).filter((WasteBin.id == bin_id) | (WasteBin.bin_code == bin_id)).first()
    if not bin_obj:
        raise HTTPException(status_code=404, detail="Waste bin not found")

    if payload.current_fill_percent is not None:
        bin_obj.current_fill_percent = round(payload.current_fill_percent, 1)
        # Auto-compute status & priority score
        if bin_obj.current_fill_percent >= 90.0:
            bin_obj.status = "CRITICAL"
            bin_obj.priority_score = min(100.0, 75.0 + (bin_obj.current_fill_percent - 90.0) * 2.5)
        elif bin_obj.current_fill_percent >= 75.0:
            bin_obj.status = "WARNING"
            bin_obj.priority_score = 50.0 + (bin_obj.current_fill_percent - 75.0) * 1.5
        else:
            bin_obj.status = "NORMAL"
            bin_obj.priority_score = max(5.0, bin_obj.current_fill_percent * 0.5)

    if payload.status is not None:
        bin_obj.status = payload.status
    if payload.assigned_route_id is not None:
        bin_obj.assigned_route_id = payload.assigned_route_id

    db.commit()
    db.refresh(bin_obj)
    return bin_obj
