from services.sample_audio_files.supabase_sample_audio_files_api_service import SupabaseSampleAudioFilesAPIService
from models.sample_audio_file import SampleAudioFile
from typing import Optional
import datetime

class SampleAudioFilesService:
        
    def __init__(self):
        self.supabase = SupabaseSampleAudioFilesAPIService()

    def get_number_of_sample_audio_files(self) -> int:
        return self.supabase.get_number_of_sample_audio_files()

    def get_sample_audio_file_by_id(self, sample_audio_file_id: int) -> Optional[SampleAudioFile]:
        return self.supabase.get_sample_audio_file_by_id(sample_audio_file_id)
    
    def check_ownership(self, sample_audio_file_id: int, owner_id: int) -> bool:
        return self.supabase.check_ownership(sample_audio_file_id, owner_id)

    def add_new_sample_audio_file(self, file_name: str, description: str, owner_id: int, content: bytes) -> bool:

        sample_audio_file = SampleAudioFile(
            sample_audio_file_id    =   self.get_number_of_sample_audio_files() + 1,
            file_name               =   file_name,
            description             =   description,
            owner_id                =   owner_id,
            content                 =   content,
            upload_time             =   datetime.datetime.now()
        )
        
        return self.supabase.insert_sample_audio_file(sample_audio_file)
    
    def delete_sample_audio_file(self, sample_audio_file_id: int) -> bool:
        return self.supabase.delete_sample_audio_file(sample_audio_file_id)
    
    def update_sample_audio_file_meta_information(self, sample_audio_file_id: int, file_name: str, description: str) -> bool:
        sample_audio_file = self.get_sample_audio_file_by_id(sample_audio_file_id)

        if sample_audio_file is None:
            return False
        
        sample_audio_file.file_name = file_name
        sample_audio_file.description = description

        return self.supabase.update_sample_audio_file(sample_audio_file)
    
    def get_uploaded_sample_audio_files(self, owner_id: int) -> list[SampleAudioFile]:
        sample_audio_files = self.supabase.get_uploaded_sample_audio_files()

        if sample_audio_files is None:
            return []
        
        return [sample_audio_file for sample_audio_file in sample_audio_files if sample_audio_file.owner_id == owner_id]