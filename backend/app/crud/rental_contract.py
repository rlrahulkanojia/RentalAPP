from datetime import date
from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.rental_contract import RentalContract, RentPayment, MaintenanceRequest
from app.schemas.rental_contract import (
    RentalContractCreate, RentalContractUpdate,
    RentPaymentCreate, RentPaymentUpdate,
    MaintenanceRequestCreate, MaintenanceRequestUpdate
)


class CRUDRentalContract(CRUDBase[RentalContract, RentalContractCreate, RentalContractUpdate]):
    def get_by_property(
        self, db: Session, *, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[RentalContract]:
        return (
            db.query(self.model)
            .filter(RentalContract.property_id == property_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_tenant(
        self, db: Session, *, tenant_id: int, skip: int = 0, limit: int = 100
    ) -> List[RentalContract]:
        return (
            db.query(self.model)
            .filter(RentalContract.tenant_id == tenant_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_active_contracts(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[RentalContract]:
        return (
            db.query(self.model)
            .filter(RentalContract.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_expiring_contracts(
        self, db: Session, *, days: int = 30, skip: int = 0, limit: int = 100
    ) -> List[RentalContract]:
        today = date.today()
        expiry_date = today.replace(day=today.day + days)
        return (
            db.query(self.model)
            .filter(
                RentalContract.is_active == True,
                RentalContract.end_date <= expiry_date,
                RentalContract.end_date >= today
            )
            .offset(skip)
            .limit(limit)
            .all()
        )


class CRUDRentPayment(CRUDBase[RentPayment, RentPaymentCreate, RentPaymentUpdate]):
    def get_by_contract(
        self, db: Session, *, contract_id: int, skip: int = 0, limit: int = 100
    ) -> List[RentPayment]:
        return (
            db.query(self.model)
            .filter(RentPayment.contract_id == contract_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_late_payments(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[RentPayment]:
        return (
            db.query(self.model)
            .filter(RentPayment.is_late == True)
            .offset(skip)
            .limit(limit)
            .all()
        )


class CRUDMaintenanceRequest(CRUDBase[MaintenanceRequest, MaintenanceRequestCreate, MaintenanceRequestUpdate]):
    def get_by_contract(
        self, db: Session, *, contract_id: int, skip: int = 0, limit: int = 100
    ) -> List[MaintenanceRequest]:
        return (
            db.query(self.model)
            .filter(MaintenanceRequest.contract_id == contract_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[MaintenanceRequest]:
        return (
            db.query(self.model)
            .filter(MaintenanceRequest.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_priority(
        self, db: Session, *, priority: str, skip: int = 0, limit: int = 100
    ) -> List[MaintenanceRequest]:
        return (
            db.query(self.model)
            .filter(MaintenanceRequest.priority == priority)
            .offset(skip)
            .limit(limit)
            .all()
        )


rental_contract = CRUDRentalContract(RentalContract)
rent_payment = CRUDRentPayment(RentPayment)
maintenance_request = CRUDMaintenanceRequest(MaintenanceRequest)
