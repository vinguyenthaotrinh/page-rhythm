import base64
import datetime
from enum import Enum
from typing import Optional
from models.base_entity import BaseEntity

class AccountType(Enum):
    ADMIN = "admin"
    USER = "user"

class Account(BaseEntity):

    def __init__(self, 
                 account_id: int, 
                 email: str, 
                 full_name: str, 
                 first_name: str, 
                 last_name: str, 
                 birthday: datetime.date,
                 bio: str,
                 salt: str,
                 hashed_password: str,
                 account_type: AccountType,
                 profile_picture: Optional[bytes]):
        super().__init__()
        self.account_id = account_id
        self.email = email
        self.full_name = full_name
        self.first_name = first_name
        self.last_name = last_name
        self.birthday = birthday
        self.bio = bio
        self.salt = salt
        self.hashed_password = hashed_password
        self.account_type = account_type
        self.profile_picture = profile_picture

    def __str__(self) -> str:
        return f"Account(account_id={self.account_id}, email={self.email}, full_name={self.full_name}, first_name={self.first_name}, last_name={self.last_name}, birthday={self.birthday}, bio={self.bio}, salt={self.salt}, hashed_password={self.hashed_password}, account_type={self.account_type}, profile_picture={self.profile_picture})"
    
    def get_account_id(self) -> int:
        return self.account_id
    
    def get_email(self) -> str:
        return self.email
    
    def get_full_name(self) -> str:
        return self.full_name
    
    def get_first_name(self) -> str:
        return self.first_name
    
    def get_last_name(self) -> str:
        return self.last_name
    
    def get_birthday(self) -> datetime.date:
        return self.birthday
    
    def get_bio(self) -> str:
        return self.bio
    
    def get_salt(self) -> str:
        return self.salt
    
    def get_hashed_password(self) -> str:
        return self.hashed_password
    
    def get_account_type(self) -> AccountType:
        return self.account_type
    
    def get_profile_picture(self) -> bytes:
        return self.profile_picture
    
    def set_account_id(self, account_id: int) -> bool:
        if account_id <= 0:
            return False
        self.account_id = account_id
        return True

    def set_email(self, email: str):
        self.email = email

    def set_full_name(self, full_name: str):
        self.full_name = full_name

    def set_first_name(self, first_name: str):
        self.first_name = first_name

    def set_last_name(self, last_name: str):
        self.last_name = last_name

    def set_birthday(self, birthday: datetime.date):
        self.birthday = birthday

    def set_bio(self, bio: str):
        self.bio = bio

    def set_salt(self, salt: str):
        self.salt = salt

    def set_hashed_password(self, hashed_password: str):
        self.hashed_password = hashed_password

    def set_account_type(self, account_type: AccountType):
        self.account_type = account_type

    def set_profile_picture(self, profile_picture: Optional[bytes]):
        self.profile_picture = profile_picture

    def get_ages(self) -> int:
        today = datetime.date.today()
        return today.year - self.birthday.year - ((today.month, today.day) < (self.birthday.month, self.birthday.day))
    
    @staticmethod
    def get_serializable_date(date) -> Optional[str]:
        return date.strftime('%Y-%m-%d') if isinstance(date, datetime.date) else None
    
    @staticmethod
    def deserialize_date(date: Optional[str]) -> Optional[datetime.date]:
        return datetime.datetime.strptime(date, '%Y-%m-%d').date() if date else None

    def to_serializable_JSON(self) -> dict:
        return {
            "account_id": self.account_id,
            "email": self.email,
            "full_name": self.full_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birthday": self.get_serializable_date(self.birthday),
            "bio": self.bio,
            "salt": self.salt,
            "hashed_password": self.hashed_password,
            "account_type": self.account_type.value,
            "profile_picture": base64.b64encode(self.profile_picture).decode('utf-8') if self.profile_picture else None
        }
    
    def get_serializable_profile(self) -> dict:
        return {
            "email": self.email,
            "full_name": self.full_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birthday": {
                "year": self.birthday.year,
                "month": self.birthday.month,
                "day": self.birthday.day
            },
            "bio": self.bio,
            "profile_picture": base64.b64encode(self.profile_picture).decode('utf-8') if self.profile_picture else None
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.account_id = dictionary["account_id"]
        self.email = dictionary["email"]
        self.full_name = dictionary["full_name"]
        self.first_name = dictionary["first_name"]
        self.last_name = dictionary["last_name"]
        self.birthday = self.deserialize_date(dictionary["birthday"])
        self.bio = dictionary["bio"]
        self.salt = dictionary["salt"]
        self.hashed_password = dictionary["hashed_password"]
        self.account_type = AccountType(dictionary["account_type"])
        self.profile_picture = base64.b64decode(dictionary["profile_picture"]) if dictionary["profile_picture"] else None

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "Account":
        account = Account(0, "", "", "", "", datetime.date.today(), "", "", "", AccountType.USER, bytes())
        account.from_serializable_JSON(dictionary)
        return account