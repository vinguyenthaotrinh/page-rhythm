import datetime
from models.base_entity import BaseEntity

class BookRating(BaseEntity):

    def __init__(self, 
                 user_id: int,
                 book_id: int,
                 rating: int,
                 date: datetime.date):
        super().__init__()
        self.user_id = user_id
        self.book_id = book_id
        self.rating = rating
        self.date = date

    def __str__(self) -> str:
        return f"BookRating(user_id={self.user_id}, book_id={self.book_id}, rating={self.rating}, date={self.date})"
    
    def get_user_id(self) -> int:
        return self.user_id
    
    def get_book_id(self) -> int:
        return self.book_id
    
    def get_rating(self) -> int:
        return self.rating
    
    def get_date(self) -> datetime.date:
        return self.date
    
    def set_user_id(self, user_id: int) -> bool:
        if user_id <= 0:
            return False
        self.user_id = user_id
        return True

    def set_book_id(self, book_id: int):
        self.book_id = book_id

    def set_rating(self, rating: int) -> bool:
        if rating < 0 or rating > 5:
            return False
        self.rating = rating
        return True

    def set_date(self, date: datetime.date):
        self.date = date

    def to_serializable_JSON(self) -> dict:
        return {
            "user_id": self.user_id,
            "book_id": self.book_id,
            "rating": self.rating,
            "date": self.date.strftime("%Y-%m-%d")
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_user_id(dictionary["user_id"])
        self.set_book_id(dictionary["book_id"])
        self.set_rating(dictionary["rating"])
        self.set_date(datetime.datetime.strptime(dictionary["date"], "%Y-%m-%d").date())

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "BookRating":
        return BookRating(
            user_id=dictionary["user_id"],
            book_id=dictionary["book_id"],
            rating=dictionary["rating"],
            date=datetime.datetime.strptime(dictionary["date"], "%Y-%m-%d").date()
        )