from services.supabase_client_service import SupabaseClientService

class SupabaseAccountAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_accounts(self) -> int:
        response = self.client.table('Account').select('account_id').execute()
                
        return len(response.data)