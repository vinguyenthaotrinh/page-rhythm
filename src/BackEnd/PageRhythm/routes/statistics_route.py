import json
from flask import Blueprint, jsonify, request
from models.tracked_progress import ReadingStatus
from services.book.book_service import BookService
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.statistics.statistics_service import StatisticsService

statistics_blueprint = Blueprint("statistics", __name__)

@statistics_blueprint.route("/tracked_progress/<string:book_id>", methods=["GET"])
@jwt_required()
def get_tracked_progress(book_id):
    current_identity    = json.loads(get_jwt_identity())
    user_id             = current_identity["account_id"]

    statistics_service = StatisticsService()

    tracked_progress = statistics_service.get_tracked_progress(user_id, book_id)

    return jsonify({
        "status": "success",
        "data": tracked_progress.to_serializable_JSON()
    }), 200

@statistics_blueprint.route("/track_progress", methods=["POST"])
@jwt_required()
def track_progress():
    current_identity    = json.loads(get_jwt_identity())
    user_id             = current_identity["account_id"]

    data        = request.get_json()

    book_id     = data.get("book_id")
    page_number = data.get("page_number")
    status      = ReadingStatus(data.get("status"))

    book_service = BookService()

    number_of_pages = len(book_service.get_all_book_pages(book_id))

    if page_number > number_of_pages:
        return jsonify({
            "status": "error",
            "message": "The page number should not be greater than the total number of pages in the book"
        }), 400

    statistics_service = StatisticsService()

    success = statistics_service.track_progress(user_id, book_id, page_number, status)

    return jsonify({
        "status": "success",
        "data": success
    }), 200

@statistics_blueprint.route("/tracked_progress/all", methods=["GET"])
@jwt_required()
def get_all_tracked_progress():
    current_identity    = json.loads(get_jwt_identity())
    user_id             = current_identity["account_id"]

    statistics_service = StatisticsService()

    tracked_progress = statistics_service.get_all_tracked_progress_of_user(user_id)

    return jsonify({
        "status": "success",
        "data": tracked_progress
    }), 200

@statistics_blueprint.route("/tracked_progress/delete", methods=["POST"])
@jwt_required()
def delete_tracked_progress():
    current_identity    = json.loads(get_jwt_identity())
    user_id             = current_identity["account_id"]

    data = request.get_json()

    book_id = data.get("book_id")

    statistics_service = StatisticsService()

    success = statistics_service.delete_tracked_progress(user_id, book_id)

    return jsonify({
        "status": "success",
        "data": success
    }), 200