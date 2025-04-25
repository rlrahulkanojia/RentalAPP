from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    date_of_birth = Column(Date)
    occupation = Column(String)
    employer = Column(String)
    annual_income = Column(Integer)
    identification_type = Column(String)  # Aadhar, PAN, Passport, etc.
    identification_number = Column(String, unique=True)
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    references = Column(Text)  # Stored as JSON
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="tenant_profile")
    rental_contracts = relationship("RentalContract", back_populates="tenant")
