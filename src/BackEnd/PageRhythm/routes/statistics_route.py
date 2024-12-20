import json
from flask import Blueprint, jsonify, request
from models.tracked_progress import ReadingStatus
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.statistics.statistics_service import StatisticsService

statistics_blueprint = Blueprint("statistics", __name__)

@statistics_blueprint.route("/tracked_progress", methods=["GET"])
@jwt_required()
def get_tracked_progress():
    current_identity = json.loads(get_jwt_identity())
    user_id = current_identity["account_id"]

    data = request.get_json()

    book_id = data.get("book_id")

    statistics_service = StatisticsService()

    tracked_progress = statistics_service.get_tracked_progress(user_id, book_id)

    return jsonify({
        "status": "success",
        "data": tracked_progress.to_serializable_JSON()
    }), 200

@statistics_blueprint.route("/track_progress", methods=["POST"])
@jwt_required()
def track_progress():
    current_identity = json.loads(get_jwt_identity())
    user_id = current_identity["account_id"]

    data = request.get_json()

    book_id = data.get("book_id")
    page_number = data.get("page_number")
    status = ReadingStatus(data.get("status"))

    statistics_service = StatisticsService()

    success = statistics_service.track_progress(user_id, book_id, page_number, status)

    return jsonify({
        "status": "success",
        "data": success
    }), 200