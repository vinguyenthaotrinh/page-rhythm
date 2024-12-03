from models.base_entity import BaseEntity
from datetime import datetime
import base64

class SampleAudioFile(BaseEntity):

    def __init__(self, 
                 sample_audio_file_id: int,
                 file_name: str,
                 description: str,
                 owner_id: int,
                 content: bytes,
                 upload_time: datetime):
        super().__init__()
        self.sample_audio_file_id = sample_audio_file_id
        self.file_name = file_name
        self.description = description
        self.owner_id = owner_id
        self.content = content
        self.upload_time = upload_time

    def __str__(self) -> str:  
        return f"SampleAudioFile(sample_audio_file_id={self.sample_audio_file_id}, file_name={self.file_name}, description={self.description}, owner_id={self.owner_id}, upload_time={self.upload_time})"
    
    def get_sample_audio_file_id(self) -> int:
        return self.sample_audio_file_id
    
    def get_file_name(self) -> str:
        return self.file_name
    
    def get_description(self) -> str:
        return self.description
    
    def get_owner_id(self) -> int:
        return self.owner_id
    
    def get_content(self) -> bytes:
        return self.content
    
    def get_upload_time(self) -> datetime:
        return self.upload_time
    
    def set_sample_audio_file_id(self, sample_audio_file_id: int):
        self.sample_audio_file_id = sample_audio_file_id

    def set_file_name(self, file_name: str):
        self.file_name = file_name

    def set_description(self, description: str):
        self.description = description

    def set_owner_id(self, owner_id: int) -> bool:
        if owner_id <= 0:
            return False
        self.owner_id = owner_id
        return True
    
    def set_content(self, content: bytes):
        self.content = content

    def set_upload_time(self, upload_time: datetime):
        self.upload_time = upload_time

    def to_serializable_JSON(self) -> dict:
        return {
            "sample_audio_file_id": self.sample_audio_file_id,
            "file_name": self.file_name,
            "description": self.description,
            "owner_id": self.owner_id,
            "content": base64.b64encode(self.content).decode("utf-8"),
            "upload_time": self.upload_time.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_sample_audio_file_id(dictionary["sample_audio_file_id"])
        self.set_file_name(dictionary["file_name"])
        self.set_description(dictionary["description"])
        self.set_owner_id(dictionary["owner_id"])
        self.set_content(base64.b64decode(dictionary["content"]))
        self.set_upload_time(datetime.strptime(dictionary["upload_time"], "%Y-%m-%d %H:%M:%S"))

    @staticmethod
    def deserialize_JSON(dictionary: dict) -> "SampleAudioFile":
        sample_audio_file = SampleAudioFile("", "", "", 0, b"", datetime.now())
        sample_audio_file.from_serializable_JSON(dictionary)
        return sample_audio_file