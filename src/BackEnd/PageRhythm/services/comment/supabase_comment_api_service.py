from services.supabase_client_service import SupabaseClientService
from models.comment import Comment, DisplayedComment
from typing import Optional
import datetime

class SupabaseCommentAPIService:

    def __init__(self):
        self.client = SupabaseClientService()

    def get_number_of_comments(self) -> int:
        try:
            response = self.client.table("Comment").select("comment_id").execute()
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
            response = self.client.table("Comment").select("comment_id").eq("comment_id", comment_id).eq("book_id", book_id).execute()
            return len(response.data) > 0
        except Exception as e:
            return False
        return False
    
    def insert_comment(self, comment: Comment) -> bool:
        try:
            response = self.client.table("Comment").insert(comment.to_serializable_JSON()).execute()
            return True
        except Exception as e:
            print(e)
            return False
        return False
    
    def get_all_comments(self, book_id: int) -> list[Comment]:
        try:
            response = self.client.table("Comment").select("*").eq("book_id", book_id).execute()
            return [Comment.deserialize_JSON(comment) for comment in response.data]
        except Exception as e:
            return []
        return []
    
    def retrieve_all_comments(self, book_id: int) -> list[DisplayedComment]:
        try:
            # Step 1: Query the Comment table to get the comments related to the given book_id
            response = self.client.table("Comment").select("*").eq("book_id", book_id).execute()
            comments = [Comment.deserialize_JSON(comment) for comment in response.data]
            
            # Step 2: Query the Account table to get the account info (full_name, profile_picture)
            account_response = self.client.table("Account").select("account_id, full_name, profile_picture").execute()
            accounts = {account["account_id"]: account for account in account_response.data}

            # Step 3: Combine the Comment and Account data
            displayed_comments = []
            for comment in comments:
                account_info = accounts.get(comment.comment_author_id)
                if account_info:
                    # Step 4: Create a DisplayedComment object with combined data
                    displayed_comment = DisplayedComment(
                        comment_id=comment.comment_id,
                        book_id=comment.book_id,
                        comment_author_id=comment.comment_author_id,
                        comment_author_full_name=account_info["full_name"],
                        comment_author_profile_picture=account_info["profile_picture"],
                        content=comment.content,
                        replied_comment_id=comment.replied_comment_id,
                        create_time=comment.create_time
                    )
                    displayed_comments.append(displayed_comment)
            
            return displayed_comments
        
        except Exception as e:
            print(f"Error retrieving comments: {e}")
            return []