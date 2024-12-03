import json
from flask import Blueprint, jsonify, request
from models.account import AccountType, Account
from services.account.account_service import AccountService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

user_account_management_blueprint = Blueprint("user_account_management", __name__)

@user_account_management_blueprint.route("/ban", methods=["POST"])
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