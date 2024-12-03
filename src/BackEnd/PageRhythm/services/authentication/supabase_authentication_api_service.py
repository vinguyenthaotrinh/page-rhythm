from models.account import Account
from services.supabase_client_service import SupabaseClientService

class SupabaseAuthenticationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def register_account(self, account: Account) -> bool:
        try:
            response = self.client.table("Account").insert(account.to_serializable_JSON()).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def change_password(self, account_id: int, hashed_new_password: str) -> bool:
        try:
            response = self.client.table("Account").update({"hashed_password": hashed_new_password}).eq("account_id", account_id).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False