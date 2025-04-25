from fastapi import APIRouter

from app.api.endpoints import auth, users, properties, tenants, contracts

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
