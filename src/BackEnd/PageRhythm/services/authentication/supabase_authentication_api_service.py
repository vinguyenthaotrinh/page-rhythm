import json
from models.account import Account
from services.supabase_client_service import SupabaseClientService

class SupabaseAuthenticationAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def register_account(self, account_JSON: dict) -> bool:
        if "account_id" in account_JSON:
            try:
                response = self.client.table("Account").insert(account_JSON).execute()
                return True
            except Exception as e:
                print(e)
                return False
            return False
        else:
            while True:
                try:
                    response = self.client.table("Account").insert(account_JSON).execute()
                    return True
                except Exception as e:
                    print(e)
                    if hasattr(e, "code") and (e.code != "23505"):
                        return False
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