from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.book.book_service import BookService
import json
import base64
import datetime

book_blueprint = Blueprint("book", __name__)
book_service = BookService()

# 1. Create a new book
@book_blueprint.route("/create", methods=["POST"])
@jwt_required()
def create_book():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]

    data = request.form
    title = data.get("title")
    author = data.get("author")
    summary = data.get("summary")
    genre = data.get("genre")
    
    content_file = request.files.get("content")
    if not content_file or content_file.filename == "":
        return jsonify({"message": "Content file is required"}), 400

    try:
        content = content_file.read().decode("utf-8")
    except Exception as e:
        return jsonify({"message": "Failed to read the content file."}), 400
    
    image_file = request.files.get("image")
    if image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")
    else:
        image_data = None

    book_data = {
        "title": title,
        "author": author,
        "summary": summary,
        "genre": genre,
        "owner_id": owner_id,
        "content": content,
        "image": image_data,
        "book_rating": 0.0,
        "released_date": datetime.datetime.today().strftime("%Y-%m-%d")
    }

    book_id = book_service.create_book(book_data)
    if book_id:
        return jsonify({"message": "Book created successfully", "book_id": book_id}), 201
    return jsonify({"message": "Failed to create book"}), 400

# 2. Retrieve book information
@book_blueprint.route("/<string:book_id>", methods=["GET"])
def get_book_information(book_id):
    book = book_service.get_book_information(book_id)
    if book:
        return jsonify(book.to_serializable_JSON()), 200
    return jsonify({"message": "Book not found"}), 404

# 3. Search for books
@book_blueprint.route("/search", methods=["GET"])
def search_book():
    title = request.args.get("title", "")
    genre = request.args.get("genre", None)
    books = book_service.search_book(title, genre)
    return jsonify([book.to_serializable_JSON() for book in books]), 200

# 4. Get my book
@book_blueprint.route("/mylib", methods=["GET"])
@jwt_required()
def get_my_lib():
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]
    books = book_service.get_book_by_owner(owner_id)
    return jsonify([book.to_serializable_JSON() for book in books]), 200

# 5. Update book information
@book_blueprint.route("/<string:book_id>", methods=["PATCH"])
@jwt_required()
def update_book(book_id):
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]

    if not book_service.check_ownership(book_id, owner_id):
        return jsonify({"message": "You do not have permission to update this book."}), 403

    data = request.form
    title = data.get("title")
    author = data.get("author")
    summary = data.get("summary")
    genre = data.get("genre")

    content = None
    if "content" in request.files:
        content_file = request.files["content"]
        if content_file.filename != "":
            try:
                content = content_file.read().decode("utf-8")
            except Exception as e:
                return jsonify({"message": "Failed to read the content file."}), 400
            
    image = None
    if "image" in request.files:
        image_file = request.files["image"]
        if image_file.filename != "":
            try:
                image = base64.b64encode(image_file.read()).decode("utf-8")
            except Exception as e:
                return jsonify({"message": "Failed to read the image file."}), 400

    updated_data = {key: value for key, value in {
        "title": title,
        "author": author,
        "summary": summary,
        "genre": genre,
        "content": content,
        "image": image
    }.items() if value is not None}

    result = book_service.update_book(book_id, updated_data)
    if result:
        return jsonify({"message": "Book updated successfully"}), 200
    return jsonify({"message": "Failed to update book"}), 400

# 6. Delete a book
@book_blueprint.route("/<string:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    current_identity = json.loads(get_jwt_identity())
    owner_id = current_identity["account_id"]  
    
    if not book_service.check_ownership(book_id, owner_id):
        return jsonify({"message": "You do not have permission to delete this book"}), 403

    result = book_service.delete_book(book_id)
    if result:
        return jsonify({"message": "Book deleted successfully"}), 200
    return jsonify({"message": "Failed to delete book"}), 400

@book_blueprint.route("/all/random", methods=["GET"])
def get_all_books_in_random_order():
    books = book_service.get_all_books_in_random_order()
    return jsonify([book.to_serializable_JSON() for book in books]), 200

@book_blueprint.route("/get_all_book_pages/<int:book_id>/<int:page_capacity>", methods=["GET"])
def get_all_book_pages(book_id, page_capacity):
    return jsonify(book_service.get_all_book_pages(book_id, page_capacity)), 200