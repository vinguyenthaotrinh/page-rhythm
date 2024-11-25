from models.account import Account
from services.supabase_client_service import SupabaseClientService

class SupabaseAuthenticationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def register_account(self, account: Account):
        response = self.client.table("Account").insert(account.to_serializable_JSON()).execute()
        print(response)