import requests
from typing import Optional

class HomeTester:

    @staticmethod
    def is_in_debug_mode() -> bool:
        return False

    @staticmethod
    def get_local_url() -> str:
        return "http://127.0.0.1:5000"

    @staticmethod
    def get_deployed_url() -> str:
        return "https://page-rhythm-back-end.onrender.com"

    @staticmethod
    def get_url() -> Optional[str]:
        if HomeTester.is_in_debug_mode():
            return HomeTester.get_local_url()
        
        URLs = [
            HomeTester.get_local_url(),
            HomeTester.get_deployed_url()
        ]

        for url in URLs:
            try:
                response = requests.get(f"{url}/health")
                if response.status_code == 200:
                    return url
            except:
                pass

        return None