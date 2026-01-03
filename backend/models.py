
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    user_type = Column(String)  # 'CLIENT', 'DISPATCHER', 'ADMIN'
    # Field to store CRDD or license number for dispatchers
    license_number = Column(String, nullable=True)
    # Asaas Account ID for dispatchers (for split)
    asaas_account_id = Column(String, nullable=True)
    
    orders = relationship("Order", back_populates="owner")
    proposals = relationship("Proposal", back_populates="dispatcher")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="OPEN")  # OPEN, PROPOSAL_RECEIVED, PAUSED, PAID, IN_PROGRESS, CONCLUDED, FINISHED
    
    # Vehicle Info
    vehicle_plate = Column(String, index=True)
    vehicle_renavam = Column(String, nullable=True)
    service_type = Column(String)
    description = Column(Text, nullable=True)
    
    # Location for matching
    city = Column(String)
    state = Column(String)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="orders")
    
    proposals = relationship("Proposal", back_populates="order")
    messages = relationship("Message", back_populates="order")

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    fee_value = Column(Float) # Honorarios
    tax_value = Column(Float) # Taxas Estatais
    total_value = Column(Float) # Total
    
    estimated_days = Column(Integer)
    description = Column(Text) # "Mensagem de Abordagem" - needs regex filtering in API
    
    is_accepted = Column(Boolean, default=False)
    
    dispatcher_id = Column(Integer, ForeignKey("users.id"))
    dispatcher = relationship("User", back_populates="proposals")
    
    order_id = Column(Integer, ForeignKey("orders.id"))
    order = relationship("Order", back_populates="proposals")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    content = Column(Text)
    is_from_dispatcher = Column(Boolean) # True if from dispatcher, False if from client
    
    order_id = Column(Integer, ForeignKey("orders.id"))
    order = relationship("Order", back_populates="messages")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    asaas_payment_id = Column(String, unique=True)
    status = Column(String)
    amount = Column(Float)
    
    # Link to selected proposal
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    proposal = relationship("Proposal")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    rating = Column(Integer) # 1-5
    comment = Column(Text, nullable=True)
    
    order_id = Column(Integer, ForeignKey("orders.id"))
    order = relationship("Order")
    
    # Could link to Dispatcher too for easier average calc
    dispatcher_id = Column(Integer, ForeignKey("users.id"))
    dispatcher = relationship("User")
