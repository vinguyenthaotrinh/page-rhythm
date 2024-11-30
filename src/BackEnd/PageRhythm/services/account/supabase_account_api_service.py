from services.supabase_client_service import SupabaseClientService
from models.account import Account
from typing import Optional

class SupabaseAccountAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_accounts(self) -> int:
        try:
            response = self.client.table('Account').select('account_id').execute()
            return len(response.data)
        except Exception as e:
            return 0
        return 0
    
    def get_account_by_email(self, email: str) -> Optional[Account]:
        try:
            response = self.client.table('Account').select('*').eq('email', email).execute()
            return Account.from_serializable_JSON(response.data[0])
        except Exception as e:
            return None
        return None