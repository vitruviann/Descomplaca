
import os
import shutil
from fastapi import UploadFile, HTTPException
import uuid

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_order_document(file: UploadFile, order_id: int) -> str:
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Create specific dir for order
    order_dir = os.path.join(UPLOAD_DIR, str(order_id))
    os.makedirs(order_dir, exist_ok=True)
    
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(order_dir, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()
        
    return file_path
