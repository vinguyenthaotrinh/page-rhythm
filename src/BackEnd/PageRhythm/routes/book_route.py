import json
from flask import Blueprint, jsonify, request
from services.authentication.authentication_service import AuthenticationService
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from services.book.book_service import BookService

book_blueprint = Blueprint('book', __name__)
book_service = BookService()

# 1. Create a new book
@book_blueprint.route('/create', methods=['POST'])
@jwt_required()
def create_book():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]
    data = request.json
    if not data:
        return jsonify({"error": "Invalid input", "message": "No JSON data found"}), 400
    data['owner_id'] = owner_id
    result = book_service.create_book(data)
    
    if result:
        return jsonify({"message": "Book created successfully"}), 201
    return jsonify({"message": "Failed to create book"}), 400

# 2. Retrieve book information
@book_blueprint.route('/<string:book_id>', methods=['GET'])
def get_book_information(book_id):
    book = book_service.get_book_information(book_id)
    if book:
        return jsonify(book.to_serializable_JSON()), 200
    return jsonify({"message": "Book not found"}), 404

# 3. Search for books
@book_blueprint.route('/search', methods=['GET'])
def search_book():
    keyword = request.args.get('keyword', '')
    genre = request.args.get('genre', None)
    books = book_service.search_book(keyword, genre)
    return jsonify([book.to_serializable_JSON() for book in books]), 200

@book_blueprint.route('/<string:book_id>', methods=['PATCH'])
@jwt_required()
def update_book(book_id):
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"] 
    data = request.json  
    if not book_service.check_ownership(book_id, owner_id):
        return jsonify({"message": "You do not have permission to update this book"}), 403
    result = book_service.update_book(book_id, data)
    
    if result:
        return jsonify({"message": "Book updated successfully"}), 200
    return jsonify({"message": "Failed to update book"}), 400

# 5. Delete a book
@book_blueprint.route('/<string:book_id>', methods=['DELETE'])
def delete_book(book_id):
    result = book_service.delete_book(book_id)
    if result:
        return jsonify({"message": "Book deleted successfully"}), 200
    return jsonify({"message": "Failed to delete book"}), 400
