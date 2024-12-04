import datetime
from models.base_entity import BaseEntity

class Book(BaseEntity):

    def __init__(self, 
                 title: str,
                 author: str,
                 summary: str,
                 content: str,
                 genre: str,
                 owner_id: int,
                 released_date: datetime.date,
                 book_id: int = None,
                 book_rating: float = 0.0,
                 image: str = None):
        super().__init__()
        self.book_id = book_id
        self.title = title
        self.author = author
        self.summary = summary
        self.content = content
        self.genre = genre
        self.owner_id = owner_id
        self.released_date = released_date 
        self.book_rating = book_rating  
        self.image = image 

    def __str__(self) -> str:
        return (f"Book(book_id={self.book_id}, title={self.title}, author={self.author}, "
                f"summary={self.summary}, content={self.content}, genre={self.genre}, "
                f"owner_id={self.owner_id}, released_date={self.released_date}, "
                f"book_rating={self.book_rating}, image={'Yes' if self.image else 'No'})")
    
    # Getter methods
    def get_book_id(self) -> int:
        return self.book_id
    
    def get_title(self) -> str:
        return self.title
    
    def get_author(self) -> str:
        return self.author
    
    def get_summary(self) -> str:
        return self.summary
    
    def get_content(self) -> str:
        return self.content
    
    def get_genre(self) -> str:
        return self.genre
    
    def get_owner_id(self) -> int:
        return self.owner_id

    def get_released_date(self) -> datetime.date:
        return self.released_date

    def get_book_rating(self) -> float:
        return self.book_rating

    def get_image(self) -> str:
        return self.image
    
    def set_book_id(self, book_id: int):
        self.book_id = book_id

    def set_title(self, title: str):
        self.title = title

    def set_author(self, author: str):
        self.author = author

    def set_summary(self, summary: str):
        self.summary = summary

    def set_content(self, content: str):
        self.content = content

    def set_genre(self, genre: str):
        self.genre = genre

    def set_owner_id(self, owner_id: int) -> bool:
        if owner_id <= 0:
            return False
        self.owner_id = owner_id
        return True

    def set_released_date(self, released_date: datetime.date):
        self.released_date = released_date

    def set_book_rating(self, book_rating: float):
        self.book_rating = book_rating

    def set_image(self, image: str):
        self.image = image
    
    def to_serializable_JSON(self) -> dict:
        return {
            "book_id": self.book_id,
            "title": self.title,
            "author": self.author,
            "summary": self.summary,
            "content": self.content,
            "genre": self.genre,
            "owner_id": self.owner_id,
            "released_date": self.released_date,
            "book_rating": self.book_rating,
            "image": self.image
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_book_id(dictionary.get("book_id"))
        self.set_title(dictionary.get("title"))
        self.set_author(dictionary.get("author"))
        self.set_summary(dictionary.get("summary"))
        self.set_content(dictionary.get("content"))
        self.set_genre(dictionary.get("genre"))
        self.set_owner_id(dictionary.get("owner_id"))
        self.set_released_date(dictionary.get("released_date"))
        self.set_book_rating(dictionary.get("book_rating", 0.0))
        self.set_image(dictionary.get("image"))
