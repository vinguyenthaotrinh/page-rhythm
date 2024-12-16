from services.statistics.supabase_statistics_api_service import SupabaseStatisticsAPIService
from models.tracked_progress import TrackedProgress, ReadingStatus
from typing import Optional
import datetime

class StatisticsService:

    def __init__(self):
        self.supabase = SupabaseStatisticsAPIService()

    def get_tracked_progress(self, user_id: int, book_id: int) -> TrackedProgress:
        tracked_progress = self.supabase.get_tracked_progress(user_id, book_id)

        if tracked_progress is None:
            
            tracked_progress = TrackedProgress(
                user_id = user_id,
                book_id = book_id,
                page_number = None,
                status = ReadingStatus.NOT_STARTED,
                most_recent_update_date = None
            )

            self.supabase.insert_new_tracked_progress(tracked_progress)

        return tracked_progress
    
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
            most_recent_update_date = datetime.datetime.now()
        )

        return self.supabase.adjust_tracked_progress(tracked_progress)
    
    def get_finished_books(self, user_id: int) -> list[TrackedProgress]:
        books = self.supabase.get_finished_books(user_id)
        return [TrackedProgress.deserialize_JSON(progress) for progress in books]
    
    def get_finished_book_count_by_days(self, user_id: int) -> dict[tuple, int]:
        result = {}

        for tracked_progress in self.get_finished_books(user_id):
            date = tracked_progress.get_most_recent_update_date().date()
            key = (date.year, date.month, date.day)
            if key in result:
                result[key] += 1
            else:
                result[key] = 1

        return result
    
    def get_book_count_of_last_week(self, user_id: int) -> dict[int, int]:
        # Get today's date
        today = datetime.date.today()

        # Generate a list of the last 8 days (today and 7 days before)
        last_week_dates = [today - datetime.timedelta(days=i) for i in range(8)]

        # Convert dates to the key format used in get_finished_book_count_by_days
        last_week_keys = [(date.year, date.month, date.day) for date in last_week_dates]

        # Get finished book counts by days
        finished_books_by_days = self.get_finished_book_count_by_days(user_id)

        # Filter counts for the last week and include days with zero counts
        last_week_counts = {}
        for key in reversed(last_week_keys):  # Reversed to have today first
            last_week_counts[key] = finished_books_by_days.get(key, 0)

        return last_week_counts
    
    def get_finished_book_count_by_months(self, user_id: int) -> dict[tuple, int]:
        result = {}

        for tracked_progress in self.get_finished_books(user_id):
            date = tracked_progress.get_most_recent_update_date().date()
            key = (date.year, date.month)
            if key in result:
                result[key] += 1
            else:
                result[key] = 1

        return result
    
    def get_finished_book_count_by_years(self, user_id: int) -> dict[int, int]:
        result = {}

        for tracked_progress in self.get_finished_books(user_id):
            date = tracked_progress.get_most_recent_update_date().date()
            key = date.year
            if key in result:
                result[key] += 1
            else:
                result[key] = 1

        return result
