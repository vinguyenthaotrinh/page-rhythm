from services.user_account_management.supabase_user_account_management_api_service import SupabaseUserAccountManagementAPIService

class UserAccountManagementService:

    def __init__(self):
        self.supabase = SupabaseUserAccountManagementAPIService