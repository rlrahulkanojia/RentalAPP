from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.RentalContract)
def create_rental_contract(
    *,
    db: Session = Depends(deps.get_db),
    contract_in: schemas.RentalContractCreate,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Create new rental contract.
    """
    # Verify property exists and belongs to current user
    property = crud.property.get(db, id=contract_in.property_id)
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
    
    # Verify tenant exists
    tenant = crud.tenant.get(db, id=contract_in.tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    
    # Create contract
    contract = crud.rental_contract.create(db, obj_in=contract_in)
    
    # Update property availability
    property_update = schemas.PropertyUpdate(is_available=False)
    crud.property.update(db, db_obj=property, obj_in=property_update)
    
    return contract


@router.get("/", response_model=List[schemas.RentalContract])
def read_contracts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve contracts.
    """
    if current_user.is_property_owner:
        # Get contracts for properties owned by current user
        properties = crud.property.get_multi_by_owner(db, owner_id=current_user.id)
        property_ids = [p.id for p in properties]
        
        contracts = []
        for property_id in property_ids:
            property_contracts = crud.rental_contract.get_by_property(
                db, property_id=property_id, skip=skip, limit=limit
            )
            contracts.extend(property_contracts)
        
        return contracts
    
    elif current_user.is_tenant:
        # Get contracts for current tenant
        tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
        if not tenant:
            return []
        
        contracts = crud.rental_contract.get_by_tenant(
            db, tenant_id=tenant.id, skip=skip, limit=limit
        )
        return contracts
    
    return []


@router.get("/{contract_id}", response_model=schemas.RentalContract)
def read_contract(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get contract by ID.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Check permissions
    if current_user.is_property_owner:
        property = crud.property.get(db, id=contract.property_id)
        if property.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    elif current_user.is_tenant:
        tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
        if not tenant or tenant.id != contract.tenant_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return contract


@router.put("/{contract_id}", response_model=schemas.RentalContract)
def update_contract(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    contract_in: schemas.RentalContractUpdate,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Update a contract.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Verify property belongs to current user
    property = crud.property.get(db, id=contract.property_id)
    if property.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    contract = crud.rental_contract.update(db, db_obj=contract, obj_in=contract_in)
    return contract


@router.post("/{contract_id}/payments", response_model=schemas.RentPayment)
def create_rent_payment(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    payment_in: schemas.RentPaymentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a rent payment.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Check permissions
    if current_user.is_property_owner:
        property = crud.property.get(db, id=contract.property_id)
        if property.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    elif current_user.is_tenant:
        tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
        if not tenant or tenant.id != contract.tenant_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    payment = crud.rent_payment.create(db, obj_in=payment_in)
    return payment


@router.get("/{contract_id}/payments", response_model=List[schemas.RentPayment])
def read_rent_payments(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get rent payments for a contract.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Check permissions
    if current_user.is_property_owner:
        property = crud.property.get(db, id=contract.property_id)
        if property.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    elif current_user.is_tenant:
        tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
        if not tenant or tenant.id != contract.tenant_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    payments = crud.rent_payment.get_by_contract(
        db, contract_id=contract_id, skip=skip, limit=limit
    )
    return payments


@router.post("/{contract_id}/maintenance", response_model=schemas.MaintenanceRequest)
def create_maintenance_request(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    request_in: schemas.MaintenanceRequestCreate,
    current_user: models.User = Depends(deps.get_current_tenant),
) -> Any:
    """
    Create a maintenance request.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Verify tenant is part of this contract
    tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
    if not tenant or tenant.id != contract.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    maintenance_request = crud.maintenance_request.create(db, obj_in=request_in)
    return maintenance_request


@router.get("/{contract_id}/maintenance", response_model=List[schemas.MaintenanceRequest])
def read_maintenance_requests(
    *,
    db: Session = Depends(deps.get_db),
    contract_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get maintenance requests for a contract.
    """
    contract = crud.rental_contract.get(db, id=contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    
    # Check permissions
    if current_user.is_property_owner:
        property = crud.property.get(db, id=contract.property_id)
        if property.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    elif current_user.is_tenant:
        tenant = crud.tenant.get_by_user_id(db, user_id=current_user.id)
        if not tenant or tenant.id != contract.tenant_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    maintenance_requests = crud.maintenance_request.get_by_contract(
        db, contract_id=contract_id, skip=skip, limit=limit
    )
    return maintenance_requests


@router.put("/maintenance/{request_id}", response_model=schemas.MaintenanceRequest)
def update_maintenance_request(
    *,
    db: Session = Depends(deps.get_db),
    request_id: int,
    request_in: schemas.MaintenanceRequestUpdate,
    current_user: models.User = Depends(deps.get_current_property_owner),
) -> Any:
    """
    Update a maintenance request (property owner only).
    """
    maintenance_request = crud.maintenance_request.get(db, id=request_id)
    if not maintenance_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maintenance request not found",
        )
    
    # Verify property belongs to current user
    contract = crud.rental_contract.get(db, id=maintenance_request.contract_id)
    property = crud.property.get(db, id=contract.property_id)
    if property.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    maintenance_request = crud.maintenance_request.update(
        db, db_obj=maintenance_request, obj_in=request_in
    )
    return maintenance_request
