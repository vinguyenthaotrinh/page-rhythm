from services.account.supabase_account_api_service import SupabaseAccountAPIService
from models.account import Account
from typing import Optional
import datetime

class AccountService:
    
    def __init__(self):
        self.supabase = SupabaseAccountAPIService()

    def get_number_of_accounts(self) -> int:
        return self.supabase.get_number_of_accounts()
    
    def get_account_by_email(self, email: str) -> Optional[Account]:
        return self.supabase.get_account_by_email(email)
    
    def check_account_exists(self, account_id: int) -> bool:
        return self.supabase.check_account_exists(account_id)
    
    def get_account_by_id(self, account_id: int) -> Optional[Account]:
        return self.supabase.get_account_by_id(account_id)
    
    def get_all_user_accounts(self) -> list[Account]:
        return self.supabase.get_all_user_accounts()
    
    def check_email_exists(self, email: str) -> bool:
        return self.get_account_by_email(email) is not None
    
    def update_account_profile_information(self, 
                                           account_id: int,
                                           email: str,
                                           full_name: str,
                                           first_name: str,
                                           last_name: str,
                                           birthday: datetime.date,
                                           bio: str,
                                           profile_picture: Optional[bytes]) -> bool:
        account = self.get_account_by_id(account_id)
        if account is None:
            return False
        if (account.email != email) and self.check_email_exists(email):
            return False
        account.set_email(email)
        account.set_full_name(full_name)
        account.set_first_name(first_name)
        account.set_last_name(last_name)
        account.set_birthday(birthday)
        account.set_bio(bio)
        account.set_profile_picture(profile_picture)
        return self.supabase.update_account(account)