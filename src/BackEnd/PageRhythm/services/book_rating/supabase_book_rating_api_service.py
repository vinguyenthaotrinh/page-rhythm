from services.supabase_client_service import SupabaseClientService

class SupabaseBookRatingAPIService:

    def __init__(self):
        self.client = SupabaseClientService()