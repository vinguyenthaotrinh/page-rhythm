import requests

class HomeTester:

    @staticmethod
    def get_url():
        url = "https://page-rhythm-back-end.onrender.com"
        response = requests.get(url)
        if response.status_code != 200:
            url = "http://127.0.0.1:5000"
        return url