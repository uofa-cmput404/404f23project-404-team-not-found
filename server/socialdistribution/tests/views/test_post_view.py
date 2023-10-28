import uuid

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


class TestPostView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()

    def test_get_post_given_author_and_post_ids(self):
        post_obj = create_plain_text_post(self.author)
        url = reverse('single_post', args=[self.author.id, post_obj.id])

        response = self.client.get(url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["title"], post_obj.title)
        self.assertEqual(json_obj["description"], post_obj.description)

    def test_post_update_post(self):
        post_obj = create_plain_text_post(self.author)
        data = {
            "title": "Update the title",
            "categories": ["test", "test1", "test2"],
            "description": "Update the description"
        }
        url = reverse('single_post', args=[self.author.id, post_obj.id])

        response = self.client.post(url, data, format="json")
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # see that only title and description are changed from previous post_obj
        self.assertEqual(json_obj["title"], data["title"])
        self.assertEqual(json_obj["description"], data["description"])
        self.assertEqual(json_obj["content"], post_obj.content.decode("utf-8"))

    def test_put_create_post_given_id(self):
        post_id = uuid.uuid4()
        data = {
            "id": post_id,
            "title": "PUT: Test Title",
            "description": "PUT: Test Description",
            "categories": ["test", "test1", "test2"],
            "contentType": Post.ContentType.PLAIN,
            "content": "TEST",
            "visibility": Post.Visibility.PUBLIC,
            "unlisted": False
        }
        url = reverse('single_post', args=[self.author.id, post_id])

        response = self.client.put(url, data, format='json')
        json_obj = deserialize_response(response)
        uri = json_obj["author"]["host"]

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["id"], f"{uri}api/author/{self.author.id}/posts/{post_id}")
        self.assertEqual(json_obj["title"], data["title"])
        self.assertEqual(json_obj["description"], data["description"])
        self.assertEqual(json_obj["content"], data["content"])
