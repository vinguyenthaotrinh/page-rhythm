from models.book import Book
from services.supabase_client_service import SupabaseClientService

class SupabaseBookAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    # 1. Create a new book
    def create_book(self, book: Book) -> int:
        try:
            book_data = book.to_serializable_JSON()
            book_data.pop('book_id', None)
            response = self.client.table('Book').insert(book_data).execute()  
            if response.data:
                return response.data[0]["book_id"]  # PostgreSQL tự động trả về ID
            return None
        except Exception as e:
            return None
    
    # 2. Retrieve book information
    def get_book_information(self, book_id: int) -> dict:
        try:
            response = self.client.table('Book').select('*').eq('book_id', book_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            return None

    # 3. Search for books
    def search_book(self, title: str, genre: str = None) -> list:
        try:
            query = self.client.table('Book').select('*').ilike('title', f'%{title}%')
            if genre:
                query = query.ilike('genre', genre)
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            return []
        
    def check_ownership(self, book_id: int, owner_id: int) -> bool:
        try:
            response = self.client.table("Book").select("owner_id").eq("book_id", book_id).execute()
            if not response.data:
                return False
            return response.data[0]["owner_id"] == owner_id
        except Exception as e:
            return False

    def get_book_by_id(self, book_id: int):
        try:
            response = self.client.table("Book").select("*").eq("book_id", book_id).execute()
            if not response.data:
                return None
            book_data = response.data[0]
            return Book(**book_data)
        except Exception as e:
            return None
    
    # 4. Get book by owner
    def get_book_by_owner(self, owner_id: int) -> list:
        try:
            response = self.client.table("Book").select("*").eq("owner_id", owner_id).execute()
            return response.data if response.data else []
        except Exception as e:
            return []

    # 5. Update book information
    def update_book(self, book: Book) -> bool:
        try:
            response = self.client.table('Book').update(book.to_serializable_JSON()).eq('book_id', book.get_book_id()).execute()
            return response.data
        except Exception as e:
            return False
    
    # 6. Delete a book
    def delete_book(self, book_id: int) -> bool:
        try:
            response = self.client.table('Book').delete().eq('book_id', book_id).execute()
            return response.data
        except Exception as e:
            return False

    def get_all_books(self) -> list[Book]:
        try:
            response = self.client.table('Book').select('*').execute()
            return [Book(**book) for book in response.data]
        except Exception as e:
            return []
        return []