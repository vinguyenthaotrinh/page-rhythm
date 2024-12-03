from services.comment.supabase_comment_api_service import SupabaseCommentAPIService

class CommentService:
    
    def __init__(self):
        self.supabase = SupabaseCommentAPIService()