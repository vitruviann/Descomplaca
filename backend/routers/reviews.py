
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter(prefix="/reviews", tags=["reviews"])

class ReviewCreate(BaseModel):
    order_id: int
    rating: int
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    created_at: datetime.datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=ReviewResponse)
async def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == review.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status != "FINISHED":
        raise HTTPException(status_code=400, detail="Service must be FINISHED to review")
        
    # Find dispatcher from accepted proposal
    accepted_proposal = db.query(models.Proposal).filter(
        models.Proposal.order_id == order.id, 
        models.Proposal.is_accepted == True
    ).first()
    
    dispatcher_id = accepted_proposal.dispatcher_id if accepted_proposal else None

    db_review = models.Review(
        order_id=review.order_id,
        rating=review.rating,
        comment=review.comment,
        dispatcher_id=dispatcher_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
