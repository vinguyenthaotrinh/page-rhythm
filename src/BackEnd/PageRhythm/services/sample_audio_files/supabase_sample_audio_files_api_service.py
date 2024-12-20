from services.supabase_client_service import SupabaseClientService
from models.sample_audio_file import SampleAudioFile
from typing import Optional

class SupabaseSampleAudioFilesAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_sample_audio_files(self) -> int:
        try:
            response = self.client.table('SampleAudioFile').select('sample_audio_file_id').execute()
            return len(response.data)
        except Exception as e:
            return 0
        return 0
    
    def get_sample_audio_file_by_id(self, sample_audio_file_id: int) -> Optional[SampleAudioFile]:
        try:
            response = self.client.table("SampleAudioFile").select("*").eq("sample_audio_file_id", sample_audio_file_id).execute()
            return SampleAudioFile.deserialize_JSON(response.data[0])
        except Exception as e:
            print(e)
            return None
        return None
    
    def insert_sample_audio_file(self, sample_audio_file_JSON: dict) -> Optional[SampleAudioFile]:
        while True:
            try:
                response = self.client.table("SampleAudioFile").insert(sample_audio_file_JSON).execute()
                if response.data:
                    return SampleAudioFile.deserialize_JSON(response.data[0])
                return None
            except Exception as e:
                print(e)
                if e.code != "23505":
                    return None
        return None
    
    def check_ownership(self, sample_audio_file_id: int, owner_id: int) -> bool:
        try:
            response = self.client.table("SampleAudioFile").select("owner_id").eq("sample_audio_file_id", sample_audio_file_id).execute()
            return response.data[0]["owner_id"] == owner_id
        except Exception as e:
            return False
        return False
    
    def delete_sample_audio_file(self, sample_audio_file_id: int) -> bool:
        try:
            response = self.client.table("SampleAudioFile").delete().eq("sample_audio_file_id", sample_audio_file_id).execute()
            return True
        except Exception as e:
            return False
        return False
    
    def update_sample_audio_file(self, sample_audio_file: SampleAudioFile) -> bool:
        try:
            response = self.client.table("SampleAudioFile").update(sample_audio_file.to_serializable_JSON()).eq("sample_audio_file_id", sample_audio_file.sample_audio_file_id).execute()
            return True
        except Exception as e:
            return False
        return False
    
    def get_uploaded_sample_audio_files(self, owner_id: int) -> list[SampleAudioFile]:
        try:
            response = self.client.table("SampleAudioFile").select("*").execute()
            return [SampleAudioFile.deserialize_JSON(data) for data in response.data if data["owner_id"] == owner_id]
        except Exception as e:
            return []
        return None