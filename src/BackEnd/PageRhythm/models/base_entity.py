from abc import ABC

class BaseEntity(ABC):

    def __init__(self):
        pass

    def __str__(self) -> str:
        return "BaseEntity()"
    
    def to_serializable_JSON(self) -> dict:
        return {}
    
    def get_data_from_serializable_JSON(self, dictionary: dict):
        pass