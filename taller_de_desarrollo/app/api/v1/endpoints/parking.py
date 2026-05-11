from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.parking import DetectionCreate, ParkingSpotRead, ParkingSummary
from app.services.parking_service import ParkingService

router = APIRouter()


@router.post("/detections", response_model=ParkingSpotRead, status_code=status.HTTP_201_CREATED)
def receive_detection(detection: DetectionCreate, db: Session = Depends(get_db)) -> ParkingSpotRead:
    spot = ParkingService(db).update_or_create_spot(detection)
    if not spot:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo procesar la detección")
    return spot


@router.get("/status", response_model=List[ParkingSpotRead])
def get_parking_status(db: Session = Depends(get_db)) -> List[ParkingSpotRead]:
    return ParkingService(db).list_spots()


@router.get("/summary", response_model=ParkingSummary)
def get_parking_summary(db: Session = Depends(get_db)) -> ParkingSummary:
    return ParkingService(db).summary()
