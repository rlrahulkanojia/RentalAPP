from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Property])
def read_properties(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    state: Optional[str] = None,
    min_bedrooms: Optional[int] = None,
    max_rent: Optional[float] = None,
    property_type: Optional[str] = None,
) -> Any:
    """
    Retrieve properties with optional filtering.
    """
    if any([city, state, min_bedrooms, max_rent, property_type]):
        properties = crud.property.search_properties(
            db, 
            city=city,
            state=state,
            min_bedrooms=min_bedrooms,
            max_rent=max_rent,
            property_type=property_type,
            skip=skip, 
            limit=limit
        )
    else:
        properties = crud.property.get_available_properties(db, skip=skip, limit=limit)
    return properties


@router.post("/", response_model=schemas.Property)
def create_property(
    *,
    db: Session = Depends(deps.get_db),
    property_in: schemas.PropertyCreate,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Create new property.
    """
    property = crud.property.create(
        db, obj_in=property_in, owner_id=current_user.id
    )
    return property


@router.get("/my-properties", response_model=List[schemas.Property])
def read_user_properties(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Retrieve properties owned by current user.
    """
    properties = crud.property.get_multi_by_owner(
        db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return properties


@router.get("/{property_id}", response_model=schemas.Property)
def read_property(
    *,
    db: Session = Depends(deps.get_db),
    property_id: int,
) -> Any:
    """
    Get property by ID.
    """
    property = crud.property.get(db, id=property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )
    return property


@router.put("/{property_id}", response_model=schemas.Property)
def update_property(
    *,
    db: Session = Depends(deps.get_db),
    property_id: int,
    property_in: schemas.PropertyUpdate,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Update a property.
    """
    property = crud.property.get(db, id=property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )
    if property.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    property = crud.property.update(db, db_obj=property, obj_in=property_in)
    return property


@router.delete("/{property_id}", response_model=schemas.Property)
def delete_property(
    *,
    db: Session = Depends(deps.get_db),
    property_id: int,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Delete a property.
    """
    property = crud.property.get(db, id=property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )
    if property.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    property = crud.property.remove(db, id=property_id)
    return property
