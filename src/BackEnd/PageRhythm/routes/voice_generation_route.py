from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.voice_generation.voice_generation_service import VoiceGenerationService

voice_generation_blueprint = Blueprint("voice_generation", __name__)
