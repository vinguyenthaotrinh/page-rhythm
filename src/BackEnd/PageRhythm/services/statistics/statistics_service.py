from services.statistics.supabase_statistics_api_service import SupabaseStatisticsAPIService

class StatisticsService:

    def __init__(self):
        self.supabase = SupabaseStatisticsAPIService