import base64
from typing import Optional
from datetime import datetime
from models.base_entity import BaseEntity

class Comment(BaseEntity):

    def __init__(self, 
                 comment_id: int,
                 book_id: int,
                 comment_author_id: int,
                 content: str,
                 replied_comment_id: Optional[int],
                 create_time: datetime):
        super().__init__()
        self.comment_id = comment_id
        self.book_id = book_id
        self.comment_author_id = comment_author_id
        self.content = content
        self.replied_comment_id = replied_comment_id
        self.create_time = create_time

    def __str__(self) -> str:
        return f"Comment(comment_id={self.comment_id}, book_id={self.book_id}, comment_author_id={self.comment_author_id}, content={self.content}, replied_comment_id={self.replied_comment_id}, create_time={self.create_time})"
    
    def get_comment_id(self) -> int:
        return self.comment_id
    
    def get_book_id(self) -> int:
        return self.book_id
    
    def get_comment_author_id(self) -> int:
        return self.comment_author_id
    
    def get_content(self) -> str:
        return self.content
    
    def get_replied_comment_id(self) -> Optional[int]:
        return self.replied_comment_id
    
    def get_create_time(self) -> datetime:
        return self.create_time
    
    def set_comment_id(self, comment_id: int):
        self.comment_id = comment_id

    def set_book_id(self, book_id: int):
        self.book_id = book_id

    def set_comment_author_id(self, comment_author_id: int) -> bool:
        if comment_author_id <= 0:
            return False
        self.comment_author_id = comment_author_id
        return True
    
    def set_content(self, content: str):
        self.content = content

    def set_replied_comment_id(self, replied_comment_id: Optional[int]):
        self.replied_comment_id = replied_comment_id

    def set_create_time(self, create_time: datetime):
        self.create_time = create_time

    def to_serializable_JSON(self) -> dict:
        return {
            "comment_id": self.comment_id,
            "book_id": self.book_id,
            "comment_author_id": self.comment_author_id,
            "content": self.content,
            "replied_comment_id": self.replied_comment_id,
            "create_time": self.create_time.isoformat()
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_comment_id(dictionary["comment_id"])
        self.set_book_id(dictionary["book_id"])
        self.set_comment_author_id(dictionary["comment_author_id"])
        self.set_content(dictionary["content"])
        self.set_replied_comment_id(dictionary["replied_comment_id"])
        self.set_create_time(datetime.fromisoformat(dictionary["create_time"]))

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "Comment":
        comment = Comment("", "", 0, "", None, datetime.now())
        comment.from_serializable_JSON(dictionary)
        return comment
    

class DisplayedComment(BaseEntity):

    def __init__(self, 
                 comment_id: int,
                 book_id: int,
                 comment_author_id: int,
                 comment_author_full_name: str,
                 comment_author_profile_picture: Optional[bytes],
                 content: str,
                 replied_comment_id: Optional[int],
                 create_time: datetime):
        super().__init__()
        self.comment_id = comment_id
        self.book_id = book_id
        self.comment_author_id = comment_author_id
        self.content = content
        self.replied_comment_id = replied_comment_id
        self.create_time = create_time
        self.comment_author_full_name = comment_author_full_name
        self.comment_author_profile_picture = comment_author_profile_picture

    def __str__(self) -> str:
        return f"DisplayedComment(comment_id={self.comment_id}, book_id={self.book_id}, comment_author_id={self.comment_author_id}, content={self.content}, replied_comment_id={self.replied_comment_id}, create_time={self.create_time})"
    
    def get_comment_id(self) -> int:
        return self.comment_id
    
    def get_book_id(self) -> int:
        return self.book_id
    
    def get_comment_author_id(self) -> int:
        return self.comment_author_id
    
    def get_content(self) -> str:
        return self.content
    
    def get_replied_comment_id(self) -> Optional[int]:
        return self.replied_comment_id
    
    def get_create_time(self) -> datetime:
        return self.create_time
    
    def set_comment_id(self, comment_id: int):
        self.comment_id = comment_id

    def set_book_id(self, book_id: int):
        self.book_id = book_id

    def set_comment_author_id(self, comment_author_id: int) -> bool:
        if comment_author_id <= 0:
            return False
        self.comment_author_id = comment_author_id
        return True
    
    def set_content(self, content: str):
        self.content = content

    def set_replied_comment_id(self, replied_comment_id: Optional[int]):
        self.replied_comment_id = replied_comment_id

    def set_create_time(self, create_time: datetime):
        self.create_time = create_time

    def to_serializable_JSON(self) -> dict:
        return {
            "comment_id": self.comment_id,
            "book_id": self.book_id,
            "comment_author_id": self.comment_author_id,
            "content": self.content,
            "replied_comment_id": self.replied_comment_id,
            "create_time": self.create_time.isoformat(),
            "comment_author_full_name": self.comment_author_full_name,
            "comment_author_profile_picture": base64.b64encode(self.comment_author_profile_picture).decode() if self.comment_author_profile_picture else None
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_comment_id(dictionary["comment_id"])
        self.set_book_id(dictionary["book_id"])
        self.set_comment_author_id(dictionary["comment_author_id"])
        self.set_content(dictionary["content"])
        self.set_replied_comment_id(dictionary["replied_comment_id"])
        self.set_create_time(datetime.fromisoformat(dictionary["create_time"]))
        self.comment_author_full_name = dictionary["comment_author_full_name"]
        self.comment_author_profile_picture = base64.b64decode(dictionary["comment_author_profile_picture"]) if dictionary["comment_author_profile_picture"] else None

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "DisplayedComment":
        comment = DisplayedComment("", "", 0, "", None, "", None, datetime.now())
        comment.from_serializable_JSON(dictionary)
        return comment