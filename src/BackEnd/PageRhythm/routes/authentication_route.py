import json
import base64
from datetime import date
from flask import Blueprint, jsonify, request
from models.banned_account import AccountStatus
from services.account.account_service import AccountService
from services.authentication.authentication_service import AuthenticationService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.user_account_management.user_account_management_service import UserAccountManagementService

authentication_blueprint = Blueprint("authentication", __name__)

def create_access_token_with_account_id(account_id: int):
    identity = json.dumps({"account_id": account_id})
    return create_access_token(identity = identity)

@authentication_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    profile_picutre = data["profile_picture"]

    if profile_picutre is not None:
        profile_picutre = base64.b64decode(profile_picutre)

    if not AuthenticationService.verify_email_format_valid(data["email"]):
        return jsonify({"message": "Invalid email format"}), 400

    if AuthenticationService().register_account(
        email           = data["email"],
        full_name       = data["full_name"],
        first_name      = data["first_name"],
        last_name       = data["last_name"],
        birthday        = date(data["birthday"]["year"], data["birthday"]["month"], data["birthday"]["day"]),
        bio             = data["bio"],
        password        = data["password"],
        account_type    = data["account_type"],
        profile_picture = profile_picutre
    ):
        account         = AccountService().get_account_by_email(data["email"])
        access_token    = create_access_token_with_account_id(account.account_id)
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"message": "Invalid registered information"}), 401

@authentication_blueprint.route("/login", methods=["POST"])
def login():
    data                            = request.get_json()
    account_service                 = AccountService()
    authentication_service          = AuthenticationService()
    user_account_management_service = UserAccountManagementService()

    account = account_service.get_account_by_email(data["email"])

    if account is None:
        return jsonify({"message": "The account does not exist"}), 401
    
    if user_account_management_service.get_account_status(account.account_id) != AccountStatus.ACTIVE:
        return jsonify({"message": "The account is banned"}), 401

    if authentication_service.check_password_correct(data["email"], data["password"]):
        access_token = create_access_token_with_account_id(account.account_id)
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"message": "The email or password is not correct"}), 401

@authentication_blueprint.route("/change_password", methods=["PUT"])
@jwt_required()
def change_password():
    data                    =   request.get_json()

    old_password            =   data["old_password"]
    new_password            =   data["new_password"]
    confirmed_new_password  =   data["confirmed_new_password"]
    
    authentication_service = AuthenticationService()

    if new_password != confirmed_new_password:
        return jsonify({"message": "New passwords do not match"}), 400
    
    if old_password == new_password:
        return jsonify({"message": "New password must be different from old password"}), 400
    
    if len(new_password) <= 0:
        return jsonify({"message": "New password must not be empty"}), 400
    
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]

    account = AccountService().get_account_by_id(account_id)
    
    if not authentication_service.verify_password(account_id, old_password):
        return jsonify({"message": "Incorrect old password"}), 400
    
    authentication_service.change_password(account_id, new_password)

    return jsonify({"message": "Password changed successfully"}), 200

@authentication_blueprint.route("/request_password_reset", methods=["POST"])
def request_password_reset():
    data    =   request.get_json()
    email   =   data["email"]

    account = AccountService().get_account_by_email(email)

    if account is None:
        return jsonify({"message": "There is no account with the given email"}), 400
    
    return jsonify({"message": "An email has been sent to your email address"}), 200

@authentication_blueprint.route("/reset_password/<string:token>", methods=["POST", "GET"])
def reset_password(token: str):
    data = request.get_json()
    new_password = data["new_password"]
    confirmed_new_password = data["confirmed_new_password"]

    if new_password != confirmed_new_password:
        return jsonify({"message": "New passwords do not match"}), 400
    
    account_id = AuthenticationService.get_account_ID_of_password_token(token)

    if account_id is None:
        return jsonify({"message": "The token is invalid or has expired"}), 400
    
    authentication_service = AuthenticationService()
    success = authentication_service.change_password(account_id, new_password)

    if not success:
        return jsonify({"message": "An error occurred while resetting the password"}), 500

    return jsonify({"message": "Password reset successfully"}), 200
