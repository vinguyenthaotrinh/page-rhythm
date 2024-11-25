from services.account.supabase_account_api_service import SupabaseAccountAPIService
from services.account.account_service import AccountService
from werkzeug.security import generate_password_hash
import datetime
import secrets
import bcrypt

class AuthenticationService:
    
    def __init__(self):
        self.supabase = SupabaseAccountAPIService()

    @staticmethod
    def get_salt_length() -> int:
        return 16
    
    @staticmethod
    def generate_salt() -> str:
        return secrets.token_hex(AuthenticationService.get_salt_length())
    
    @staticmethod   
    def generate_hashed_password(password: str, salt: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8')).decode('utf-8')

    def register_account(self,
                        email: str,
                        full_name: str,
                        first_name: str,
                        last_name: str,
                        birthday: datetime.date,
                        bio: str,
                        password: str,
                        account_type: str,
                        profile_picture: bytes):
        account_id = AccountService().get_number_of_accounts() + 1
        salt = AuthenticationService.generate_salt()
        hashed_password = AuthenticationService.generate_hashed_password(password, salt)
        result = self.supabase.register_account(account_id, email, full_name, first_name, last_name, birthday, bio, hashed_password, salt, account_type, profile_picture)
        print(result)