import json
from datetime import date
from flask import Blueprint, jsonify, request
from services.account.account_service import AccountService
from services.authentication.authentication_service import AuthenticationService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

authentication_blueprint = Blueprint("authentication", __name__)

def create_access_token_with_account_id(account_id: int):
    identity = json.dumps({"account_id": account_id})
    return create_access_token(identity=identity)

@authentication_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if AuthenticationService().register_account(
        email = data["email"],
        full_name = data["full_name"],
        first_name = data["first_name"],
        last_name = data["last_name"],
        birthday = date(data["birthday"]["year"], data["birthday"]["month"], data["birthday"]["day"]),
        bio = data["bio"],
        password = data["password"],
        account_type = data["account_type"],
        profile_picture = data["profile_picture"]
    ):
        account = AccountService().get_account_by_email(data["email"])
        access_token = create_access_token_with_account_id(account.account_id)
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"message": "Invalid registered information"}), 401

@authentication_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if AuthenticationService().check_password_correct(data["email"], data["password"]):
        account = AccountService().get_account_by_email(data["email"])
        access_token = create_access_token_with_account_id(account.account_id)
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"message": "Invalid login information"}), 401

@authentication_blueprint.route("/change_password", methods=["PUT"])
@jwt_required()
def change_password():
    data = request.get_json()

    old_password = data["old_password"]
    new_password = data["new_password"]
    confirmed_new_password = data["confirmed_new_password"]
    
    authentication_service = AuthenticationService()

    if new_password != confirmed_new_password:
        return jsonify({"message": "New passwords do not match"}), 400
    
    if old_password == new_password:
        return jsonify({"message": "New password must be different from old password"}), 400
    
    if len(new_password) <= 0:
        return jsonify({"message": "New password must not be empty"}), 400
    
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    
    if authentication_service.verify_password(account_id, old_password):
        return jsonify({"message": "Incorrect old password"}), 400
    
