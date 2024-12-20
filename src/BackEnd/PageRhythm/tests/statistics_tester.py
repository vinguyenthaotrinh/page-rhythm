from home_tester import HomeTester
import requests
import unittest
import random

class StatisticsTester(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(StatisticsTester, self).__init__(*args, **kwargs)
        self.url = HomeTester.get_url()

if __name__ == "__main__":
    unittest.main()