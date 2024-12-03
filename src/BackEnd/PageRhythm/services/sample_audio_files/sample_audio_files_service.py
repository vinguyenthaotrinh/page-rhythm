from services.sample_audio_files.supabase_sample_audio_files_api_service import SupabaseSampleAudioFilesAPIService

class SampleAudioFilesService:
        
    def __init__(self):
        self.supabase = SupabaseSampleAudioFilesAPIService()