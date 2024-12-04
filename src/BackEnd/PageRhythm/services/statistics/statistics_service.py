from services.statistics.supabase_statistics_api_service import SupabaseStatisticsAPIService
from models.tracked_progress import TrackedProgress, ReadingStatus
from typing import Optional
import datetime

class StatisticsService:

    def __init__(self):
        self.supabase = SupabaseStatisticsAPIService

    def get_tracked_progress(self, user_id: int, book_id: int) -> Optional[TrackedProgress]:
        return self.supabase.get_tracked_progress(user_id, book_id)
    
    def adjust_tracked_progress(self, tracked_progress: TrackedProgress) -> bool:

        if self.get_tracked_progress(tracked_progress.user_id, tracked_progress.book_id) is None:
            return self.supabase.insert_new_tracked_progress(tracked_progress)

        return self.supabase.update_tracked_progress(tracked_progress)

    def track_progress(self, user_id: int, book_id: int, page_number: Optional[int], status: ReadingStatus) -> bool:
        tracked_progress = TrackedProgress(
            user_id     =   user_id, 
            book_id     =   book_id, 
            page_number =   page_number, 
            status      =   status, 
            most_recent_update = datetime.datetime.now()
        )

        return self.supabase.adjust_tracked_progress(tracked_progress)
