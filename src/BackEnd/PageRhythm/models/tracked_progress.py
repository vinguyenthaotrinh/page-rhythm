import datetime
from enum import Enum
from typing import Optional
from models.base_entity import BaseEntity

class ReadingStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"

class TrackedProgress(BaseEntity):

    def __init__(self, 
                 user_id: int,
                 book_id: int,
                 page_number: Optional[int],
                 status: ReadingStatus,
                 most_recent_update_date: Optional[datetime.datetime]):
        super().__init__()
        self.user_id                    = user_id
        self.book_id                    = book_id
        self.page_number                = page_number
        self.status                     = status
        self.most_recent_update_date    = most_recent_update_date

    def __str__(self) -> str:
        return f"TrackedProgress(user_id={self.user_id}, book_id={self.book_id}, page_number={self.page_number}, status={self.status}, most_recent_update_date={self.most_recent_update_date})"
    
    def get_user_id(self) -> int:
        return self.user_id
    
    def get_book_id(self) -> int:
        return self.book_id
    
    def get_page_number(self) -> Optional[int]:
        return self.page_number
    
    def get_status(self) -> ReadingStatus:
        return self.status
    
    def get_most_recent_update_date(self) -> Optional[datetime.datetime]:
        return self.most_recent_update_date
    
    def set_user_id(self, user_id: int) -> bool:
        if user_id <= 0:
            return False
        self.user_id = user_id
        return True
    
    def set_book_id(self, book_id: int):
        self.book_id = book_id

    def set_page_number(self, page_number: Optional[int]) -> bool:
        if page_number is None:
            self.page_number = None
            return True
        if page_number < 0:
            return False
        self.page_number = page_number
        return True
    
    def set_status(self, status: ReadingStatus):
        self.status = status

    def set_most_recent_update_date(self, most_recent_update_date: Optional[datetime.datetime]):
        self.most_recent_update_date = most_recent_update_date

    def to_serializable_JSON(self) -> dict:
        return {
            "user_id":                  self.user_id,
            "book_id":                  self.book_id,
            "page_number":              self.page_number,
            "status":                   self.status.value,
            "most_recent_update_date":  self.most_recent_update_date.isoformat() if self.most_recent_update_date else None
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.user_id                    = dictionary["user_id"]
        self.book_id                    = dictionary["book_id"]
        self.page_number                = dictionary["page_number"]
        self.status                     = ReadingStatus(dictionary["status"])
        self.most_recent_update_date    = datetime.datetime.fromisoformat(dictionary["most_recent_update_date"]) if dictionary["most_recent_update_date"] else None

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "TrackedProgress":
        return TrackedProgress(
            user_id                 =   dictionary["user_id"],
            book_id                 =   dictionary["book_id"],
            page_number             =   dictionary["page_number"],
            status                  =   ReadingStatus(dictionary["status"].lower()),
            most_recent_update_date =   datetime.datetime.fromisoformat(dictionary["most_recent_update_date"]) if dictionary["most_recent_update_date"] else None
        )