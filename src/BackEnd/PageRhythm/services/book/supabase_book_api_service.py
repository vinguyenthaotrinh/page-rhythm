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
