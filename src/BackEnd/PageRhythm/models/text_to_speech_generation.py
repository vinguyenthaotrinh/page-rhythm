import base64
import datetime
from typing import Optional
from models.base_entity import BaseEntity

class TextToSpeechGeneration(BaseEntity):

    def __init__(self, 
                 id: int,
                 account_id: int,
                 generation_time: Optional[datetime.datetime],
                 text_content: str,
                 speech_content: bytes):
        super().__init__()
        self.id             = id
        self.account_id     = account_id
        self.generation_time= generation_time
        self.text_content   = text_content
        self.speech_content = speech_content

    def __str__(self) -> str:
        return f"TextToSpeechGeneration(id={self.id}, account_id={self.account_id}, generation_time={self.generation_time}, text_content={self.text_content}, speech_content={self.speech_content})"
    
    def get_id(self) -> int:
        return self.id
    
    def get_account_id(self) -> int:
        return self.account_id
    
    def get_generation_time(self) -> Optional[datetime.datetime]:
        return self.generation_time
    
    def get_text_content(self) -> str:
        return self.text_content
    
    def get_speech_content(self) -> bytes:
        return self.speech_content
    
    def set_id(self, id: int):
        self.id = id

    def set_account_id(self, account_id: int) -> bool:
        if account_id <= 0:
            return False
        self.account_id = account_id

    def set_generation_time(self, generation_time: Optional[datetime.datetime]):
        self.generation_time = generation_time

    def set_text_content(self, text_content: str):
        self.text_content = text_content

    def set_speech_content(self, speech_content: bytes):
        self.speech_content = speech_content

    def to_serializable_JSON(self):
        return {
            "id":               self.id,
            "account_id":       self.account_id,
            "generation_time":  self.generation_time,
            "text_content":     self.text_content,
            "speech_content":   base64.b64encode(self.speech_content).decode('utf-8')
        }
    
    def from_serializable_JSON(self, dictionary: dict):
        self.set_id(dictionary["id"])
        self.set_account_id(dictionary["account_id"])
        self.set_generation_time(dictionary["generation_time"])
        self.set_text_content(dictionary["text_content"])
        self.set_speech_content(base64.b64decode(dictionary["speech_content"]))

    @staticmethod
    def from_serializable_JSON(dictionary: dict) -> 'TextToSpeechGeneration':
        text_to_speech_generation = TextToSpeechGeneration(0, 0, None, "", b"")
        text_to_speech_generation.from_serializable_JSON(dictionary)
        return text_to_speech_generation
