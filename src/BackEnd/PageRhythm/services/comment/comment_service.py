from services.comment.supabase_comment_api_service import SupabaseCommentAPIService
from models.comment import Comment, DisplayedComment
from typing import Optional
import datetime

class CommentService:
    
    def __init__(self):
        self.supabase = SupabaseCommentAPIService()

    def get_number_of_comments(self) -> int:
        return self.supabase.get_number_of_comments()
    
    def get_comment_by_id(self, comment_id: int) -> Optional[Comment]:
        return self.supabase.get_comment_by_id(comment_id)
    
    def check_comment_associated_with_book(self, comment_id: int, book_id: int) -> bool:
        return self.supabase.check_comment_associated_with_book(comment_id, book_id)
    
    def create_new_comment(self, book_id: int, comment_author_id: int, content: str, replied_comment_id: Optional[int] = None) -> bool:
        if (replied_comment_id is not None) and (not self.supabase.check_comment_associated_with_book(replied_comment_id, book_id)):
            return False
    
        comment = Comment(
            comment_id          =   self.get_number_of_comments() + 1,
            book_id             =   book_id,
            comment_author_id   =   comment_author_id,
            content             =   content,
            replied_comment_id  =   replied_comment_id,
            create_time         =   datetime.datetime.now()
        )

        comment_JSON = comment.to_serializable_JSON()

        comment_JSON.pop("comment_id", None)
      
        return self.supabase.insert_comment(comment_JSON)
    
    def get_all_comments(self, book_id: int) -> list[Comment]:
        return self.supabase.get_all_comments(book_id)
    
    def retrieve_all_comments(self, book_id: int) -> list[DisplayedComment]:
        return self.supabase.retrieve_all_comments(book_id)
    
    def delete_all_comments_of_book(self, book_id: int) -> bool:
        return self.supabase.delete_all_comments_of_book(book_id)