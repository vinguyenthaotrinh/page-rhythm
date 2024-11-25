import os
from dotenv import load_dotenv
from routes.home import home_blueprint
from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)   

app.register_blueprint(home_blueprint)

def createSupabaseClient() -> Client:
    load_dotenv()

    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    return supabase

if __name__ == "__main__":

    supabase = createSupabaseClient()
    app.run(debug = True)