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
            response = self.client.table("Account").select("*").eq("email", email).execute()
            return Account.deserialize_JSON(response.data[0])
        except Exception as e:
            return None
        return None
    
    def check_account_exists(self, account_id: int) -> bool:
        try:
            response = self.client.table('Account').select('account_id').eq('account_id', account_id).execute()
            return len(response.data) > 0
        except Exception as e:
            return False
        return False
    
    def get_account_by_id(self, account_id: int) -> Optional[Account]:
        try:
            response = self.client.table('Account').select('*').eq('account_id', account_id).execute()
            return Account.deserialize_JSON(response.data[0])
        except Exception as e:
            return None
        return None
    
    def update_account(self, account: Account) -> bool:
        try:
            response = self.client.table('Account').update(account.to_serializable_JSON()).eq('account_id', account.account_id).execute()
            return True
        except Exception as e:
            return False
        return False