from services.supabase_client_service import SupabaseClientService

class SupabaseBooksAPIService:

    def __init__(self):
        self.client = SupabaseClientService()