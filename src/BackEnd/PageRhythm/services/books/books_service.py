from services.books.supabase_books_api_service import SupabaseBooksAPIService

class BooksService:

    def __init__(self):
        self.supabase = SupabaseBooksAPIService