from services.book.supabase_book_api_service import SupabaseBookAPIService
from services.book_rating.book_rating_service import BookRatingService
import random
import json

from models.book import Book
class BookService:

    def __init__(self):
        self.supabase = SupabaseBookAPIService()

    # 1. Create a new book
    def create_book(self, book_data: dict) -> int:
        book_data.pop("book_id", None)
        new_book = Book(**book_data)
        return self.supabase.create_book(new_book)
    
    # 2. Retrieve book information
    def get_book_information(self, book_id: int) -> Book:
        book_data = self.supabase.get_book_information(book_id)
        if book_data:
            book = Book(**book_data)
            return book
        return None

    # 3. Search for books
    def search_book(self, title: str, genre: str = None) -> list:
        books_data = self.supabase.search_book(title, genre)
        return [Book(**book) for book in books_data]

    def check_ownership(self, book_id: int, owner_id: int) -> bool:
        return self.supabase.check_ownership(book_id, owner_id)
    
    def get_all_genres(self) -> list:
        return self.supabase.get_all_genres()
    
    # 4. Get book by owner
    def get_book_by_owner(self, owner_id: int) -> list:
        books_data = self.supabase.get_book_by_owner(owner_id)
        return [Book(**book) for book in books_data]

    # 5. Update book information
    def update_book(self, book_id: int, book_data: dict) -> bool:
        existing_book = self.supabase.get_book_by_id(book_id)
        if not existing_book:
            return False

        for key, value in book_data.items():
            if hasattr(existing_book, key):
                setattr(existing_book, key, value)

        return self.supabase.update_book(existing_book)

    # 6. Delete a book
    def delete_book(self, book_id: int) -> bool:

        book_rating_service = BookRatingService()

        book_rating_service.delete_all_ratings_for_book(book_id)

        return self.supabase.delete_book(book_id)

    def get_all_books_in_random_order(self) -> list[Book]:
        books = self.supabase.get_all_books()
        random.shuffle(books)
        return books

    def get_all_book_pages(self, book_id: int, page_capacity: int, maximum_line_length: int) -> list[str]:
        content = self.get_book_information(book_id).content
        words = content.split(" ")
        pages = []
        current_page = ""
        current_page_length = 0

        for word in words:
            word_length = len(word)

            if word_length == 0:
                continue
            
            if current_page_length == 0:
                current_page_length += word_length
                current_page += word
            else:
                current_page_length += word_length + 1
                current_page += " " + word

            for _ in range(word.count("\n")):
                if current_page_length % maximum_line_length != 0:
                    current_page_length += maximum_line_length - (current_page_length % maximum_line_length)
                else:
                    current_page_length += maximum_line_length

            if current_page_length >= page_capacity:
                if len(pages) > 0:
                    pages[-1] += " ..."
                pages.append(current_page)
                current_page = ""
                current_page_length = 0
            
        if len(current_page) > 0:
            if len(pages) > 0:
                pages[-1] += "..."
            pages.append(current_page)

        return pages