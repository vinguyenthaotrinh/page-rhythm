from services.supabase_client_service import SupabaseClientService
from models.book_rating import BookRating

class SupabaseBookRatingAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    # 1. Add a new rating
    def create_rating(self, rating: BookRating) -> bool:
        try:
            rating_data = rating.to_serializable_JSON()
            response = self.client.table("BookRating").insert(rating_data).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error creating rating: {e}")
            return False

    # 2. Calculate average rating for a book
    def calculate_average_rating(self, book_id: int) -> float:
        try:
            response = self.client.table("BookRating").select("rating").eq("book_id", book_id).execute()
            ratings = [record["rating"] for record in response.data]
            return sum(ratings) / len(ratings) if ratings else 0.0
        except Exception as e:
            print(f"Error calculating average rating: {e}")
            return 0.0

    # 3. Get all ratings for a specific book
    def get_ratings_for_book(self, book_id: int) -> list:
        try:
            response = self.client.table("BookRating").select("*").eq("book_id", book_id).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching ratings for book: {e}")
            return []

    # 4. Get a specific user's rating for a specific book
    def get_rating_by_user(self, user_id: int, book_id: int) -> dict:
        try:
            response = self.client.table("BookRating").select("*") \
                                   .eq("user_id", user_id) \
                                   .eq("book_id", book_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching user rating: {e}")
            return None

    # 5. Update average rating for a book
    def update_book_rating(self, book_id: int, average_rating: float) -> bool:
        try:
            response = self.client.table("Book").update({"book_rating": average_rating}).eq("book_id", book_id).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error updating book average rating: {e}")
            return False
        
    # 6. Update an existing rating
    def update_rating(self, rating: BookRating) -> bool:
        try:
            response = self.client.table("BookRating").update(rating.to_serializable_JSON()) \
                                   .eq("user_id", rating.user_id) \
                                   .eq("book_id", rating.book_id).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error updating rating: {e}")
            return False

    # 7. Delete a rating
    def delete_rating(self, user_id: int, book_id: int) -> bool:
        try:
            response = self.client.table("BookRating").delete() \
                                   .eq("user_id", user_id) \
                                   .eq("book_id", book_id).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error deleting rating: {e}")
            return False
