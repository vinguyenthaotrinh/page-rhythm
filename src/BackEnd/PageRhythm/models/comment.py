from typing import Optional
from models.base_entity import BaseEntity

class Comment(BaseEntity):

    def __init__(self, 
                 comment_id: str,
                 book_id: str,
                 comment_author_id: int,
                 content: str,
                 replied_comment_id: Optional[str]):
        super().__init__()
        self.comment_id = comment_id
        self.book_id = book_id
        self.comment_author_id = comment_author_id
        self.content = content
        self.replied_comment_id = replied_comment_id

    def __str__(self) -> str:
        return f"Comment(comment_id={self.comment_id}, book_id={self.book_id}, comment_author_id={self.comment_author_id}, content={self.content}, replied_comment_id={self.replied_comment_id})"
    
    def get_comment_id(self) -> str:
        return self.comment_id
    
    def get_book_id(self) -> str:
        return self.book_id
    
    def get_comment_author_id(self) -> int:
        return self.comment_author_id
    
    def get_content(self) -> str:
        return self.content
    
    def get_replied_comment_id(self) -> Optional[str]:
        return self.replied_comment_id
    
    def set_comment_id(self, comment_id: str):
        self.comment_id = comment_id

    def set_book_id(self, book_id: str):
        self.book_id = book_id

    def set_comment_author_id(self, comment_author_id: int) -> bool:
        if comment_author_id < 0:
            return False
        self.comment_author_id = comment_author_id
        return True
    
    def set_content(self, content: str):
        self.content = content

    def set_replied_comment_id(self, replied_comment_id: Optional[str]):
        self.replied_comment_id = replied_comment_id

    def to_serializable_JSON(self) -> dict:
        return {
            "comment_id": self.comment_id,
            "book_id": self.book_id,
            "comment_author_id": self.comment_author_id,
            "content": self.content,
            "replied_comment_id": self.replied_comment_id
        }
    
    def get_data_from_serializable_JSON(self, dictionary: dict):
        self.set_comment_id(dictionary["comment_id"])
        self.set_book_id(dictionary["book_id"])
        self.set_comment_author_id(dictionary["comment_author_id"])
        self.set_content(dictionary["content"])
        self.set_replied_comment_id(dictionary["replied_comment_id"])