class SupabaseStatisticsAPIService:
    def __init__(self, supabase_client):
        self.client = supabase_client

    def get_tracked_progress(self, user_id, book_id):
        response = self.client.from_("TrackedProgress").select("*").eq("user_id", user_id).eq("book_id", book_id).execute()
        data = response.data[0] if response.data else None
        if data:
            return TrackedProgress(
                user_id=data["user_id"],
                book_id=data["book_id"],
                page_number=data["page_number"],
                status=data["status"],
                most_recent_update_date=data["most_recent_update_date"],
            )
        return None

    def update_tracked_progress(self, tracked_progress):
        data = tracked_progress.to_serializable_JSON()
        response = self.client.from_("TrackedProgress").upsert(data).execute()
        return response

    def get_monthly_book_count(self, user_id, month):
        # Implement query logic here using Supabase SQL filters
        pass

    def get_yearly_book_count(self, user_id, year):
        # Implement query logic here using Supabase SQL filters
        pass
