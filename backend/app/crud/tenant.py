from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


class CRUDTenant(CRUDBase[Tenant, TenantCreate, TenantUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Tenant]:
        return db.query(self.model).filter(Tenant.user_id == user_id).first()
    
    def get_by_identification(
        self, db: Session, *, identification_number: str
    ) -> Optional[Tenant]:
        return (
            db.query(self.model)
            .filter(Tenant.identification_number == identification_number)
            .first()
        )
    
    def create_with_user(
        self, db: Session, *, obj_in: TenantCreate, user_id: int
    ) -> Tenant:
        db_obj = Tenant(
            date_of_birth=obj_in.date_of_birth,
            occupation=obj_in.occupation,
            employer=obj_in.employer,
            annual_income=obj_in.annual_income,
            identification_type=obj_in.identification_type,
            identification_number=obj_in.identification_number,
            emergency_contact_name=obj_in.emergency_contact_name,
            emergency_contact_phone=obj_in.emergency_contact_phone,
            references=obj_in.references,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


tenant = CRUDTenant(Tenant)
