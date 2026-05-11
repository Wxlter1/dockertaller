from datetime import datetime

from sqlalchemy.orm import Session

from app.db.models import ParkingDetection, ParkingSpot
from app.schemas.parking import DetectionCreate


class ParkingService:
    def __init__(self, db: Session):
        self.db = db

    def list_spots(self):
        return self.db.query(ParkingSpot).order_by(ParkingSpot.spot_code).all()

    def get_spot_by_code(self, spot_code: str):
        return self.db.query(ParkingSpot).filter(ParkingSpot.spot_code == spot_code).first()

    def update_or_create_spot(self, detection: DetectionCreate):
        spot = self.get_spot_by_code(detection.spot_code)
        if not spot:
            spot = ParkingSpot(
                spot_code=detection.spot_code,
                name=detection.name,
                status=detection.status.value,
                confidence=detection.confidence,
                last_seen=detection.timestamp,
            )
            self.db.add(spot)
        else:
            spot.name = detection.name
            spot.status = detection.status.value
            spot.confidence = detection.confidence
            spot.last_seen = detection.timestamp

        self.db.add(ParkingDetection(
            spot_code=detection.spot_code,
            status=detection.status.value,
            confidence=detection.confidence,
            timestamp=detection.timestamp or datetime.utcnow(),
        ))
        self.db.commit()
        self.db.refresh(spot)
        return spot

    def summary(self):
        spots = self.list_spots()
        occupied = sum(1 for spot in spots if spot.status == "occupied")
        available = sum(1 for spot in spots if spot.status == "available")
        last_seen = max((spot.last_seen for spot in spots if spot.last_seen is not None), default=None)
        return {
            "total_spots": len(spots),
            "occupied_count": occupied,
            "available_count": available,
            "last_updated": last_seen,
        }
