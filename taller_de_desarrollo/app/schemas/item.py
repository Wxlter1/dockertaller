from typing import Optional

from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=500)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=500)


class ItemRead(ItemBase):
    id: int

    class Config:
        orm_mode = True
