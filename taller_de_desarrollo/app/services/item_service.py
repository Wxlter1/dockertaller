from sqlalchemy.orm import Session

from app.db.models import Item
from app.schemas.item import ItemCreate, ItemUpdate


class ItemService:
    def __init__(self, db: Session):
        self.db = db

    def list_items(self):
        return self.db.query(Item).order_by(Item.id).all()

    def get_item(self, item_id: int):
        return self.db.query(Item).filter(Item.id == item_id).first()

    def create_item(self, item_in: ItemCreate):
        item = Item(**item_in.dict())
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_item(self, item_id: int, item_in: ItemUpdate):
        item = self.get_item(item_id)
        if not item:
            return None
        for field, value in item_in.dict(exclude_unset=True).items():
            setattr(item, field, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete_item(self, item_id: int) -> bool:
        item = self.get_item(item_id)
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
