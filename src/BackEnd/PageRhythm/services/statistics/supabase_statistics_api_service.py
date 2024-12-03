from services.supabase_client_service import SupabaseClientService

class SupabaseStatisticsAPIService:

    def __init__(self):
        self.client = SupabaseClientService()