# Book Rating API Documentation

## Overview

This API provides functionalities for managing book ratings, including creating, retrieving, updating, and deleting ratings for books.

---

## Endpoints

### 1. Create a New Rating

**URL:** `/rating/create`  
**Method:** `POST`  
**Authentication:** Required (JWT)

**Description:** Creates a new rating for a book.

**Request Parameters:**

- **JSON Body:**
  - `book_id` (string, required): ID of the book to be rated.
  - `rating` (integer, required): Rating value (e.g., 1-5).
  - `comment` (string, optional): Comment about the book.

**Response:**

- **201 Created:**

  ```json
  {
    "message": "Rating created successfully",
    "rating_id": "<rating_id>"
  }
  ```

- **400 Bad Request:** Missing or invalid data.

### 2. Get All Ratings for a Specific Book

**URL:** `/book_rating/<book_id>`  
**Method:** `GET`  
**Authentication:** Not required

**Description:** Retrieves all ratings for a specific book.

**Response:**

- **200 OK:**

  ```json
  [
    {
      "user_id": "<user_id>",
      "book_id": "<book_id>",
      "rating": "<rating>",
      "date": "<date>"
    },
    ...
  ]
  ```

### 3. Get a Specific User's Rating for a Specific Book

**URL:** `/book_rating/<book_id>/my_rating`  
**Method:** `GET`  
**Authentication:** Required (JWT)

**Description:** Retrieves the authenticated user's rating for a specific book.

**Response:**

- **200 OK:**

  ```json
  {
    "user_id": "<user_id>",
    "book_id": "<book_id>",
    "rating": "<rating>",
    "date": "<date>"
  }
  ```

- **404 Not Found:** No rating found.

### 4. Update an Existing Rating

**URL:** `/book_rating/<book_id>`  
**Method:** `PATCH`  
**Authentication:** Required (JWT)

**Description:** Updates an existing rating for a specific book.

**Request Parameters:**

- **JSON Body:**
  - `rating` (integer, required): New rating value (e.g., 1-5).

**Response:**

- **200 OK:**

  ```json
  {
    "message": "Rating updated successfully"
  }
  ```

- **400 Bad Request:** Missing or invalid data.

### 5. Delete a Rating

**URL:** `/book_rating/<book_id>`  
**Method:** `DELETE`  
**Authentication:** Required (JWT)

**Description:** Deletes the authenticated user's rating for a specific book.

**Response:**

- **200 OK:**

  ```json
  {
    "message": "Rating deleted successfully"
  }
  ```

- **400 Bad Request:** Failed to delete rating.
