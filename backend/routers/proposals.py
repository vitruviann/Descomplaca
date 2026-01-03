
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel, validator
from typing import List
import re
import datetime

router = APIRouter(prefix="/proposals", tags=["proposals"])

class ProposalCreate(BaseModel):
    order_id: int
    dispatcher_id: int
    fee_value: float
    tax_value: float
    estimated_days: int
    description: str

    @validator('description')
    def validate_anti_leakage(cls, v):
        # Regex to block phone numbers, emails, etc.
        # Simple patterns for example
        phone_pattern = r'(\(?\d{2}\)?\s?\d{4,5}-?\d{4})'
        email_pattern = r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})'
        
        if re.search(phone_pattern, v):
            raise ValueError('Sensitive info (phone) detected in message')
        if re.search(email_pattern, v):
            raise ValueError('Sensitive info (email) detected in message')
        return v

class ProposalResponse(BaseModel):
    id: int
    order_id: int
    status: str = "PENDING"
    fee_value: float
    tax_value: float
    total_value: float
    estimated_days: int
    description: str # The description is safe to return if it passed validation
    created_at: datetime.datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=ProposalResponse)
async def create_proposal(proposal: ProposalCreate, db: Session = Depends(get_db)):
    # Check if order exists and is OPEN
    order = db.query(models.Order).filter(models.Order.id == proposal.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "OPEN":
        raise HTTPException(status_code=400, detail="Order is not open for proposals")

    # Calculate total
    total = proposal.fee_value + proposal.tax_value
    
    db_proposal = models.Proposal(
        order_id=proposal.order_id,
        dispatcher_id=proposal.dispatcher_id,
        fee_value=proposal.fee_value,
        tax_value=proposal.tax_value,
        total_value=total,
        estimated_days=proposal.estimated_days,
        description=proposal.description
    )
    
    db.add(db_proposal)
    
    # Update order status to PROPOSAL_RECEIVED? Or just keep OPEN?
    # Diagram says "PROPOSAL RECEIVED"
    order.status = "PROPOSAL_RECEIVED"
    
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

@router.get("/order/{order_id}", response_model=List[ProposalResponse])
async def list_proposals_for_order(order_id: int, db: Session = Depends(get_db)):
    proposals = db.query(models.Proposal).filter(models.Proposal.order_id == order_id).all()
    return proposals
