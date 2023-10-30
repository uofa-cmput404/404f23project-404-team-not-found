from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import Follower, Author
from socialdistribution.tests.utils.auth_tests_utils import (
    create_auth_user,
    create_auth_author,
)

from socialdistribution.tests.utils import (
    deserialize_response
)

from urllib.parse import urlencode  


class TestLogin(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.url = reverse("login")

    def test_login(self):
        user_obj = create_auth_user()
        author_obj = create_auth_author(user_obj)

        request_data = {
            "username": "test_user",
            "password": "123456",

        }

        response = self.client.post(self.url, data=urlencode(request_data), content_type="application/x-www-form-urlencoded")
        json_obj = deserialize_response(response)

        # case: successful login
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(user_obj.check_password(request_data["password"]), True)
        

    def test_wrong_password(self):
        user_obj = create_auth_user()
        author_obj = create_auth_author(user_obj)

        request_data = {
            "username": "test_user",
            "password": "1234567",

        }

        response = self.client.post(self.url, data=urlencode(request_data), content_type="application/x-www-form-urlencoded")
        json_obj = deserialize_response(response)

        # case: wrong password, failed login
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_obj.check_password(request_data["password"]), False)

    def test_not_exist_user(self):
        user_obj = create_auth_user()
        author_obj = create_auth_author(user_obj)

        request_data = {
            "username": "not_exist_user",
            "password": "123456",

        }

        response = self.client.post(self.url, data=urlencode(request_data), content_type="application/x-www-form-urlencoded")
        json_obj = deserialize_response(response)

        # case: wrong password, failed login
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)