import base64

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from socialdistribution.tests.utils.auth_tests_utils import create_auth_user

from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    create_image_post,
    deserialize_response
)


class TestPostImageView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()

        user_obj = create_auth_user()
        self.auth_header = f'Basic {base64.b64encode(f"test_user:123456".encode()).decode()}'
        self.headers = {"HTTP_REFERER": "http://localhost:3000/"}
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)
        

    def test_get_non_image_post(self):
        post_obj = create_plain_text_post(self.author)
        url = reverse("image_post", args=[self.author.id, post_obj.id])

        response = self.client.get(url, **self.headers)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_image_post(self):
        post_obj = create_image_post(self.author)
        base64_encoded = base64.b64encode(post_obj.content)
        expected_data = f"data:{post_obj.contentType},{base64_encoded.decode('utf-8')}"
        url = reverse("image_post", args=[self.author.id, post_obj.id])

        response = self.client.get(url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(expected_data, json_obj)
