import json
from models.account import AccountType
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from services.account.account_service import AccountService
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.user_account_management.user_account_management_service import UserAccountManagementService

user_account_management_blueprint = Blueprint("user_account_management", __name__)

@user_account_management_blueprint.route("/ban/permanently", methods=["POST"])
@jwt_required()
def ban_user_permanently():
    account_service     = AccountService()
    current_identity    = json.loads(get_jwt_identity())
    account_id          = current_identity["account_id"]
    account             = account_service.get_account_by_id(account_id)

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

    if user_account_management_service.ban_account_permanently(banned_account_id, account_id):
        return jsonify({"message": "Account banned"}), 200
    
    return jsonify({"message": "Account could not be banned"}), 500

@user_account_management_blueprint.route("/unban", methods=["POST"])
@jwt_required()
def unban_user():
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
    
    user_account_management_service = UserAccountManagementService()

    if user_account_management_service.unban_account(banned_account_id):
        return jsonify({"message": "Requested account was successfully unbanned"}), 200
    
    return jsonify({"message": "Account could not be unbanned"}), 500

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

@user_account_management_blueprint.route("/ban/temporarily/duration", methods=["POST"])
@jwt_required()
def ban_user_temporarily_for_pecific_duration():
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

    duration = timedelta(
        days = data["duration"]["days"],
        hours = data["duration"]["hours"],
        minutes = data["duration"]["minutes"],
        seconds = data["duration"]["seconds"]
    )

    if user_account_management_service.ban_temporarily_for_specific_duration(banned_account_id, duration):
        return jsonify({"message": "A temporary ban was successfully placed on the requested account"}), 200
    
    return jsonify({"message": "Account could not be banned"}), 500

@user_account_management_blueprint.route("/ban/temporarily/end_time", methods=["POST"])
@jwt_required()
def ban_user_temporarily_to_specific_end_time():
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

    end_time = datetime(
        year = data["end_time"]["year"],
        month = data["end_time"]["month"],
        day = data["end_time"]["day"],
        hour = data["end_time"]["hour"],
        minute = data["end_time"]["minute"],
        second = data["end_time"]["second"]
    )

    if user_account_management_service.ban_temporarily_to_specific_end_time(banned_account_id, end_time):
        return jsonify({"message": "A temporary ban was successfully placed on the requested account"}), 200
    
    return jsonify({"message": "Account could not be banned"}), 500

@user_account_management_blueprint.route("/ban/temporarily/period", methods=["POST"])
@jwt_required()
def ban_user_temporarily_for_specific_period():
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

    start_time = datetime(
        year = data["start_time"]["year"],
        month = data["start_time"]["month"],
        day = data["start_time"]["day"],
        hour = data["start_time"]["hour"],
        minute = data["start_time"]["minute"],
        second = data["start_time"]["second"]
    )

    end_time = datetime(
        year = data["end_time"]["year"],
        month = data["end_time"]["month"],
        day = data["end_time"]["day"],
        hour = data["end_time"]["hour"],
        minute = data["end_time"]["minute"],
        second = data["end_time"]["second"]
    )

    if end_time < start_time:
        return jsonify({"message": "End time cannot be before start time"}), 400

    if user_account_management_service.ban_account_temporarily_for_specific_period(banned_account_id, account_id, start_time, end_time):
        return jsonify({"message": "A temporary ban was successfully placed on the requested account"}), 200
    
    return jsonify({"message": "Account could not be banned"}), 500

@user_account_management_blueprint.route("/user/all", methods=["GET"])
@jwt_required()
def get_all_user_accounts_for_management_purpose():
    account_service = AccountService()
    current_identity = json.loads(get_jwt_identity())
    account_id = current_identity["account_id"]
    requesting_account = account_service.get_account_by_id(account_id)

    if requesting_account.get_account_type() != AccountType.ADMIN:
        return jsonify({"message": "Unauthorized"}), 401

    user_account_management_service = UserAccountManagementService()

    accounts = user_account_management_service.get_all_user_accounts()
    return jsonify({
        "status": "success",
        "data": accounts
    }), 200