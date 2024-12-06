# Book API Documentation

## Overview

This API provides functionalities for managing books, including creating, retrieving, searching, updating and deleting books.

---

## Endpoints

### 1. Create a New Book

**URL:** `/book/create`  
**Method:** `POST`  
**Authentication:** Required (JWT)

**Description:** Creates a new book entry.

**Request Parameters:**

- **Form Data:**
  - `title` (string, required): Title of the book.
  - `author` (string, required): Author of the book.
  - `summary` (string, optional): Summary of the book.
  - `genre` (string, optional): Genre of the book.
- **Files:**
  - `content` (file, required): File containing the book content (UTF-8 encoded).
  - `image` (file, optional): Cover image of the book (Base64 encoded).

**Response:**

- **201 Created:**

  ```json
  {
    "message": "Book created successfully",
    "book_id": "<book_id>"
  }
  ```

- **400 Bad Request:** Missing or invalid data.

### 2. Retrieve Book Information

**URL:** `/book/<book_id>`  
**Method:** `GET`
**Authentication:** Not required

**Description:** Retrieves information about a specific book.

**Response:**

- **200 OK:**

  ```json
  {
    "book_id": "<book_id>",
    "title": "<title>",
    "author": "<author>",
    "summary": "<summary>",
    "genre": "<genre>",
    "owner_id": "<owner_id>",
    "content": "<content>",
    "image": "<image>",
    "book_rating": "<book_rating>",
    "released_date": "<released_date>"
  }
  ```

- **404 Not Found:** Book not found.

### 3. Search for Books

**URL:** `/book/search`  
**Method:** `GET`
**Authentication:** Not required

**Description:** Searches for books based on title and genre.

**Request Parameters:**

- **Query Parameters:**
  - `title` (string, required): Title of the book.
  - `genre` (string, optional): Genre of the book.

**Response:**

- **200 OK:**

  ```json
  [
    {
      "book_id": "<book_id>",
      "title": "<title>",
      "author": "<author>",
      "summary": "<summary>",
      "genre": "<genre>",
      "owner_id": "<owner_id>",
      "content": "<content>",
      "image": "<image>",
      "book_rating": "<book_rating>",
      "released_date": "<released_date>"
    },
    ...
  ]
  ```

### 4. Get My Books

**URL:** `/book/mylib`  
**Method:** `GET`  
**Authentication:** Required (JWT)

**Description:** Retrieves all books owned by the authenticated user.

**Response:**

- **200 OK:**

  ```json
  [
    {
      "book_id": "<book_id>",
      "title": "<title>",
      "author": "<author>",
      "summary": "<summary>",
      "genre": "<genre>",
      "owner_id": "<owner_id>",
      "content": "<content>",
      "image": "<image>",
      "book_rating": "<book_rating>",
      "released_date": "<released_date>"
    },
    ...
  ]
  ```

### 5. Update Book Information

**URL:** `/book/<book_id>`  
**Method:** `PATCH`  
**Authentication:** Required (JWT)

**Description:** Updates information about a specific book.

**Request Parameters:**

- **Form Data:**
  - `title` (string, optional): Title of the book.
  - `author` (string, optional): Author of the book.
  - `summary` (string, optional): Summary of the book.
  - `genre` (string, optional): Genre of the book.
- **Files:**
  - `content` (file, optional): File containing the book content (UTF-8 encoded).
  - `image` (file, optional): Cover image of the book (Base64 encoded).

**Response:**

- **200 OK:**

  ```json
  {
    "message": "Book updated successfully"
  }
  ```

- **400 Bad Request:** Failed to update book.
- **403 Forbidden:** User does not have permission to update the book.

### 6. Delete a Book

**URL:** `/book/<book_id>`  
**Method:** `DELETE`  
**Authentication:** Required (JWT)

**Description:** Deletes a specific book.

**Response:**

- **200 OK:**

  ```json
  {
    "message": "Book deleted successfully"
  }
  ```

- **400 Bad Request:** Failed to delete book.
- **403 Forbidden:** User does not have permission to delete the book.
