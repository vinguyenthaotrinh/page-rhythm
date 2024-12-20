from home_tester import HomeTester
import requests
import unittest
import random

class AccountTester(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(AccountTester, self).__init__(*args, **kwargs)
        self.url = HomeTester.get_url()

    def get_access_token(self, email, password):
        login_data = {
            "email": email,
            "password": password
        }
        response = requests.post(f"{self.url}/authentication/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        return response.json()["access_token"]


    def test_update_account_profile_information(self):
        headers = {
            "Authorization": f"Bearer {self.get_access_token("user564059341319@gmail.com", "very_secure_password")}"
        }
        updated_data = {
            "email": "thekingwhoneverwas@test.com",
            "full_name": "Updated Full Name",
            "first_name": "Updated",
            "last_name": "Name",
            "birthday": {
                "year": 1990,
                "month": 5,
                "day": 20
            },
            "bio": "Updated bio information",
            "profile_picture": None
        }
        response = requests.put(
            f"{self.url}/account/update_account_profile_information",
            json=updated_data,
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")


if __name__ == "__main__":
    unittest.main()