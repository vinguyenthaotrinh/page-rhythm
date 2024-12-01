from services.account.supabase_account_api_service import SupabaseAccountAPIService
from models.account import Account
from typing import Optional

class AccountService:
    
    def __init__(self):
        self.supabase = SupabaseAccountAPIService()

    def get_number_of_accounts(self) -> int:
        return self.supabase.get_number_of_accounts()
    
    def get_account_by_email(self, email: str) -> Optional[Account]:
        return self.supabase.get_account_by_email(email)