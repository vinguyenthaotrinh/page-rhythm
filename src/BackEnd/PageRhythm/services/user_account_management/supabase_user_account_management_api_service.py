from services.supabase_client_service import SupabaseClientService
from models.banned_account import BannedAccount, BanType
from typing import Optional

class SupabaseUserAccountManagementAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_ban_account(self, banned_account_id: int) -> Optional[BannedAccount]:
        try:
            response = self.client.table("BannedAccount").select("*").eq("banned_account_id", banned_account_id).execute()
            return BannedAccount.deserialize_JSON(response.data[0])
        except Exception as e:
            return None
        return None
    
    def insert_new_ban(self, banned_account: BannedAccount) -> bool:

        if self.get_ban_account(banned_account.banned_account_id) is not None:
            return False

        try:
            self.client.table("BannedAccount").insert(banned_account.to_serializable_JSON()).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def update_ban(self, banned_account: BannedAccount) -> bool:

        if self.get_ban_account(banned_account.banned_account_id) is None:
            return False

        try:
            self.client.table("BannedAccount").update(banned_account.to_serializable_JSON()).eq("banned_account_id", banned_account.banned_account_id).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def delete_ban(self, banned_account_id: int) -> bool:    
        
        if self.get_ban_account(banned_account_id) is None:
            return False
    
        try:
            self.client.table("BannedAccount").delete().eq("banned_account_id", banned_account_id).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False