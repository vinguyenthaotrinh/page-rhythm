import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.sample_audio_files.sample_audio_files_service import SampleAudioFilesService

sample_audio_file_blueprint = Blueprint("sample_audio_file", __name__)

@sample_audio_file_blueprint.route("/upload", methods=["POST"])
@jwt_required()
def upload_sample_audio_file():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]
    data = request.get_json()

    file_name = data.get("file_name")
    description = data.get("description")
    content = data.get("content")

    sample_audio_files_service = SampleAudioFilesService()

    if sample_audio_files_service.add_new_sample_audio_file(file_name, description, owner_id, content):
        return jsonify({"status": "Sample audio file was successfully uploaded"}), 200
    
    return jsonify({"message": "Failed to upload sample audio file"}), 500

@sample_audio_file_blueprint.route("/delete", methods=["POST"])
@jwt_required()
def delete_sample_audio_file():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]
    data = request.get_json()

    sample_audio_file_id = data.get("sample_audio_file_id")

    sample_audio_files_service = SampleAudioFilesService()

    if sample_audio_files_service.check_ownership(sample_audio_file_id, owner_id):
        if sample_audio_files_service.delete_sample_audio_file(sample_audio_file_id):
            return jsonify({"status": "Sample audio file was successfully deleted"}), 200
        return jsonify({"message": "Failed to delete sample audio file"}), 500
    
    return jsonify({"message": "You do not have permission to delete this sample audio file"}), 403

@sample_audio_file_blueprint.route("/update/meta_information", methods=["POST"])
@jwt_required()
def update_sample_audio_file_meta_information():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]
    data = request.get_json()

    sample_audio_file_id = data.get("sample_audio_file_id")
    file_name = data.get("file_name")
    description = data.get("description")

    sample_audio_files_service = SampleAudioFilesService()

    if sample_audio_files_service.check_ownership(sample_audio_file_id, owner_id):
        if sample_audio_files_service.update_sample_audio_file_meta_information(sample_audio_file_id, file_name, description):
            return jsonify({"status": "Sample audio file meta information was successfully updated"}), 200
        return jsonify({"message": "Failed to update sample audio file meta information"}), 500
    
    return jsonify({"message": "You do not have permission to update this sample audio file's meta information"}), 403