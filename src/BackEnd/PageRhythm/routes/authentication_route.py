from flask import Blueprint, jsonify, request
from services.authentication.authentication_service import AuthenticationService
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

authentication_blueprint = Blueprint("authentication", __name__)

@authentication_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if AuthenticationService().register_account(
        email = data["email"],
        full_name = data["full_name"],
        first_name = data["first_name"],
        last_name = data["last_name"],
        birthday = data["birthday"],
        bio = data["bio"],
        password = data["password"],
        account_type = data["account_type"],
        profile_picture = data["profile_picture"]
    ):
        account = AuthenticationService().get_account_by_email(data["email"])
        access_token = create_access_token(identity={"account_id": account.id})
        return jsonify({"access_token": access_token}), 200
    return jsonify({"message": "Invalid registered information"}), 401

@authentication_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if AuthenticationService().check_password_correct(data["email"], data["password"]):
        account = AuthenticationService().get_account_by_email(data["email"])
        access_token = create_access_token(identity={"account_id": account.id})
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"message": "Invalid login information"}), 401