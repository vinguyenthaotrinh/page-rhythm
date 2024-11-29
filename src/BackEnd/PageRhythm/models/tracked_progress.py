from datetime import datetime
from models.base_entity import BaseEntity

class TrackedProgress(BaseEntity):

    def __init__(self, 
                 user_id: int,
                 book_id: str,
                 page_number: int,
                 status: str,
                 most_recent_update: datetime.datetime):
        super().__init__()
        self.user_id = user_id
        self.book_id = book_id
        self.page_number = page_number
        self.status = status
        self.most_recent_update = most_recent_update

    def __str__(self) -> str:
        return f"TrackedProgress(user_id={self.user_id}, book_id={self.book_id}, page_number={self.page_number}, status={self.status}, most_recent_update={self.most_recent_update})"
    
    def get_user_id(self) -> int:
        return self.user_id
    
    def get_book_id(self) -> str:
        return self.book_id
    
    def get_page_number(self) -> int:
        return self.page_number
    
    def get_status(self) -> str:
        return self.status
    
    def get_most_recent_update(self) -> datetime.datetime:
        return self.most_recent_update
    
    def set_user_id(self, user_id: int) -> bool:
        if user_id <= 0:
            return False
        self.user_id = user_id
        return True
    
    def set_book_id(self, book_id: str):
        self.book_id = book_id

    def set_page_number(self, page_number: int) -> bool:
        if page_number < 0:
            return False
        self.page_number = page_number
        return True
    
    def set_status(self, status: str):
        self.status = status

    def set_most_recent_update(self, most_recent_update: datetime.datetime):
        self.most_recent_update = most_recent_update

    def to_serializable_JSON(self) -> dict:
        return {
            "user_id": self.user_id,
            "book_id": self.book_id,
            "page_number": self.page_number,
            "status": self.status,
            "most_recent_update": self.most_recent_update.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def get_data_from_serializable_JSON(self, dictionary: dict):
        self.user_id = dictionary["user_id"]
        self.book_id = dictionary["book_id"]
        self.page_number = dictionary["page_number"]
        self.status = dictionary["status"]
        self.most_recent_update = datetime.datetime.strptime(dictionary["most_recent_update"], "%Y-%m-%d %H:%M:%S")