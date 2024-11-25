from models.account import Account
from services.supabase_client_service import SupabaseClientService

class SupabaseAccountAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_accounts(self) -> int:
        try:
            response = self.client.table('Account').select('account_id').execute()
            
            if response.status_code == 200:
                return len(response.data)
            else:
                print(f"Error fetching account count: {response.error}")
                return 0
        except Exception as e:
            print(f"An error occurred: {e}")
            return 0