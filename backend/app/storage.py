import os
import uuid
from abc import ABC, abstractmethod
from fastapi import HTTPException
from .config import settings

class StorageProvider(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, original_filename: str, content_type: str) -> tuple[str, str]:
        """
        Saves file and returns (storage_key, access_url)
        """
        pass

class LocalFileStorage(StorageProvider):
    def __init__(self, upload_dir: str):
        self.upload_dir = os.path.abspath(upload_dir)
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, original_filename: str, content_type: str) -> tuple[str, str]:
        extension = os.path.splitext(original_filename)[1].lower()
        if not extension or extension not in [".jpg", ".jpeg", ".png", ".webp"]:
            extension = ".jpg"
        
        unique_filename = f"{uuid.uuid4().hex}{extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)
        
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
        storage_key = unique_filename
        # Accessible through FastAPI static/mount or custom upload route
        access_url = f"/api/v1/uploads/{unique_filename}"
        return storage_key, access_url

class S3Storage(StorageProvider):
    def __init__(self, bucket_name: str, region: str, access_key: str = "", secret_key: str = ""):
        import boto3
        from botocore.exceptions import ClientError
        self.bucket_name = bucket_name
        self.region = region
        
        client_kwargs = {"region_name": region}
        if access_key and secret_key:
            client_kwargs["aws_access_key_id"] = access_key
            client_kwargs["aws_secret_access_key"] = secret_key
            
        self.s3_client = boto3.client("s3", **client_kwargs)

    def save_file(self, file_bytes: bytes, original_filename: str, content_type: str) -> tuple[str, str]:
        import boto3
        from botocore.exceptions import ClientError
        extension = os.path.splitext(original_filename)[1].lower()
        if not extension or extension not in [".jpg", ".jpeg", ".png", ".webp"]:
            extension = ".jpg"
            
        storage_key = f"complaints/{uuid.uuid4().hex}{extension}"
        
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=storage_key,
                Body=file_bytes,
                ContentType=content_type or "image/jpeg"
            )
            access_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{storage_key}"
            return storage_key, access_url
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"S3 Storage Upload Failed: {str(e)}"
            )

def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_BACKEND.lower() == "s3" and settings.S3_BUCKET_NAME:
        return S3Storage(
            bucket_name=settings.S3_BUCKET_NAME,
            region=settings.AWS_REGION,
            access_key=settings.AWS_ACCESS_KEY_ID,
            secret_key=settings.AWS_SECRET_ACCESS_KEY
        )
    return LocalFileStorage(upload_dir=settings.LOCAL_UPLOAD_DIR)
