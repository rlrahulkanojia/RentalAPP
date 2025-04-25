from typing import List, Optional, Union
from pydantic import BaseModel, Field


# Shared properties
class PropertyBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = "India"
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    area_sqft: Optional[float] = None
    monthly_rent: Optional[float] = None
    security_deposit: Optional[float] = None
    is_available: Optional[bool] = True
    amenities: Optional[str] = None  # JSON string
    images: Optional[str] = None  # JSON array of URLs


# Properties to receive on property creation
class PropertyCreate(PropertyBase):
    title: str
    property_type: str
    address: str
    city: str
    state: str
    zip_code: str
    bedrooms: int
    bathrooms: float
    monthly_rent: float
    security_deposit: float


# Properties to receive on property update
class PropertyUpdate(PropertyBase):
    pass


class PropertyInDBBase(PropertyBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class Property(PropertyInDBBase):
    pass


# Additional properties stored in DB
class PropertyInDB(PropertyInDBBase):
    pass
