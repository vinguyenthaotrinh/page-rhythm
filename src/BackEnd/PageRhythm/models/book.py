from models.base_entity import BaseEntity

class Book(BaseEntity):

    def __init__(self, 
                 title: str,
                 author: str,
                 summary: str,
                 content: str,
                 genre: str,
                 owner_id: int,
                 book_id: int = None):
        super().__init__()
        self.book_id = book_id
        self.title = title
        self.author = author
        self.summary = summary
        self.content = content
        self.genre = genre
        self.owner_id = owner_id

    def __str__(self) -> str:
        return f"Book(book_id={self.book_id}, title={self.title}, author={self.author}, summary={self.summary}, content={self.content}, genre={self.genre}, owner_id={self.owner_id})"
    
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
    
    def to_serializable_JSON(self) -> dict:
        return {
            "book_id": self.book_id,
            "title": self.title,
            "author": self.author,
            "summary": self.summary,
            "content": self.content,
            "genre": self.genre,
            "owner_id": self.owner_id
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_book_id(dictionary["book_id"])
        self.set_title(dictionary["title"])
        self.set_author(dictionary["author"])
        self.set_summary(dictionary["summary"])
        self.set_content(dictionary["content"])
        self.set_genre(dictionary["genre"])
        self.set_owner_id(dictionary["owner_id"])