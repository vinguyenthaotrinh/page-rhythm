from services.supabase_client_service import SupabaseClientService
from models.tracked_progress import TrackedProgress
from typing import Optional

class SupabaseStatisticsAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_tracked_progress(self, user_id: int, book_id: int) -> Optional[TrackedProgress]:
        try:
            response = self.client.table("TrackedProgress").select("*").eq("user_id", user_id).eq("book_id", book_id).execute()
            return TrackedProgress.deserialize_JSON(response.data[0])
        except Exception as e:
            print(e)
            return None
        return None
    
    def insert_new_tracked_progress(self, tracked_progress: TrackedProgress) -> bool:
        try:
            response = self.client.table("TrackedProgress").insert(tracked_progress.to_serializable_JSON()).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def update_tracked_progress(self, tracked_progress: TrackedProgress) -> bool:
        try:
            response = self.client.table("TrackedProgress").update(tracked_progress.to_serializable_JSON()).eq("user_id", tracked_progress.user_id).eq("book_id", tracked_progress.book_id).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def get_finished_books(self, user_id: int) -> list:
        try:
            response = self.client.table("TrackedProgress").select("*").eq("user_id", user_id).eq("status", "FINISHED").execute()
            return response.data
        except Exception as e:
            print(e)
            return []
        return []