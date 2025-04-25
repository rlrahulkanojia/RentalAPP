from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate


class CRUDProperty(CRUDBase[Property, PropertyCreate, PropertyUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Property]:
        return (
            db.query(self.model)
            .filter(Property.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_available_properties(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Property]:
        return (
            db.query(self.model)
            .filter(Property.is_available == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search_properties(
        self, 
        db: Session, 
        *, 
        city: Optional[str] = None,
        state: Optional[str] = None,
        min_bedrooms: Optional[int] = None,
        max_rent: Optional[float] = None,
        property_type: Optional[str] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Property]:
        query = db.query(self.model).filter(Property.is_available == True)
        
        if city:
            query = query.filter(Property.city == city)
        if state:
            query = query.filter(Property.state == state)
        if min_bedrooms:
            query = query.filter(Property.bedrooms >= min_bedrooms)
        if max_rent:
            query = query.filter(Property.monthly_rent <= max_rent)
        if property_type:
            query = query.filter(Property.property_type == property_type)
            
        return query.offset(skip).limit(limit).all()


property = CRUDProperty(Property)
