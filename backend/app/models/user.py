from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    phone_number = Column(String)
    is_active = Column(Boolean, default=True)
    is_property_owner = Column(Boolean, default=False)
    is_tenant = Column(Boolean, default=False)
    
    # Relationships
    owned_properties = relationship("Property", back_populates="owner")
    tenant_profile = relationship("Tenant", back_populates="user", uselist=False)
