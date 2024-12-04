from services.book_rating.supabase_book_rating_api_service import SupabaseBookRatingAPIService
from services.book.supabase_book_api_service import SupabaseBookAPIService
from models.book_rating import BookRating
class BookRatingService:

    def __init__(self):
        self.supabase = SupabaseBookRatingAPIService()

    # 1. Add a new rating
    def add_rating(self, rating_data: dict) -> bool:
        # check if book_id exists
        book_service = SupabaseBookAPIService()
        book = book_service.get_book_information(rating_data["book_id"])
        if not book:
            return False
        new_rating = BookRating(**rating_data)
        success = self.supabase.create_rating(new_rating)
        if success:
            # Update average rating for the book
            average_rating = self.supabase.calculate_average_rating(rating_data["book_id"])
            self.supabase.update_book_rating(rating_data["book_id"], average_rating)
        return success

    # 2. Get all ratings for a specific book
    def get_ratings_for_book(self, book_id: int) -> list:
        # check if book_id exists
        book_service = SupabaseBookAPIService()
        book = book_service.get_book_information(book_id)
        if not book:
            return []
        ratings_data = self.supabase.get_ratings_for_book(book_id)
        return [BookRating(**rating) for rating in ratings_data]

    # 3. Get a specific user's rating for a specific book
    def get_rating_by_user(self, user_id: int, book_id: int) -> BookRating:
        # check if book_id exists
        book_service = SupabaseBookAPIService()
        book = book_service.get_book_information(book_id)
        if not book:
            return None
        rating_data = self.supabase.get_rating_by_user(user_id, book_id)
        if rating_data:
            return BookRating(**rating_data)
        return None
    
    # 4. Update an existing rating
    def update_rating(self, rating_data: dict) -> bool:
        # check if book_id exists
        book_service = SupabaseBookAPIService()
        book = book_service.get_book_information(rating_data["book_id"])
        if not book:
            return False
        existing_rating = self.supabase.get_rating_by_user(rating_data["user_id"], rating_data["book_id"])
        if not existing_rating:
            return False

        for key, value in rating_data.items():
            if hasattr(existing_rating, key):
                setattr(existing_rating, key, value)

        success = self.supabase.update_rating(existing_rating)
        if success:
            # Update average rating for the book
            average_rating = self.supabase.calculate_average_rating(rating_data["book_id"])
            self.supabase.update_book_rating(rating_data["book_id"], average_rating)
        return success

    # 5. Delete a rating
    def delete_rating(self, user_id: int, book_id: int) -> bool:
        # check if book_id exists
        book_service = SupabaseBookAPIService()
        book = book_service.get_book_information(book_id)
        if not book:
            return
        success = self.supabase.delete_rating(user_id, book_id)
        if success:
            # Update average rating for the book
            average_rating = self.supabase.calculate_average_rating(book_id)
            self.supabase.update_book_rating(book_id, average_rating)
        return success

