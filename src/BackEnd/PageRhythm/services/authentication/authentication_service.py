from services.authentication.supabase_authentication_api_service import SupabaseAuthenticationAPIService
from services.account.account_service import AccountService
from models.account import Account, AccountType
from typing import Optional
import datetime
import bcrypt

class AuthenticationService:
    
    def __init__(self):
        self.supabase = SupabaseAuthenticationAPIService()
    
    @staticmethod
    def generate_salt() -> str:
        return bcrypt.gensalt().decode("utf-8")
    
    @staticmethod   
    def generate_hashed_password(password: str, salt: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), salt.encode("utf-8")).decode("utf-8")
    
    @staticmethod
    def check_account_id_valid(account_id: int) -> bool:
        return 0 < account_id <= AccountService().get_number_of_accounts()

    def register_account(self,
                        email: str,
                        full_name: str,
                        first_name: str,
                        last_name: str,
                        birthday: datetime.date,
                        bio: str,
                        password: str,
                        account_type: str,
                        profile_picture: Optional[bytes]) -> bool:
        account_id = AccountService().get_number_of_accounts() + 1
        salt = AuthenticationService.generate_salt()
        hashed_password = AuthenticationService.generate_hashed_password(password, salt)
        account_type = AccountType(account_type)
        account = Account(account_id, email, full_name, first_name, last_name, birthday, bio, salt, hashed_password, account_type, profile_picture)
        account_JSON = account.to_serializable_JSON()
        account_JSON.pop("account_id", None)

        return self.supabase.register_account(account_JSON)
    
    def change_password(self,
                        account_id: int,
                        new_password: str) -> bool:
        account = AccountService().get_account_by_id(account_id)
        hashed_new_password = AuthenticationService.generate_hashed_password(new_password, account.get_salt())
        return self.supabase.change_password(account_id, hashed_new_password)
    
    @staticmethod
    def check_password_correct(email: str, password: str) -> bool:
        account = AccountService().get_account_by_email(email)
        if account is None:
            return False
        hashed_password = AuthenticationService.generate_hashed_password(password, account.salt)
        return account.hashed_password == hashed_password
    
    @staticmethod
    def verify_password(account_id: int, password: str) -> bool:
        account = AccountService().get_account_by_id(account_id)
        if account is None:
            return False
        hashed_password = AuthenticationService.generate_hashed_password(password, account.salt)
        return account.hashed_password == hashed_password