from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.tests.utils import (
    create_author,
    deserialize_response
)

from socialdistribution.utils import SERVICE


class TestAuthorView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()

    def test_get_author(self):
        author_object = create_author()
        url = reverse("author", args=[author_object.id])

        response = self.client.get(url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        host = json_obj["host"]
        id_url = f"{host}{SERVICE}author/{author_object.id}"

        self.assertEqual(host, author_object.host)
        self.assertEqual(json_obj["id"], id_url)
        self.assertEqual(json_obj["type"], "author")
        self.assertEqual(json_obj["displayName"], author_object.displayName)
