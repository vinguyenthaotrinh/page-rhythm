from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from routes.authentication_route import authentication_blueprint
from routes.home_route import home_blueprint
from routes.book_route import book_blueprint
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = os.environ.get("JWT_ACCESS_TOKEN_EXPIRES")

app.register_blueprint(home_blueprint)
app.register_blueprint(authentication_blueprint)
app.register_blueprint(book_blueprint, url_prefix='/book')

jwt = JWTManager(app)

if __name__ == "__main__":    
    app.run(debug = True)



