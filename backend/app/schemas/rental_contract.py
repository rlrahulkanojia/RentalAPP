from datetime import date
from typing import List, Optional

from pydantic import BaseModel


# Shared properties for RentalContract
class RentalContractBase(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    monthly_rent: Optional[float] = None
    security_deposit: Optional[float] = None
    is_active: Optional[bool] = True
    payment_due_day: Optional[int] = 1
    contract_terms: Optional[str] = None
    signed_by_owner: Optional[bool] = False
    signed_by_tenant: Optional[bool] = False
    contract_file_url: Optional[str] = None


# Properties to receive on contract creation
class RentalContractCreate(RentalContractBase):
    start_date: date
    end_date: date
    monthly_rent: float
    security_deposit: float
    property_id: int
    tenant_id: int


# Properties to receive on contract update
class RentalContractUpdate(RentalContractBase):
    pass


class RentalContractInDBBase(RentalContractBase):
    id: int
    property_id: int
    tenant_id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class RentalContract(RentalContractInDBBase):
    pass


# Additional properties stored in DB
class RentalContractInDB(RentalContractInDBBase):
    pass


# Shared properties for RentPayment
class RentPaymentBase(BaseModel):
    amount: Optional[float] = None
    payment_date: Optional[date] = None
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    is_late: Optional[bool] = False
    late_fee: Optional[float] = 0.0
    notes: Optional[str] = None


# Properties to receive on payment creation
class RentPaymentCreate(RentPaymentBase):
    amount: float
    payment_date: date
    contract_id: int


# Properties to receive on payment update
class RentPaymentUpdate(RentPaymentBase):
    pass


class RentPaymentInDBBase(RentPaymentBase):
    id: int
    contract_id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class RentPayment(RentPaymentInDBBase):
    pass


# Additional properties stored in DB
class RentPaymentInDB(RentPaymentInDBBase):
    pass


# Shared properties for MaintenanceRequest
class MaintenanceRequestBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    request_date: Optional[date] = None
    status: Optional[str] = "pending"
    priority: Optional[str] = "medium"
    completion_date: Optional[date] = None
    cost: Optional[float] = None
    notes: Optional[str] = None


# Properties to receive on maintenance request creation
class MaintenanceRequestCreate(MaintenanceRequestBase):
    title: str
    description: str
    request_date: date
    contract_id: int


# Properties to receive on maintenance request update
class MaintenanceRequestUpdate(MaintenanceRequestBase):
    pass


class MaintenanceRequestInDBBase(MaintenanceRequestBase):
    id: int
    contract_id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class MaintenanceRequest(MaintenanceRequestInDBBase):
    pass


# Additional properties stored in DB
class MaintenanceRequestInDB(MaintenanceRequestInDBBase):
    pass
