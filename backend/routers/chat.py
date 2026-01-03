
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import List
import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

class MessageCreate(BaseModel):
    order_id: int
    content: str
    is_from_dispatcher: bool

class MessageResponse(BaseModel):
    id: int
    order_id: int
    content: str
    is_from_dispatcher: bool
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

@router.get("/{order_id}", response_model=List[MessageResponse])
async def get_messages(order_id: int, db: Session = Depends(get_db)):
    # Verify order exists/access logic
    messages = db.query(models.Message).filter(models.Message.order_id == order_id).order_by(models.Message.timestamp.asc()).all()
    return messages

@router.post("/", response_model=MessageResponse)
async def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == message.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    db_message = models.Message(
        order_id=message.order_id,
        content=message.content,
        is_from_dispatcher=message.is_from_dispatcher
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
