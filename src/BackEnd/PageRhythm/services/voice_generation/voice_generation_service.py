import os
from dotenv import load_dotenv
from services.voice_generation.supabase_voice_generation_api_service import SupabaseVoiceGenerationAPIService

class VoiceGenerationService:

    def __init__(self):
        load_dotenv()

        self.total_character_limit_for_text_to_speech_generation = int(os.environ.get("TOTAL_CHARACTER_LIMIT_FOR_TEXT_TO_SPEECH_GENERATION"))
        
        self.supabase = SupabaseVoiceGenerationAPIService()

    def check_text_to_speech_generation_possible(self, text_content: str) -> bool:
        current_total_characters = self.supabase.get_total_number_of_sent_characters()
        return (current_total_characters + len(text_content)) <= self.total_character_limit_for_text_to_speech_generation

    