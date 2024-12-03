import unittest
import requests
import random
import base64

class AuthenticationTester(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(AuthenticationTester, self).__init__(*args, **kwargs)
        self.url = "http://127.0.0.1:5000"

    def test_random_account_registration_1(self):

        def get_image_bytes(url):
            try:
                response = requests.get(url, stream=True) 
                response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
                
                # Check if the content is an image
                if "image" in response.headers.get("content-type", ""):
                    #print(len(response.content))
                    encoded_data = base64.b64encode(response.content).decode("utf-8")
                    return encoded_data
                else:
                    print("URL does not point to an image.")
                    return None
            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")
                return None

        email = f"user{random.randint(100000000000, 999999999999)}@gmail.com"
        first_name = "Joel"
        last_name = "Borden"
        full_name = f"{first_name} {last_name}"
        birthday = {
            "year": random.randint(1900, 2021),
            "month": random.randint(1, 12),
            "day": random.randint(1, 28)
        }
        bio = f"I am a software engineer who loves the number {random.randint(1, 31082003)}"
        account_type = "user"
        profile_picture = random.choice([
            None,
            get_image_bytes("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/800px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg")
        ])
        password = f"test{random.randint(100000, 999999)}"
        data = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": full_name,
            "birthday": birthday,
            "bio": bio,
            "account_type": account_type,
            "profile_picture": profile_picture,
            "password": password
        }

        response = requests.post(f"{self.url}/authentication/register", json=data)
        self.assertEqual(response.status_code, 200)

    def test_random_account_registration_2(self):

        def get_image_bytes(url):
            try:
                response = requests.get(url, stream=True) 
                response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
                
                # Check if the content is an image
                if "image" in response.headers.get("content-type", ""):
                    encoded_data = base64.b64encode(response.content).decode("utf-8")
                    return encoded_data
                else:
                    print("URL does not point to an image.")
                    return None
            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")
                return None

        email = f"user{random.randint(100000000000, 999999999999)}@gmail.com"
        first_name = "Joel"
        last_name = "Byden"
        full_name = f"{first_name} {last_name}"
        birthday = {
            "year": random.randint(1900, 2021),
            "month": random.randint(1, 12),
            "day": random.randint(1, 28)
        }
        bio = f"I am a software engineer who loves the number {random.randint(1, 31082003)}"
        account_type = "user"
        profile_picture = random.choice([
            None,
            get_image_bytes("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/800px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg")
        ])
        password = "very_secure_password"
        data = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": full_name,
            "birthday": birthday,
            "bio": bio,
            "account_type": account_type,
            "profile_picture": profile_picture,
            "password": password
        }

        response = requests.post(f"{self.url}/authentication/register", json=data)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()