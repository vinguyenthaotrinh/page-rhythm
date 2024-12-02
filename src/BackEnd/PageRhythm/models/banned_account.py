from datetime import datetime
from models.base_entity import BaseEntity

class BannedAccount(BaseEntity):

    def __init__(self, 
                 banned_account_id: int,
                 banning_account_id: int,
                 ban_type: str,
                 start_time: datetime.datetime,
                 end_time: datetime.datetime):
        super().__init__()
        self.banned_account_id = banned_account_id
        self.banning_account_id = banning_account_id
        self.ban_type = ban_type
        self.start_time = start_time
        self.end_time = end_time

    def __str__(self) -> str:
        return f"BannedAccount(banned_account_id={self.banned_account_id}, banning_account_id={self.banning_account_id}, ban_type={self.ban_type}, start_time={self.start_time}, end_time={self.end_time})"
    
    def get_banned_account_id(self) -> int:
        return self.banned_account_id
    
    def get_banning_account_id(self) -> int:
        return self.banning_account_id
    
    def get_ban_type(self) -> str:
        return self.ban_type
    
    def get_start_time(self) -> datetime.datetime:
        return self.start_time
    
    def get_end_time(self) -> datetime.datetime:
        return self.end_time
    
    def set_banned_account_id(self, banned_account_id: int) -> bool:
        if banned_account_id <= 0:
            return False
        self.banned_account_id = banned_account_id
        return True
    
    def set_banning_account_id(self, banning_account_id: int) -> bool:
        if banning_account_id <= 0:
            return False
        self.banning_account_id = banning_account_id
        return True
    
    def set_ban_type(self, ban_type: str):
        self.ban_type = ban_type

    def set_start_time(self, start_time: datetime.datetime):
        self.start_time = start_time

    def set_end_time(self, end_time: datetime.datetime):
        self.end_time = end_time

    def to_serializable_JSON(self) -> dict:
        return {
            "banned_account_id": self.banned_account_id,
            "banning_account_id": self.banning_account_id,
            "ban_type": self.ban_type,
            "start_time": self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": self.end_time.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_banned_account_id(dictionary["banned_account_id"])
        self.set_banning_account_id(dictionary["banning_account_id"])
        self.set_ban_type(dictionary["ban_type"])
        self.set_start_time(datetime.datetime.strptime(dictionary["start_time"], "%Y-%m-%d %H:%M:%S"))
        self.set_end_time(datetime.datetime.strptime(dictionary["end_time"], "%Y-%m-%d %H:%M:%S"))