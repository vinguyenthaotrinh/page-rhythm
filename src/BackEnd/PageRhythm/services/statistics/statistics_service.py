from services.statistics.supabase_statistics_api_service import SupabaseStatisticsAPIService
from models.tracked_progress import TrackedProgress, ReadingStatus
from services.book.book_service import BookService
import matplotlib.pyplot as plt
from typing import Optional
import datetime
import io

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

        return self.adjust_tracked_progress(tracked_progress)
    
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
    
    def get_diagram_of_finished_books_by_days(self, user_id: int):
        # Retrieve finished book counts by days
        finished_book_counts = self.get_finished_book_count_by_days(user_id)

        # If there are no finished books, handle gracefully
        if not finished_book_counts:
            raise ValueError("No finished books data available for the user.")
        
        # Extract all dates (days) and their counts
        sorted_dates = sorted(finished_book_counts.keys())
        counts = [finished_book_counts[date] for date in sorted_dates]

        # Generate readable labels for each date (e.g., Dec 10, 2024)
        labels = [datetime.date(*date).strftime('%b %d, %Y') for date in sorted_dates]

        # Dynamically adjust the figure size based on the number of data points
        num_data_points = len(sorted_dates)
        width_factor = max(0.5, 10 / num_data_points)  # Avoid too wide bars if there's just one book read
        
        # Plot the bar chart
        plt.figure(figsize=(num_data_points * width_factor, 6))  # Adjust width based on data points
        plt.bar(labels, counts, color="#265073", alpha=0.8)
        
        plt.xlabel("Date", fontsize=12)
        plt.ylabel("Books Finished", fontsize=12)
        plt.title("Books Finished Over Time", fontsize=14)
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()

        # Save the plot to a BytesIO object
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png")
        plt.close()
        buffer.seek(0)  # Reset buffer pointer to the beginning
        
        # Return the binary content of the image
        return buffer.getvalue()

    def get_diagram_of_finished_books_by_months(self, user_id: int):
        # Retrieve finished book counts by months
        finished_book_counts = self.get_finished_book_count_by_months(user_id)

        # If there are no finished books, handle gracefully
        if not finished_book_counts:
            raise ValueError("No finished books data available for the user.")
        
        # Extract all months (year, month) and their counts
        sorted_months = sorted(finished_book_counts.keys())
        counts = [finished_book_counts[month] for month in sorted_months]

        # Generate readable labels for each month (e.g., Jan 2024)
        labels = [datetime.date(year=month[0], month=month[1], day=1).strftime('%b %Y') for month in sorted_months]

        # Plot the bar chart
        plt.figure(figsize=(10, 6))
        plt.bar(labels, counts, color="#265073", alpha=0.8)
        
        plt.xlabel("Month", fontsize=12)
        plt.ylabel("Books Finished", fontsize=12)
        plt.title("Books Finished by Month", fontsize=14)
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()

        # Save the plot to a BytesIO object
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png")
        plt.close()
        buffer.seek(0)  # Reset buffer pointer to the beginning
        
        # Return the binary content of the image
        return buffer.getvalue()
    
    def get_diagram_of_finished_books_by_years(self, user_id: int):
        # Retrieve finished book counts by years
        finished_book_counts = self.get_finished_book_count_by_years(user_id)

        # If there are no finished books, handle gracefully
        if not finished_book_counts:
            raise ValueError("No finished books data available for the user.")
        
        # Extract all years and their counts
        sorted_years = sorted(finished_book_counts.keys())
        counts = [finished_book_counts[year] for year in sorted_years]

        # Plot the bar chart
        plt.figure(figsize=(10, 6))
        plt.bar(sorted_years, counts, color="#265073", alpha=0.8)
        
        plt.xlabel("Year", fontsize=12)
        plt.ylabel("Books Finished", fontsize=12)
        plt.title("Books Finished by Year", fontsize=14)
        plt.tight_layout()

        # Save the plot to a BytesIO object
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png")
        plt.close()
        buffer.seek(0)  # Reset buffer pointer to the beginning
        
        # Return the binary content of the image
        return buffer.getvalue()
    
    def get_all_tracked_progress_of_user(self, user_id: int) -> list[dict]:
        book_service = BookService()
        result = []
        for tracked_progress in self.supabase.get_all_tracked_progress_of_user(user_id):
            book = book_service.get_book_information(tracked_progress.book_id).to_serializable_JSON()
            book["progress"] = tracked_progress.to_serializable_JSON()
            result.append(book)
        return result