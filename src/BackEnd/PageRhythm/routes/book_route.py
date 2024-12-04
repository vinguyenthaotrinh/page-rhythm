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

    # Lấy các thông tin khác từ form data
    title = request.form.get("title")
    author = request.form.get("author")
    summary = request.form.get("summary")
    genre = request.form.get("genre")
    
    # Kiểm tra và đọc file `content`
    if "content" not in request.files:
        return jsonify({"message": "Content file is required."}), 400

    content_file = request.files["content"]
    if content_file.filename == "":
        return jsonify({"message": "No selected file."}), 400

    # Đọc nội dung file (giả sử là tệp văn bản `.txt`)
    try:
        content = content_file.read().decode("utf-8")
    except Exception as e:
        return jsonify({"message": "Failed to read the content file."}), 400

    # Gộp dữ liệu vào dictionary để tạo sách
    book_data = {
        "title": title,
        "author": author,
        "summary": summary,
        "content": content,
        "genre": genre,
        "owner_id": owner_id
    }

    book_id = book_service.create_book(book_data)
    if book_id:
        return jsonify({"message": "Book created successfully", "book_id": book_id}), 201
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

    # Kiểm tra quyền sở hữu
    if not book_service.check_ownership(book_id, owner_id):
        return jsonify({"message": "You do not have permission to update this book."}), 403

    # Lấy các thông tin từ form data
    title = request.form.get("title")
    author = request.form.get("author")
    summary = request.form.get("summary")
    genre = request.form.get("genre")

    # Kiểm tra file `content` nếu có
    content = None
    if "content" in request.files:
        content_file = request.files["content"]
        if content_file.filename != "":
            try:
                content = content_file.read().decode("utf-8")
            except Exception as e:
                return jsonify({"message": "Failed to read the content file."}), 400

    # Chỉ cập nhật các trường không rỗng
    updated_data = {key: value for key, value in {
        "title": title,
        "author": author,
        "summary": summary,
        "content": content,
        "genre": genre
    }.items() if value is not None}

    result = book_service.update_book(book_id, updated_data)
    if result:
        return jsonify({"message": "Book updated successfully"}), 200
    return jsonify({"message": "Failed to update book"}), 400

# 5. Delete a book
@book_blueprint.route('/<string:book_id>', methods=['DELETE'])
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
