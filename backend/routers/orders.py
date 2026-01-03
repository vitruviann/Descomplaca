
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import Optional, List
import datetime

router = APIRouter(prefix="/orders", tags=["orders"])

class OrderCreate(BaseModel):
    vehicle_plate: str
    vehicle_renavam: Optional[str] = None
    service_type: str
    description: Optional[str] = None
    city: str
    state: str
    # owner_id would normally come from auth, passing explicitly for now if no auth middleware yet
    owner_id: int 

class OrderResponse(BaseModel):
    id: int
    status: str
    vehicle_plate: str
    service_type: str
    city: str
    state: str
    created_at: datetime.datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(
        vehicle_plate=order.vehicle_plate,
        vehicle_renavam=order.vehicle_renavam,
        service_type=order.service_type,
        description=order.description,
        city=order.city,
        state=order.state,
        owner_id=order.owner_id,
        status="OPEN"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderResponse])
async def list_orders(city: Optional[str] = None, state: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Order).filter(models.Order.status == "OPEN")
    if city:
        query = query.filter(models.Order.city == city)
    if state:
        query = query.filter(models.Order.state == state)
    return query.all()

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # Validate status
    valid_statuses = ["OPEN", "PROPOSAL_RECEIVED", "PAID", "IN_PROGRESS", "CONCLUDED", "FINISHED", "CANCELLED"]
    if status not in valid_statuses:
         raise HTTPException(status_code=400, detail="Invalid status")
         
    order.status = status
    db.commit()
    db.refresh(order)
    return order

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
