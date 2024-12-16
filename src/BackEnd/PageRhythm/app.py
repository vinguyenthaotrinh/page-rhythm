from routes.user_account_management_route import user_account_management_blueprint
from routes.sample_audio_file_route import sample_audio_file_blueprint
from routes.voice_generation_route import voice_generation_blueprint
from routes.authentication_route import authentication_blueprint
from routes.book_rating_route import book_rating_blueprint
from routes.statistics_route import statistics_blueprint
from routes.account_route import account_blueprint
from routes.comment_route import comment_blueprint
from routes.home_route import home_blueprint
from routes.book_route import book_blueprint
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
from flask import Flask
import os

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRATION_DURATION_IN_SECONDS")))

app.register_blueprint(home_blueprint,                      url_prefix = "/")
app.register_blueprint(book_blueprint,                      url_prefix = "/book")
app.register_blueprint(comment_blueprint,                   url_prefix = "/comment")
app.register_blueprint(account_blueprint,                   url_prefix = "/account")
app.register_blueprint(statistics_blueprint,                url_prefix = "/statistics")
app.register_blueprint(book_rating_blueprint,               url_prefix = "/book_rating")
app.register_blueprint(authentication_blueprint,            url_prefix = "/authentication")
app.register_blueprint(voice_generation_blueprint,          url_prefix = "/voice_generation")
app.register_blueprint(sample_audio_file_blueprint,         url_prefix = "/sample_audio_file")
app.register_blueprint(user_account_management_blueprint,   url_prefix = "/user_account_management")

jwt = JWTManager(app)

from services.statistics.supabase_statistics_api_service import SupabaseStatisticsAPIService
from services.statistics.statistics_service import StatisticsService

if __name__ == "__main__":
    #s = SupabaseStatisticsAPIService()
    s = StatisticsService()

    print(s.get_finished_books(62))

    print(s.get_finished_book_count_by_days(62))

    print(s.get_finished_book_count_by_months(62))

    print(s.get_finished_book_count_by_years(62))

    print(s.get_book_count_of_last_week(62))

    app.run(debug = True)