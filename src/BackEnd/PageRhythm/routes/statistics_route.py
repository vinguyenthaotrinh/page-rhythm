from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.statistics.statistics_service import StatisticsService

statistics_blueprint = Blueprint("statistics", __name__)