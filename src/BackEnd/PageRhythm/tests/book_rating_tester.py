import unittest
import requests

class BookRatingTester(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(BookRatingTester, self).__init__(*args, **kwargs)
        self.base_url = "http://127.0.0.1:5000"
        self.rating_url = f"{self.base_url}/book_rating"
        self.auth_url = f"{self.base_url}/authentication"
        self.account_url = f"{self.base_url}/account/retrieval_with_email"
        self.email = "testforrating@example.com"
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
            "first_name": "Rating",
            "last_name": "Tester",
            "full_name": "Rating Tester",
            "birthday": {
                "year": 2004,
                "month": 9,
                "day": 22
            },
            "bio": "A test user for book rating.",
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

    def test_add_rating(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        rating_data = {
            "book_id": 1,  # Assuming a book with ID 1 exists
            "rating": 3,
        }
        response = requests.post(f"{self.rating_url}/create", json=rating_data, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json().get("message"), "Rating added successfully")
        print("Rating added successfully.")

    def test_update_rating(self):
        book_id = 1
        headers = {"Authorization": f"Bearer {self.token}"}
        update_data = {
            "rating": 2
        }
        response = requests.patch(f"{self.rating_url}/{book_id}", json=update_data, headers=headers)  # Assuming book ID = 1
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("message"), "Rating updated successfully")
        print("Rating updated successfully.")

    def test_delete_rating(self):
        book_id = 1
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.delete(f"{self.rating_url}/{book_id}", headers=headers)  # Assuming book ID = 1
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("message"), "Rating deleted successfully")
        print("Rating deleted successfully.")

    def test_get_book_ratings(self):
        book_id = 1  # Assuming a book with ID 1 exists
        response = requests.get(f"{self.rating_url}/{book_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print(f"Ratings for book ID {book_id} successfully retrieved.")

    def test_get_user_rating(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        book_id = 1  # Assuming a book with ID 1 exists
        response = requests.get(f"{self.rating_url}/{book_id}/my_rating", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        print(f"User's rating for book ID {book_id} successfully retrieved.")


if __name__ == "__main__":
    # unittest.main()
    suite = unittest.TestSuite()
    suite.addTest(BookRatingTester("test_add_rating"))
    suite.addTest(BookRatingTester("test_update_rating"))
    suite.addTest(BookRatingTester("test_get_book_ratings"))
    suite.addTest(BookRatingTester("test_get_user_rating"))
    suite.addTest(BookRatingTester("test_delete_rating"))
    runner = unittest.TextTestRunner()
    runner.run(suite)

