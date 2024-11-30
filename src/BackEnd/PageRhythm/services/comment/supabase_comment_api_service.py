from services.supabase_client_service import SupabaseClientService

class SupabaseCommentAPIService:

    def __init__(self):
        self.client = SupabaseClientService()