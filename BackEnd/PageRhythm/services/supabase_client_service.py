import os
from dotenv import load_dotenv
from supabase import create_client, Client

class SupabaseClientService(Client):

    def __init__(self):
        load_dotenv()

        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")

        super().__init__(url, key)