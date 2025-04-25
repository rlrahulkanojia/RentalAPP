from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/register", response_model=schemas.Tenant)
def register_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Register as a tenant.
    """
    # Check if user is already a tenant
    tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
    if tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already registered as a tenant",
        )
    
    # Check if identification number is already used
    existing_tenant = crud.tenant.get_by_identification(
        db, identification_number=tenant_in.identification_number
    )
    if existing_tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Identification number already registered",
        )
    
    # Create tenant profile
    tenant = crud.tenant.create_with_user(db, obj_in=tenant_in, user_id=current_user.id)
    
    # Update user to mark as tenant
    user_update = schemas.UserUpdate(is_tenant=True)
    crud.user.update(db, db_obj=current_user, obj_in=user_update)
    
    return tenant


@router.get("/me", response_model=schemas.Tenant)
def read_tenant_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_tenant),
) -> Any:
    """
    Get current tenant profile.
    """
    tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant profile not found",
        )
    return tenant


@router.put("/me", response_model=schemas.Tenant)
def update_tenant_me(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantUpdate,
    current_user: models.User = Depends(deps.get_current_tenant),
) -> Any:
    """
    Update own tenant profile.
    """
    tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant profile not found",
        )
    tenant = crud.tenant.update(db, db_obj=tenant, obj_in=tenant_in)
    return tenant


@router.get("/{tenant_id}", response_model=schemas.Tenant)
def read_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get tenant by ID.
    """
    tenant = crud.tenant.get(db, id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant
