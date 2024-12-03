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
            # print("Account does not exist. Registering account...")
            self.register_account()
        # print("Logging in...")
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
        # print("Login successful.")

    def test_create_book(self):
        new_book_data = {
            "title": "Learn Flask",
            "author": "John Doe",
            "summary": "A book about Flask.",
            "content": "Flask is a lightweight Python web framework.",
            "genre": "Programming"
        }
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.post(f"{self.book_url}/create", json=new_book_data, headers=headers)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertEqual(response_data.get("message"), "Book created successfully")
        book_id = response_data.get("book_id")
        self.assertIsNotNone(book_id, "Book ID not returned after creation.")
        return book_id  

    def test_update_book(self):
        book_id = self.test_create_book()  
        updated_data = {
            "title": "Learn Flask - Updated",
            "author": "Jane Doe"
        }
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.patch(f"{self.book_url}/{book_id}", json=updated_data, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("message"), "Book updated successfully")

    def test_delete_book(self):
        book_id = self.test_create_book()  
        headers = {"Authorization": f"Bearer {self.token}"}

        delete_response = requests.delete(f"{self.book_url}/{book_id}", headers=headers)
        self.assertEqual(delete_response.status_code, 200, "Failed to delete book.")
        self.assertEqual(delete_response.json().get("message"), "Book deleted successfully")

if __name__ == "__main__":
    # unittest.main()
    suite = unittest.TestSuite()
    # suite.addTest(BookTester("test_create_book"))
    # suite.addTest(BookTester("test_get_book_information"))
    # suite.addTest(BookTester("test_search_book"))
    # suite.addTest(BookTester("test_update_book"))
    suite.addTest(BookTester("test_delete_book"))
    runner = unittest.TextTestRunner()
    runner.run(suite)
