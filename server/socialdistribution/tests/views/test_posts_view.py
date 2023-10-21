from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import Post
from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    deserialize_response
)


class TestPostsView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()
        # reverse is used to look up the url of the view we're testing in urls.py
        self.url = reverse('posts', args=[self.author.id])  # API endpoint to be tested

    def test_get_empty_posts_from_author(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(deserialize_response(response), [])

    def test_get_some_posts_from_author(self):
        post_obj_1 = create_plain_text_post(self.author)
        post_obj_2 = create_plain_text_post(self.author)

        response = self.client.get(self.url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json_obj), 2)
        self.assertEqual(json_obj[0]["title"], post_obj_1.title)
        self.assertEqual(json_obj[0]["type"], "post")
        self.assertEqual(json_obj[1]["title"], post_obj_2.title)
        self.assertEqual(json_obj[1]["type"], "post")

    def test_post_create_post(self):
        data = {
            "title": "Test Title",
            "description": "Test Description",
            "contentType": Post.ContentType.PLAIN,
            "content": "TEST",
            "visibility": Post.Visibility.PUBLIC,
            "unlisted": False
        }
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
