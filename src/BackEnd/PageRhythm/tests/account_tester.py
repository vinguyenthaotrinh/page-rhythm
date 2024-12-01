import unittest
import requests
import random

class AccountTester(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(AccountTester, self).__init__(*args, **kwargs)
        self.url = "http://127.0.0.1:5000"

    def test_on_account_retrieval_with_given_email(self):

        email = "831121376012@test.com"

        data = {
            "email": email
        }

        response = requests.get(f"{self.url}/account/retrieval_with_email", params={"email": email})

        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()