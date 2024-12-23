import re
import json
from flask import Blueprint, jsonify, request
from services.account.account_service import AccountService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.voice_generation.voice_generation_service import VoiceGenerationService
from services.sample_audio_files.sample_audio_files_service import SampleAudioFilesService

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

@voice_generation_blueprint.route("/text_to_speech/", methods=["POST"])
@jwt_required()
def convert_text_to_speech():
    account_service     = AccountService()
    current_identity    = json.loads(get_jwt_identity())
    account_id          = current_identity["account_id"]
    account             = account_service.get_account_by_id(account_id)

    if account is None:
        return jsonify({"message": "Account does not exist"}), 404
    
    text_content = request.json.get("text_content")

    voice_id = request.json.get("voice_id")

    origin, id, name = voice_id.split("-")

    sample_audio_files_service = SampleAudioFilesService()

    if (origin == "uploaded") and sample_audio_files_service.check_ownership(int(id), account_id):
        return jsonify({"message": "You are not allowed to use this voice"}), 403
    
    voice_generation_service = VoiceGenerationService()

    result = None

    if origin == "uploaded":
        used_name = VoiceGenerationService.find_most_similar_default_voice_sample_name(name)

        result = voice_generation_service.convert_text_to_speech(account_id, text_content, used_name)

    else:

        result = voice_generation_service.convert_text_to_speech(account_id, text_content, name)

    if result is None:
        return jsonify({"message": "Failed to convert text to speech"}), 500
    
    return jsonify(result), 200