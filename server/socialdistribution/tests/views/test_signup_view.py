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


class TestSignUp(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.url = reverse("signup")

    def test_create_new_author(self):
        request_data = {
            "username": "test_user",
            "email": "test_user@gmail.com",
            "password": "123456",
            "displayName": "test_author"
        }

        response = self.client.post(self.url, data=urlencode(request_data), content_type="application/x-www-form-urlencoded")
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["displayName"], "test_author")
        self.assertEqual(json_obj["github"], "https://placeholder.com")
        self.assertEqual(json_obj["host"], "https://placeholder.com")
        self.assertEqual(json_obj["profileImage"], "https://placeholder.com")
        self.assertEqual(json_obj["url"], "https://placeholder.com")

    def test_duplicated_username(self):
        user_obj = create_auth_user()
        author_obj = create_auth_author(user_obj)

        # case: username already exists
        request_data = {
            "username": "test_user",
            "email": "test_user@gmail.com",
            "password": "123456",
            "displayName": "test_author"
        }       

        response = self.client.post(self.url, data=urlencode(request_data), content_type="application/x-www-form-urlencoded")
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(json_obj["message"], "Username already exists")