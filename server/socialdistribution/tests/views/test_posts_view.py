from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import Post
from socialdistribution.tests.utils import create_author


# Create your tests here.
class TestPostsView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()
        # reverse is used to look up the url of the view we're testing in urls.py
        self.url = reverse('posts', args=[self.author.id])  # API endpoint to be tested

    def test_get_posts(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post(self):
        data = {
            "title": "Test Title",
            "description": "Test Description",
            "contentType": Post.ContentType.PLAIN,
            "content": "TEST",
            "visibility": Post.Visibility.PUBLIC,
            "unlisted": False
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
