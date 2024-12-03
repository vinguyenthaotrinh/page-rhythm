from flask import Blueprint, jsonify, request
from services.authentication.authentication_service import AuthenticationService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

book_rating_blueprint = Blueprint("book_rating", __name__)