from services.book.supabase_book_api_service import SupabaseBookAPIService

from models.book import Book
class BookService:

    def __init__(self):
        self.supabase = SupabaseBookAPIService()

    # 1. Create a new book
    def create_book(self, book_data: dict) -> int:
        book_data.pop('book_id', None)
        new_book = Book(**book_data)
        return self.supabase.create_book(new_book)
    
    # 2. Retrieve book information
    def get_book_information(self, book_id: str) -> Book:
        book_data = self.supabase.get_book_information(book_id)
        if book_data:
            book = Book(**book_data)
            return book
        return None

    # 3. Search for books
    def search_book(self, keyword: str, genre: str = None) -> list:
        books_data = self.supabase.search_book(keyword, genre)
        return [Book(**book) for book in books_data]

    def check_ownership(self, book_id: str, owner_id: int) -> bool:
        return self.supabase.check_ownership(book_id, owner_id)

    # 4. Update book information
    def update_book(self, book_id: str, book_data: dict) -> bool:
        existing_book = self.supabase.get_book_by_id(book_id)
        if not existing_book:
            return False

        for key, value in book_data.items():
            if hasattr(existing_book, key):
                setattr(existing_book, key, value)

        return self.supabase.update_book(existing_book)

    # 5. Delete a book
    def delete_book(self, book_id: str) -> bool:
        return self.supabase.delete_book(book_id)
