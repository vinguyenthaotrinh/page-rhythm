class StatisticsService:
    def __init__(self, supabase_service):
        self.supabase = supabase_service

    def get_tracked_progress(self, user_id, book_id):
        return self.supabase.get_tracked_progress(user_id, book_id)

    def update_tracked_progress(self, tracked_progress):
        return self.supabase.update_tracked_progress(tracked_progress)

    def get_monthly_book_count(self, user_id, month):
        return self.supabase.get_monthly_book_count(user_id, month)

    def get_yearly_book_count(self, user_id, year):
        return self.supabase.get_yearly_book_count(user_id, year)
