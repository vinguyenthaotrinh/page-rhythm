from models.base_entity import BaseEntity

class SampleAudioFile(BaseEntity):

    def __init__(self, 
                 sample_audio_file_id: str,
                 file_name: str,
                 description: str,
                 owner_id: int,
                 content: bytes):
        super().__init__()
        self.sample_audio_file_id = sample_audio_file_id
        self.file_name = file_name
        self.description = description
        self.owner_id = owner_id
        self.content = content

    def __str__(self) -> str:  
        return f"SampleAudioFile(sample_audio_file_id={self.sample_audio_file_id}, file_name={self.file_name}, description={self.description}, owner_id={self.owner_id}, content={self.content})"
    
    def get_sample_audio_file_id(self) -> str:
        return self.sample_audio_file_id
    
    def get_file_name(self) -> str:
        return self.file_name
    
    def get_description(self) -> str:
        return self.description
    
    def get_owner_id(self) -> int:
        return self.owner_id
    
    def get_content(self) -> bytes:
        return self.content
    
    def set_sample_audio_file_id(self, sample_audio_file_id: str):
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

    def to_serializable_JSON(self) -> dict:
        return {
            "sample_audio_file_id": self.sample_audio_file_id,
            "file_name": self.file_name,
            "description": self.description,
            "owner_id": self.owner_id,
            "content": self.content.decode("utf-8")
        }
    
    def get_data_from_serializable_JSON(self, dictionary: dict):
        self.set_sample_audio_file_id(dictionary["sample_audio_file_id"])
        self.set_file_name(dictionary["file_name"])
        self.set_description(dictionary["description"])
        self.set_owner_id(dictionary["owner_id"])
        self.set_content(dictionary["content"].encode("utf-8"))