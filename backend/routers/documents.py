
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from services.documents import save_order_document
import os

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload/{order_id}")
async def upload_document_for_order(order_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # In production, check if user has permission (is owner or dispatcher)
    
    file_path = await save_order_document(file, order_id)
    
    # We could store metadata in DB if needed (e.g. Document table)
    # For now, just returning path
    
    return {"filename": file.filename, "path": file_path, "status": "uploaded"}
