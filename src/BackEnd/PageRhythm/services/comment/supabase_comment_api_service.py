from services.supabase_client_service import SupabaseClientService
from models.comment import Comment
from typing import Optional
import datetime

class SupabaseCommentAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_comments(self) -> int:
        try:
            response = self.client.table('Comment').select('comment_id').execute()
            return len(response.data)
        except Exception as e:
            return 0
        return 0
    
    def get_comment_by_id(self, comment_id: int) -> Optional[Comment]:
        try:
            response = self.client.table("Comment").select("*").eq("comment_id", comment_id).execute()
            return Comment.deserialize_JSON(response.data[0])
        except Exception as e:
            return None
        return None
    
    def check_comment_associated_with_book(self, comment_id: int, book_id: int) -> bool:
        try:
            response = self.client.table('Comment').select('comment_id').eq('comment_id', comment_id).eq('book_id', book_id).execute()
            return len(response.data) > 0
        except Exception as e:
            return False
        return False
    
    def insert_comment(self, comment: Comment) -> bool:
        try:
            response = self.client.table('Comment').insert(comment.to_serializable_JSON()).execute()
            return True
        except Exception as e:
            return False
        return False
    
    