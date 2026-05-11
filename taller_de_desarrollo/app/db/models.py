from sqlalchemy import Column, DateTime, Float, Integer, String, Text, func

from app.db.base import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)


class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(Integer, primary_key=True, index=True)
    spot_code = Column(String(32), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    status = Column(String(32), nullable=False, default="available")
    confidence = Column(Float, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class ParkingDetection(Base):
    __tablename__ = "parking_detections"

    id = Column(Integer, primary_key=True, index=True)
    spot_code = Column(String(32), nullable=False, index=True)
    status = Column(String(32), nullable=False)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
