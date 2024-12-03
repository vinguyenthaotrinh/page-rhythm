from services.user_account_management.supabase_user_account_management_api_service import SupabaseUserAccountManagementAPIService
from models.banned_account import BannedAccount, BanType, AccountStatus
from datetime import datetime, timedelta
from typing import Optional

class UserAccountManagementService:

    def __init__(self):
        self.supabase = SupabaseUserAccountManagementAPIService()

    def get_ban_account(self, banned_account_id: int) -> Optional[BannedAccount]:
        return self.supabase.get_ban_account(banned_account_id)
    
    def ban_account(self, banned_account: BannedAccount) -> bool:
        if self.get_ban_account(banned_account.banned_account_id) is not None:
            return self.supabase.update_ban(banned_account)
        return self.supabase.insert_new_ban(banned_account)
    
    def ban_account_permanently(self, banned_account_id: int, banning_acount_id: int) -> bool:
        banned_account = BannedAccount(
            banned_account_id   = banned_account_id, 
            banning_account_id  = banning_acount_id,
            ban_type            = BanType.PERMANENTLY_BANNED,
            start_time          = datetime.now(),
            end_time            = None
        )
        return self.ban_account(banned_account)
    
    def ban_account_temporarily_for_specific_duration(self, banned_account_id: int, banning_acount_id: int, duration: timedelta) -> bool:
        banned_account = BannedAccount(
            banned_account_id   = banned_account_id, 
            banning_account_id  = banning_acount_id,
            ban_type            = BanType.TEMPORARILY_BANNED,
            start_time          = datetime.now(),
            end_time            = datetime.now() + duration
        )
        return self.ban_account(banned_account)
    
    def ban_account_temporarily_to_specific_time(self, banned_account_id: int, banning_acount_id: int, end_time: datetime) -> bool:
        start_time = datetime.now()
        if end_time < start_time:
            return False
        banned_account = BannedAccount(
            banned_account_id   = banned_account_id, 
            banning_account_id  = banning_acount_id,
            ban_type            = BanType.TEMPORARILY_BANNED,
            start_time          = start_time,
            end_time            = end_time
        )
        return self.ban_account(banned_account)
    
    def ban_account_temporarily_for_specific_period(self, banned_account_id: int, banning_acount_id: int, start_time: datetime, end_time: datetime) -> bool:
        
        if end_time < start_time:
            return False
        
        banned_account = BannedAccount(
            banned_account_id   = banned_account_id, 
            banning_account_id  = banning_acount_id,
            ban_type            = BanType.TEMPORARILY_BANNED,
            start_time          = start_time,
            end_time            = end_time
        )

        return self.ban_account(banned_account)
    
    def unban_account(self, banned_account_id: int) -> bool:
        return self.supabase.delete_ban(banned_account_id)
    
    def get_account_status(self, account_id: int) -> AccountStatus:
        banned_account = self.get_ban_account(account_id)
        if banned_account is None:
            return AccountStatus.ACTIVE
        if banned_account.ban_type == BanType.PERMANENTLY_BANNED:
            return AccountStatus.PERMANENTLY_BANNED
        if (banned_account.end_time is not None) and (datetime.now() > banned_account.end_time):
            return AccountStatus.ACTIVE
        return AccountStatus.TEMPORARILY_BANNED