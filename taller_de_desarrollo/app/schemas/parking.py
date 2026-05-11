from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ParkingStatus(str, Enum):
    occupied = "occupied"
    available = "available"


class DetectionCreate(BaseModel):
    spot_code: str = Field(..., min_length=1, max_length=32)
    name: str = Field(..., min_length=3, max_length=120)
    status: ParkingStatus
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)


class ParkingSpotRead(BaseModel):
    spot_code: str
    name: str
    status: ParkingStatus
    confidence: Optional[float]
    last_seen: Optional[datetime]

    class Config:
        orm_mode = True


class ParkingSummary(BaseModel):
    total_spots: int
    occupied_count: int
    available_count: int
    last_updated: Optional[datetime]
