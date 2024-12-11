import datetime
import unittest
import requests


class BookTester(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(BookTester, self).__init__(*args, **kwargs)
        self.base_url = "http://127.0.0.1:5000"
        self.book_url = f"{self.base_url}/book"
        self.auth_url = f"{self.base_url}/authentication"
        self.account_url = f"{self.base_url}/account/retrieval_with_email"
        self.email = f"testforbook@example.com"
        self.password = "not_very_secure_password"
        self.token = None

    def setUp(self):
        if not self.account_exists():
            print("Account does not exist. Registering account...")
            self.register_account()
        print("Logging in...")
        self.login_account()

    def account_exists(self):
        response = requests.get(f"{self.account_url}?email={self.email}")
        return response.status_code == 200 and response.json().get("status") == "success"

    def register_account(self):
        registration_data = {
            "email": self.email,
            "first_name": "Test",
            "last_name": "User",
            "full_name": "Test User",
            "birthday": {
                "year": 2004,
                "month": 9,
                "day": 22
            },
            "bio": "A test user for book creation.",
            "account_type": "user",
            "profile_picture": None,
            "password": self.password,
        }
        response = requests.post(f"{self.auth_url}/register", json=registration_data)
        self.assertEqual(response.status_code, 200, "Account registration failed.")

    def login_account(self):
        login_data = {
            "email": self.email,
            "password": self.password,
        }
        response = requests.post(f"{self.auth_url}/login", json=login_data)
        self.assertEqual(response.status_code, 200, "Login failed.")
        self.token = response.json().get("access_token")
        self.assertIsNotNone(self.token, "Token not received.")
        print("Login successful.")

    def test_create_book(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        
        with open("user_local_files/content.txt", "w") as f:
            f.write("This is the content of the book.")
        
        with open("user_local_files/content.txt", "rb") as content_file, open("user_local_files/book_image.png", "rb") as image_file:
            files = {
                "content": content_file,
                "image": image_file
            }
            data = {
                "title": "Learn Flask",
                "author": "John Doe",
                "summary": "A book about Flask.",
                "genre": "Programming"
            }
            response = requests.post(f"{self.book_url}/create", data=data, files=files, headers=headers)
        
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertEqual(response_data.get("message"), "Book created successfully")
        book_id = response_data.get("book_id")
        self.assertIsNotNone(book_id, "Book ID not returned after creation.")
        print(f"Book created with ID: {book_id}")
        return book_id 
    
    def test_get_book_information(self):
        book_id = 1 #self.test_create_book()
        response = requests.get(f"{self.book_url}/{book_id}")
        self.assertEqual(response.status_code, 200)
        
    def test_get_all_genres(self):
        response = requests.get(f"{self.book_url}/genres")
        self.assertEqual(response.status_code, 200)
        genres = response.json()
        self.assertIsInstance(genres, list)
        print("Genres:", genres)
    
    def test_search_book(self):
        search_params = {
            "title": "Flask",
            "genre": "Programming"
        }
        response = requests.get(f"{self.book_url}/search", params=search_params)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
    def test_get_my_lib(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{self.book_url}/mylib", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        return response.json()
        
    def test_update_book(self):        
        books = self.test_get_my_lib()
        headers = {"Authorization": f"Bearer {self.token}"}
        
        if not books:
            self.fail("No books found to update.")
        
        book_id = books[0]['book_id'] 

        with open("user_local_files/updated_content.txt", "w") as f:
            f.write("This is the updated content of the book.")
        
        with open("user_local_files/updated_content.txt", "rb") as updated_file:
            files = {"content": updated_file}
            data = {
                "title": "Updated title",
                "author": "Jane Doe"
            }
            response = requests.patch(f"{self.book_url}/{book_id}", data=data, files=files, headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("message"), "Book updated successfully")
        print(f"Book with ID = {book_id} updated successfully.")

    def test_delete_book(self):
        book_id = self.test_create_book()  
        headers = {"Authorization": f"Bearer {self.token}"}

        delete_response = requests.delete(f"{self.book_url}/{book_id}", headers=headers)
        self.assertEqual(delete_response.status_code, 200, "Failed to delete book.")
        self.assertEqual(delete_response.json().get("message"), "Book deleted successfully")
        print("Book deleted successfully.")

if __name__ == "__main__":
    # unittest.main()
    suite = unittest.TestSuite()
    suite.addTest(BookTester("test_create_book"))
    suite.addTest(BookTester("test_get_book_information"))
    suite.addTest(BookTester("test_get_all_genres"))
    suite.addTest(BookTester("test_search_book"))
    suite.addTest(BookTester("test_get_my_lib"))
    suite.addTest(BookTester("test_update_book"))
    suite.addTest(BookTester("test_delete_book"))
    runner = unittest.TextTestRunner()
    runner.run(suite)
