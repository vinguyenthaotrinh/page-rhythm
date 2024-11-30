from services.book_rating.supabase_book_rating_api_service import SupabaseBookRatingAPIService

class BookRatingService:

    def __init__(self):
        self.supabase = SupabaseBookRatingAPIService
