import json
from flask import Blueprint, jsonify, request
from services.comment.comment_service import CommentService
from flask_jwt_extended import jwt_required, get_jwt_identity

comment_blueprint = Blueprint("comment", __name__)

@comment_blueprint.route("/create", methods=["POST"])
@jwt_required()
def create_comment():
    current_identity = json.loads(get_jwt_identity())
    comment_author_id = current_identity["account_id"]
    data = request.get_json()

    book_id = data.get("book_id")
    content = data.get("content")

    comment_service = CommentService()

    if comment_service.create_new_comment(book_id, comment_author_id, content):
        return jsonify({"status": "success"}), 200
    
    return jsonify({"message": "Failed to create comment"}), 500

@comment_blueprint.route("/reply", methods=["POST"])
@jwt_required()
def reply_comment():
    current_identity = json.loads(get_jwt_identity())
    comment_author_id = current_identity["account_id"]
    data = request.get_json()

    book_id = data.get("book_id")
    content = data.get("content")
    replied_comment_id = data.get("replied_comment_id")

    comment_service = CommentService()

    if comment_service.create_new_comment(book_id, comment_author_id, content, replied_comment_id):
        return jsonify({"status": "success"}), 200
    
    return jsonify({"message": "Failed to create comment"}), 500

@comment_blueprint.route("/get_all_comments", methods=["GET"])
def get_all_comments():
    book_id = request.args.get("book_id")
    comment_service = CommentService()
    comments = comment_service.get_all_comments(book_id)

    return jsonify([comment.to_serializable_JSON() for comment in comments]), 200

@comment_blueprint.route("/retrieve_all_comments", methods=["GET"])
def retrieve_all_comments():
    book_id = request.args.get("book_id")
    comment_service = CommentService()
    comments = comment_service.retrieve_all_comments(book_id)

    return jsonify([comment.to_serializable_JSON() for comment in comments]), 200