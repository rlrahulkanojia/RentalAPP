from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    property_type = Column(String, nullable=False)  # Apartment, House, Condo, etc.
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    country = Column(String, nullable=False, default="India")
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Float, nullable=False)
    area_sqft = Column(Float)
    monthly_rent = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)
    amenities = Column(Text)  # Stored as JSON string
    images = Column(Text)  # Stored as JSON array of image URLs
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="owned_properties")
    rental_contracts = relationship("RentalContract", back_populates="property")
