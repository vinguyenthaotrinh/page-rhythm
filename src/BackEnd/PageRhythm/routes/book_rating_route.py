from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.book_rating.book_rating_service import BookRatingService

book_rating_blueprint = Blueprint("book_rating", __name__)