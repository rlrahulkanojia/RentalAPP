from datetime import date
from typing import Optional

from pydantic import BaseModel


# Shared properties
class TenantBase(BaseModel):
    date_of_birth: Optional[date] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    annual_income: Optional[int] = None
    identification_type: Optional[str] = None
    identification_number: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    references: Optional[str] = None  # JSON string


# Properties to receive on tenant creation
class TenantCreate(TenantBase):
    date_of_birth: date
    identification_type: str
    identification_number: str


# Properties to receive on tenant update
class TenantUpdate(TenantBase):
    pass


class TenantInDBBase(TenantBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class Tenant(TenantInDBBase):
    pass


# Additional properties stored in DB
class TenantInDB(TenantInDBBase):
    pass
