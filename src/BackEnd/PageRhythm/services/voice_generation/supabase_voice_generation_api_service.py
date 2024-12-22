from services.supabase_client_service import SupabaseClientService
from models.text_to_speech_generation import TextToSpeechGeneration
from typing import Optional

class SupabaseVoiceGenerationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_all_voice_generation_records(self) -> list[TextToSpeechGeneration]:
        try:
            response = self.client.table("TextToSpeechGenerationRecord").select("*").execute()
            return [TextToSpeechGeneration.deserialize_JSON(record) for record in response.data]
        except Exception as e:
            return []
        return []
    
    def get_total_number_of_sent_characters(self) -> int:
        
        records = self.get_all_voice_generation_records()

        if len(records) == 0:
            return 0

        return sum(len(record.get_text_content()) for record in records)
    
    def add_voice_generation_record(self, record_JSON: dict) -> Optional[TextToSpeechGeneration]:
        if "id" in record_JSON:
            try:
                response = self.client.table("TextToSpeechGenerationRecord").insert(record_JSON).execute()
                if response.data:
                    return TextToSpeechGeneration.deserialize_JSON(response.data[0])
                return None
            except Exception as e:
                print(e)
                return None
            return None
        else:
            while True:
                try:
                    response = self.client.table("TextToSpeechGenerationRecord").insert(record_JSON).execute()
                    if response.data:
                        return TextToSpeechGeneration.deserialize_JSON(response.data[0])
                    return None
                except Exception as e:
                    print(e)
                    if hasattr(e, "code") and (e.code != "23505"):
                        return None
            return None

        return None