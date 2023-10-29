from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.tests.utils import (
    create_author,
    deserialize_response
)

from socialdistribution.utils import SERVICE


class TestPostsView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.url = reverse("authors")

    def test_get_no_authors(self):
        response = self.client.get(self.url)
        expected_response = {
            "type": "authors",
            "items": [],
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(deserialize_response(response), expected_response)

    def test_get_some_posts_from_author(self):
        author_obj_1 = create_author()
        author_obj_2 = create_author()

        response = self.client.get(self.url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json_obj), 2)

        host_1 = json_obj["items"][0]["host"]
        host_2 = json_obj["items"][1]["host"]

        self.assertEqual(host_1, author_obj_1.host)
        self.assertEqual(host_2, author_obj_2.host)

        id_url_1 = f"{host_1}{SERVICE}author/{author_obj_1.id}"
        id_url_2 = f"{host_2}{SERVICE}author/{author_obj_2.id}"

        self.assertEqual(json_obj["items"][0]["displayName"], author_obj_1.displayName)
        self.assertEqual(json_obj["items"][0]["type"], "author")
        self.assertEqual(json_obj["items"][0]["id"], id_url_1)
        self.assertEqual(json_obj["items"][1]["displayName"], author_obj_2.displayName)
        self.assertEqual(json_obj["items"][1]["type"], "author")
        self.assertEqual(json_obj["items"][1]["id"], id_url_2)
