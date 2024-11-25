from models.account import Account
from services.supabase_client_service import SupabaseClientService

class SupabaseAuthenticationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def register_account(self, account: Account):
        try:
            response = self.client.table("Account").insert({
                "account_id": account.get_account_id(),
                "email": account.get_email(),
                "full_name": account.get_full_name(),
                "first_name": account.get_first_name(),
                "last_name": account.get_last_name(),
                "birthday": account.get_birthday(),
                "bio": account.get_bio(),
                "salt": account.get_salt(),
                "hashed_password": account.get_hashed_password(),
                "account_type": account.get_account_type(),
                "profile_picture": account.profile_picture
            }).execute()

            if response.status_code == 201:
                return {"success": True, "message": "Account registered successfully", "data": response.data}
            else:
                return {"success": False, "message": "Error registering account", "error": response.error}
        except Exception as e:
            return {"success": False, "message": str(e)}

    