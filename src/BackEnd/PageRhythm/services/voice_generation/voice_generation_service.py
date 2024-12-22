import os
import random
import datetime
import elevenlabs
from typing import Optional
from dotenv import load_dotenv
from models.text_to_speech_generation import TextToSpeechGeneration 
from services.voice_generation.supabase_voice_generation_api_service import SupabaseVoiceGenerationAPIService

class VoiceGenerationService:

    def __init__(self):
        load_dotenv()

        self.total_character_limit_for_text_to_speech_generation = int(os.environ.get("TOTAL_CHARACTER_LIMIT_FOR_TEXT_TO_SPEECH_GENERATION"))
        
        elevenlabs.set_api_key(os.environ.get("ELEVENLABS_TEXT_TO_SPEECH_API_KEYS"))

        self.supabase = SupabaseVoiceGenerationAPIService()

    def check_text_to_speech_generation_possible(self, text_content: str) -> bool:
        current_total_characters = self.supabase.get_total_number_of_sent_characters()
        return (current_total_characters + len(text_content)) <= self.total_character_limit_for_text_to_speech_generation
    
    def convert_text_to_speech(self, account_id: int, text_content: str, voice_name: str) -> Optional[dict]:
        if not self.check_text_to_speech_generation_possible(text_content):
            return None

        audio = elevenlabs.generate(
            text    = text_content,
            voice   = voice_name
        )

        temporary_file_name = f"{random.randint(0, 31082003)}.mp3"

        elevenlabs.save(audio, temporary_file_name)

        with open(temporary_file_name, "rb") as file:
            content = file.read()

        #os.remove(temporary_file_name)

        record = TextToSpeechGeneration(
            id              =   random.randint(0, 31082003),
            account_id      =   account_id,
            generation_time =   datetime.datetime.now(),
            text_content    =   text_content,
            speech_content  =   content
        )

        record_JSON = record.to_serializable_JSON()

        record_JSON.pop("id", None)

        result = self.supabase.add_voice_generation_record(record_JSON)

        if result is None:
            return None
        
        return result.to_serializable_JSON()
    
    @staticmethod
    def get_all_default_voice_sample_names() -> dict[str, str]:
        return {
            "Adam"      : "pNInz6obpgDQGcFmaJgB",
            "Antoni"    : "ErXwobaYiN019PkySvjV",
            "Arnold"    : "VR6AewLTigWG4xSOukaG",
            "Bella"     : "EXAVITQu4vr4xnSDxMaL",
            "Callum"    : "N2lVS1w4EtoT3dr4eOWO",
            "Charlie"   : "IKne3meq5aSn9XLyUdCD",
            "Charlotte" : "XB0fDUnXU5powFXDhCwa",
            "Clyde"     : "2EiwWnXFnvU5JabPnv8n",
            "Daniel"    : "onwK4e9ZLuTAKqWW03F9",
            "Dave"      : "CYw3kZ02Hs0563khs1Fj",
            "Domi"      : "AZnzlk1XvdvUeBnXmlld",
            "Dorothy"   : "ThT5KcBeYPX3keUQqHPh",
            "Elli"      : "MF3mGyEYCl7XYWbV9V6O",
            "Emily"     : "LcfcDJNUP1GQjkzn1xUU",
            "Ethan"     : "g5CIjZEefAph4nQFvHAz",
            "Fin"       : "D38z5RcWu1voky8WS1ja",
            "Freya"     : "jsCqWAovK2LkecY7zXl4",
            "Gigi"      : "jBpfuIE2acCO8z3wKNLl",
            "Giovanni"  : "zcAOhNBS3c14rBihAFp1",
            "Glinda"    : "z9fAnlkpzviPz146aGWa",
            "Grace"     : "oWAxZDx7w5VEj9dCyTzz",
            "Harry"     : "SOYHLrjzK2X1ezoPC6cr",
            "James"     : "ZQe5CZNOzWyzPSCn5a3c",
            "Jeremy"    : "bVMeCyTHy58xNoL34h3p",
            "Jessie"    : "t0jbNlBVZ17f02VDIeMI",
            "Joseph"    : "Zlb1dXrM653N07WRdFW3",
            "Josh"      : "TxGEqnHWrfWFTfGW9XjX",
            "Liam"      : "TX3LPaxmHKxFdv7VOQHJ",
            "Matilda"   : "XrExE9yKIg1WjnnlVkGX",
            "Matthew"   : "Yko7PKHZNXotIFUBG7I9",
            "Michael"   : "flq6f7yk4E4fJM5XTYuZ",
            "Mimi"      : "zrHiDhphv9ZnVXBqCLjz",
            "Nicole"    : "piTKgcLEGmPE4e6mEKli",
            "Patrick"   : "ODq5zmih8GrVes37Dizd",
            "Rachel"    : "21m00Tcm4TlvDq8ikWAM",
            "Ryan"      : "wViXBPUzp2ZZixB1xQuM",
            "Sam"       : "yoZ06aMxZJJ28mfd3POQ",
            "Serena"    : "pMsXgVXv3BLzUgSXRplE",
            "Thomas"    : "GBv7mTt0atIp3Br8iCZE",
        }

voice_generation_service = VoiceGenerationService()
voice_generation_service.convert_text_to_speech(62, "I am the danger", "Liam")
    