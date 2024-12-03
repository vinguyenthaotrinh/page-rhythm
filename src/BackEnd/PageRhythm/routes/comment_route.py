from flask import Blueprint, jsonify, request
from services.comment.comment_service import CommentService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

comment_blueprint = Blueprint("comment", __name__)

@comment_blueprint.route("/create", methods=["POST"])
@jwt_required()
def create_comment():
    comment_author_id = get_jwt_identity()
    pass