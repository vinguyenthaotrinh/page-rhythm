from flask import Blueprint, jsonify

home_blueprint = Blueprint("home", __name__)

@home_blueprint.route("/")
def home():
    return jsonify({"message": "Welcome to PageRhythm!"}), 200