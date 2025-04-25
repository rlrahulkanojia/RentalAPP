from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class RentalContract(Base):
    __tablename__ = "rental_contracts"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    monthly_rent = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    payment_due_day = Column(Integer, nullable=False, default=1)  # Day of month rent is due
    contract_terms = Column(Text)  # Additional terms and conditions
    signed_by_owner = Column(Boolean, default=False)
    signed_by_tenant = Column(Boolean, default=False)
    contract_file_url = Column(String)  # URL to the signed contract document
    
    # Foreign Keys
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    
    # Relationships
    property = relationship("Property", back_populates="rental_contracts")
    tenant = relationship("Tenant", back_populates="rental_contracts")
    payments = relationship("RentPayment", back_populates="contract")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="contract")


class RentPayment(Base):
    __tablename__ = "rent_payments"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    payment_method = Column(String)
    transaction_id = Column(String)
    is_late = Column(Boolean, default=False)
    late_fee = Column(Float, default=0.0)
    notes = Column(Text)
    
    # Foreign Keys
    contract_id = Column(Integer, ForeignKey("rental_contracts.id"), nullable=False)
    
    # Relationships
    contract = relationship("RentalContract", back_populates="payments")


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    request_date = Column(Date, nullable=False)
    status = Column(String, default="pending")  # pending, in_progress, completed, rejected
    priority = Column(String, default="medium")  # low, medium, high, emergency
    completion_date = Column(Date)
    cost = Column(Float)
    notes = Column(Text)
    
    # Foreign Keys
    contract_id = Column(Integer, ForeignKey("rental_contracts.id"), nullable=False)
    
    # Relationships
    contract = relationship("RentalContract", back_populates="maintenance_requests")
