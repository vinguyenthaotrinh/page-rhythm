from services.authentication.supabase_authentication_api_service import SupabaseAuthenticationAPIService
from services.account.account_service import AccountService
from werkzeug.security import generate_password_hash
from models.account import Account
import datetime
import secrets
import bcrypt

class AuthenticationService:
    
    def __init__(self):
        self.supabase = SupabaseAuthenticationAPIService()
    
    @staticmethod
    def generate_salt() -> str:
        return bcrypt.gensalt().decode('utf-8')
    
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
        account = Account(account_id, email, full_name, first_name, last_name, birthday, bio, salt, hashed_password, account_type, profile_picture)
        return self.supabase.register_account(account)