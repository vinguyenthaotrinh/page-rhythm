from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

sample_audio_file_blueprint = Blueprint("sample_audio_file", __name__)

@sample_audio_file_blueprint.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    data = request.get_json()
    pass