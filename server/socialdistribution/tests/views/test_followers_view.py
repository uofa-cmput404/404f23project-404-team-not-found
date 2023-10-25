from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.tests.utils import (
    create_author,
    create_author_dict,
    create_follower,
    deserialize_response
)


class TestFollowersView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()
        self.follower = create_author()
        # reverse is used to look up the url of the view we're testing in urls.py
        self.url = reverse("followers", args=[self.author.id])  # API endpoint to be tested

    def test_get_no_followers(self):
        response = self.client.get(self.url)
        expected_response = {
            "type": "followers",
            "items": [],
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(deserialize_response(response), expected_response)

    def test_get_followers(self):
        author_json = create_author_dict(author_id=self.follower.id)
        create_follower(self.author, author_json)

        response = self.client.get(self.url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "followers")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "author")
        self.assertEqual(json_obj["items"][0]["displayName"], author_json["displayName"])
