import json
from datetime import date
from flask import Blueprint, jsonify, request
from models.account import Account, AccountType
from services.account.account_service import AccountService
from flask_jwt_extended import jwt_required, get_jwt_identity

account_blueprint = Blueprint("account", __name__)

@account_blueprint.route("/retrieval_with_email", methods=["GET"])
@jwt_required()
def get_account_with_email():
    email = request.args.get("email")
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    requesting_account = account_service.get_account_by_id(account_id)

    if requesting_account.get_account_type() != AccountType.ADMIN:
        return jsonify({"message": "Unauthorized"}), 401

    if not email:
        return jsonify({"message": "Email parameter is required"}), 400

    try:
        account = account_service.get_account_by_email(email)
        
        if account:
            return jsonify({
                "status": "success",
                "data": account.to_serializable_JSON()
            }), 200
        else:
            return jsonify({
                "message": "Account not found"
            }), 404
    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500
    
@account_blueprint.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    account = account_service.get_account_by_id(account_id)
    if account:
        return jsonify({
            "status": "success",
            "data": account.get_serializable_profile()
        }), 200
    else:
        return jsonify({"message": "Account not found"}), 404
    
@account_blueprint.route("/update_account_profile_information", methods=["PUT"])
@jwt_required()
def update_account_profile_information():
    account_service = AccountService()
    data = request.get_json()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    account = account_service.get_account_by_id(account_id)

    if not account_service.check_account_exists(account_id):
        return jsonify({"message": "Account does not exist"}), 404
    
    email = data.get("email")
    
    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    if (account.get_email() != email) and account_service.check_email_exists(email):
        return jsonify({"message": "Email already exists"}), 400
    
    full_name = data.get("full_name")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    birthday = date(data["birthday"]["year"], data["birthday"]["month"], data["birthday"]["day"])
    bio = data.get("bio")
    profile_picture = data.get("profile_picture")
    
    if account_service.update_account_profile_information(account_id, email, full_name, first_name, last_name, birthday, bio, profile_picture):
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"message": "Failed to update account"}), 500
    
    return jsonify({"message": "An error occurred"}), 500

@account_blueprint.route("/user/all", methods=["GET"])
@jwt_required()
def get_all_user_accounts():
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    requesting_account = account_service.get_account_by_id(account_id)

    if requesting_account.get_account_type() != AccountType.ADMIN:
        return jsonify({"message": "Unauthorized"}), 401

    accounts = account_service.get_all_user_accounts()
    return jsonify({
        "status": "success",
        "data": [account.to_serializable_JSON() for account in accounts]
    }), 200