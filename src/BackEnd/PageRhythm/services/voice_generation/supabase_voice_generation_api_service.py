from services.supabase_client_service import SupabaseClientService
from typing import Optional

class SupabaseVoiceGenerationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_all_voice_generation_records(self) -> list[dict]:
        try:
            response = self.client.table("TextToSpeechGenerationRecord").select("*").execute()
            return response.data
        except Exception as e:
            return []
        return []
    
    def get_total_number_of_sent_characters(self) -> int:
        
        records = self.get_all_voice_generation_records()

        if (records is None) or (len(records) == 0):
            return 0

        return sum(len(record["text_content"]) for record in records)
    