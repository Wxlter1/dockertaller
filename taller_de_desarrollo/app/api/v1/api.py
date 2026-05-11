from fastapi import APIRouter

from app.api.v1.endpoints import items, parking

api_router = APIRouter()
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(parking.router, prefix="/parking", tags=["parking"])
