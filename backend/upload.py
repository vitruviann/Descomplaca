import shutil
import os
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

async def save_upload_file(upload_file: UploadFile, session_id: str) -> str:
    # Create a session-specific directory
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    if not os.path.exists(session_dir):
        os.makedirs(session_dir)
        
    file_path = os.path.join(session_dir, upload_file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    return file_path

def cleanup_uploads(session_id: str):
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    if os.path.exists(session_dir):
        shutil.rmtree(session_dir)
