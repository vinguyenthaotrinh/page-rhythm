from flask import Blueprint, jsonify

home_blueprint = Blueprint("home", __name__)

@home_blueprint.route("/", methods=["GET"])
def home():
    return jsonify({"success": True, "message": "Welcome to PageRhythm!"}), 200

@home_blueprint.route("/health", methods=["GET"])
def health():
    return jsonify({"success": True, "message": "PageRhythm is healthy!"}), 200