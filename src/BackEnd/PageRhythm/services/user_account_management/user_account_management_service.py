from services.supabase_client_service import SupabaseClientService

class UserAccountManagementService:

    def __init__(self):
        self.client = SupabaseClientService()