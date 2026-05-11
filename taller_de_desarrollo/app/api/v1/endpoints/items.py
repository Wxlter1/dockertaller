from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.services.item_service import ItemService

router = APIRouter()


@router.get("/", response_model=List[ItemRead])
def list_items(db: Session = Depends(get_db)) -> List[ItemRead]:
    return ItemService(db).list_items()


@router.post("/", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db)) -> ItemRead:
    return ItemService(db).create_item(item_in)


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: Session = Depends(get_db)) -> ItemRead:
    item = ItemService(db).get_item(item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=ItemRead)
def update_item(item_id: int, item_in: ItemUpdate, db: Session = Depends(get_db)) -> ItemRead:
    item = ItemService(db).update_item(item_id, item_in)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)) -> None:
    success = ItemService(db).delete_item(item_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return None
