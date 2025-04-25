from app.models.user import User
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.rental_contract import RentalContract, RentPayment, MaintenanceRequest

# For Alembic to detect all models
__all__ = [
    "User",
    "Property",
    "Tenant",
    "RentalContract",
    "RentPayment",
    "MaintenanceRequest",
]
