from services.account.supabase_account_api_service import SupabaseAccountAPIService

class AccountService:
    
    def __init__(self):
        self.supabase = SupabaseAccountAPIService()

    def get_number_of_accounts(self) -> int:
        return self.supabase.get_number_of_accounts()