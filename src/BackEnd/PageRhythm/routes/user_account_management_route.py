import json
from flask import Blueprint, jsonify, request
from models.account import AccountType, Account
from services.account.account_service import AccountService
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.user_account_management.user_account_management_service import UserAccountManagementService

user_account_management_blueprint = Blueprint("user_account_management", __name__)

@user_account_management_blueprint.route("/ban_permanently", methods=["POST"])
@jwt_required()
def ban_user():
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]

    account = account_service.get_account_by_id(account_id)

    if account is None:
        return jsonify({"message": "Account does not exist"}), 404
    
    if account.get_account_type() != AccountType.ADMIN:
        return jsonify({"message": "Unauthorized"}), 401
    
    data = request.get_json()

    banned_account_id = data.get("banned_account_id")

    requested_account = account_service.get_account_by_id(banned_account_id)

    if requested_account is None:
        return jsonify({"message": "The requested account cannot be found"}), 404
    
    if requested_account.get_account_type() == AccountType.ADMIN:
        return jsonify({"message": "Admin accounts cannot be banned"}), 400
    
    user_account_management_service = UserAccountManagementService()

    if user_account_management_service.ban_permanently(banned_account_id):
        return jsonify({"message": "Account banned"}), 200
    
    return jsonify({"message": "Account could not be banned"}), 500

@user_account_management_blueprint.route("/get_ban", methods=["POST"])
@jwt_required()
def get_ban():
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]

    account = account_service.get_account_by_id(account_id)

    if account is None:
        return jsonify({"message": "The requesting account cannot be found"}), 404
    
    if account.get_account_type() != AccountType.ADMIN:
        return jsonify({"message": "Unauthorized"}), 401
    
    data = request.get_json()

    banned_account_id = data.get("banned_account_id")

    if not account_service.check_account_exists(banned_account_id):
        return jsonify({"message": "The requested account cannot be found"}), 404

    user_account_management_service = UserAccountManagementService()
    
    banned_account = user_account_management_service.get_ban_account(banned_account_id)

    if banned_account is None:
        return jsonify({"message": "The requested account is not banned"}), 404
    
    return jsonify(banned_account.serialize_JSON()), 200