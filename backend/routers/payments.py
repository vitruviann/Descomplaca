
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
import models
from services.asaas import asaas_service
import os

router = APIRouter(prefix="/payments", tags=["payments"])

DESCOMPLACA_COMMISSION_PERCENT = 0.10 # 10% commission example

@router.post("/checkout/{proposal_id}")
async def create_checkout(proposal_id: int, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    order = proposal.order
    client = order.owner
    dispatcher = proposal.dispatcher
    
    # 1. Ensure Client exists in Asaas
    # In a real app, we'd store the Asaas ID on the User model
    # if not client.asaas_id:
    #     customer = await asaas_service.create_customer(client.full_name, client.cpf, client.email, client.phone_number)
    #     client.asaas_id = customer['id']
    #     db.commit()
    
    # MOCK Client ID for Sandbox
    client_asaas_id = "cus_000005031717" # Replace with real lookup
    
    # 2. Prepare Split
    # Split rule: Taxts + Net Fees go to Dispatcher.
    # Commission stays with Master.
    
    # If Dispatcher doesn't have an account, we can't split (in production we'd block proposal or onboarding)
    # Mocking Dispatcher Wallet for Sandbox
    dispatcher_wallet_id = dispatcher.asaas_account_id or "wallet_mock_123" 
    
    # Simple Split: Transfer (Total - Commission) to Dispatcher
    # Real logic might separate Tax (Immediate) and Fee (Escrow) if Asaas supports multiple split rules or separate transfers.
    # Asaas Split is usually "send X% or fixed value to wallet Y".
    
    commission_value = proposal.fee_value * DESCOMPLACA_COMMISSION_PERCENT
    dispatcher_receive_value = proposal.total_value - commission_value
    
    split_config = [
        {
            "walletId": dispatcher_wallet_id,
            "fixedValue": dispatcher_receive_value,
            # "percentualValue": None
        }
    ]
    
    try:
        payment_data = await asaas_service.create_payment(
            customer_id=client_asaas_id,
            billing_type="PIX", # Default to PIX for MVP
            value=proposal.total_value,
            due_date="2026-01-10", # Mock due date
            description=f"Pedido #{order.id} - {order.service_type}",
            split=split_config
        )
        
        # Save Payment Record
        db_payment = models.Payment(
            asaas_payment_id=payment_data['id'],
            status=payment_data['status'],
            amount=payment_data['value'],
            proposal_id=proposal.id
        )
        db.add(db_payment)
        db.commit()
        
        return {"payment_url": payment_data.get("invoiceUrl"), "qr_code": payment_data.get("bankSlipUrl")} # Verify params
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/asaas")
async def asaas_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    event = data.get("event")
    payment_data = data.get("payment")
    
    if event in ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]:
        payment_id = payment_data.get("id")
        payment = db.query(models.Payment).filter(models.Payment.asaas_payment_id == payment_id).first()
        if payment:
            payment.status = "PAID"
            # Update Proposal and Order
            proposal = payment.proposal
            proposal.is_accepted = True
            
            order = proposal.order
            order.status = "PAID" # or IN_PROGRESS
            
            db.commit()
            
    return {"status": "received"}
