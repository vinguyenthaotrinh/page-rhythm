import json
from flask import Blueprint, jsonify, request
from services.account.account_service import AccountService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.voice_generation.voice_generation_service import VoiceGenerationService

voice_generation_blueprint = Blueprint("voice_generation", __name__)

@voice_generation_blueprint.route("/sample_voice/all", methods=["GET"])
@jwt_required()
def get_all_sample_voices():
    account_service     = AccountService()
    current_identity    = json.loads(get_jwt_identity())
    account_id          = current_identity["account_id"]
    account             = account_service.get_account_by_id(account_id)

    if account is None:
        return jsonify({"message": "Account does not exist"}), 404
    
    voice_generation_service = VoiceGenerationService()

    return jsonify(voice_generation_service.get_all_voice_sample_names(account_id=account_id)), 200

@voice_generation_blueprint.route("/text-to-speech/", methods=["POST"])
@jwt_required()
def convert_text_to_speech():
    account_service     = AccountService()
    current_identity    = json.loads(get_jwt_identity())
    account_id          = current_identity["account_id"]
    account             = account_service.get_account_by_id(account_id)

    if account is None:
        return jsonify({"message": "Account does not exist"}), 404

    if "text_content" not in request.json:
        return jsonify({"message": "Text content is missing"}), 400

    return jsonify({"message": "The implementation of the route has not been finished yet"}), 500