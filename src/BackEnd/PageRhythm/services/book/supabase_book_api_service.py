from models.book import Book
from services.supabase_client_service import SupabaseClientService

class SupabaseBookAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    # 1. Create a new book
    def create_book(self, book: Book) -> bool:
        try:
            book_data = book.to_serializable_JSON()
            book_data.pop('book_id', None)
            response = self.client.table('Book').insert(book_data).execute()  
            return response.data
        except Exception as e:
            return False
    
    # 2. Retrieve book information
    def get_book_information(self, book_id: str) -> dict:
        try:
            response = self.client.table('Book').select('*').eq('book_id', book_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            return None

    # 3. Search for books
    def search_book(self, keyword: str, genre: str = None) -> list:
        try:
            query = self.client.table('Book').select('*').ilike('title', f'%{keyword}%')
            if genre:
                query = query.ilike('genre', genre)
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            return []
        
    def check_ownership(self, book_id: str, owner_id: int) -> bool:
        try:
            response = self.client.table("Book").select("owner_id").eq("book_id", book_id).execute()
            if not response.data:
                return False
            return response.data[0]["owner_id"] == owner_id
        except Exception as e:
            return False

    def get_book_by_id(self, book_id: str):
        try:
            response = self.client.table("Book").select("*").eq("book_id", book_id).execute()
            if not response.data:
                return None
            book_data = response.data[0]
            return Book(**book_data)
        except Exception as e:
            return None

    # 4. Update book information
    def update_book(self, book: Book) -> bool:
        try:
            response = self.client.table('Book').update(book.to_serializable_JSON()).eq('book_id', book.get_book_id()).execute()
            return response.data
        except Exception as e:
            return False
    
    # 5. Delete a book
    def delete_book(self, book_id: str) -> bool:
        try:
            response = self.client.table('Book').delete().eq('book_id', book_id).execute()
            return response.data
        except Exception as e:
            return False
