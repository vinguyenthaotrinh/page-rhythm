from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.book_rating.book_rating_service import BookRatingService
from models.book_rating import BookRating
import json
import datetime

book_rating_blueprint = Blueprint("book_rating", __name__)
book_rating_service = BookRatingService()

# 1. Add a new rating
@book_rating_blueprint.route("/create", methods=["POST"])
@jwt_required()
def add_rating():
    
    user_id = json.loads(get_jwt_identity())["account_id"]
    data = request.json
    book_id = data.get("book_id")
    rating = data.get("rating")

    if not (1 <= rating <= 5):
        return jsonify({"message": "Rating must be between 1 and 5"}), 400

    new_rating = {
        "user_id": user_id,
        "book_id": book_id,
        "rating": rating,
        "date": datetime.datetime.today().strftime("%Y-%m-%d")
    }

    success = book_rating_service.add_rating(new_rating)

    if success:
        return jsonify({"message": "Rating added successfully"}), 201
    
    return jsonify({"message": "Failed to add rating"}), 400

# 2. Get all ratings for a specific book
@book_rating_blueprint.route("/<int:book_id>", methods=["GET"])
def get_book_ratings(book_id):
    ratings = book_rating_service.get_book_ratings(book_id)
    return jsonify([rating.to_serializable_JSON() for rating in ratings]), 200

# 3. Get a specific user"s rating for a specific book
@book_rating_blueprint.route("/<int:book_id>/my_rating", methods=["GET"])
@jwt_required()
def get_user_rating(book_id):
    user_id = json.loads(get_jwt_identity())["account_id"]

    rating = book_rating_service.get_user_rating(user_id, book_id)

    if rating:
        return jsonify(rating.to_serializable_JSON()), 200
    
    return jsonify({"message": "No rating found for this user and book"}), 404

# 4. Update an existing rating
@book_rating_blueprint.route("/<int:book_id>", methods=["PATCH"])
@jwt_required()
def update_rating(book_id):
    user_id = json.loads(get_jwt_identity())["account_id"]
    data = request.json
    rating = data.get("rating")
    
    if not (1 <= rating <= 5):
        return jsonify({"message": "Rating must be between 1 and 5"}), 400

    new_rating = {
        "user_id": user_id,
        "book_id": book_id,
        "rating": rating,
        "date": datetime.datetime.today().strftime("%Y-%m-%d")
    }

    success = book_rating_service.update_rating(new_rating)
    if success:
        return jsonify({"message": "Rating updated successfully"}), 200
    return jsonify({"message": "Failed to update rating"}), 400

# 5. Delete a rating
@book_rating_blueprint.route("/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_rating(book_id):
    user_id = json.loads(get_jwt_identity())["account_id"]

    success = book_rating_service.delete_rating(user_id, book_id)

    if success:
        return jsonify({"message": "Rating deleted successfully"}), 200
    
    return jsonify({"message": "Failed to delete rating"}), 400

