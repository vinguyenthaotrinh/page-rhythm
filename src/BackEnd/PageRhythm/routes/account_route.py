from datetime import date
from flask import Blueprint, jsonify, request
from services.account.account_service import AccountService
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

account_blueprint = Blueprint("account", __name__)

@account_blueprint.route("/account/retrieval_with_email", methods=["GET"])
def get_account_with_email():
    email = request.args.get('email')

    if not email:
        return jsonify({"message": "Email parameter is required"}), 400

    try:
        account = AccountService().get_account_by_email(email)
        
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