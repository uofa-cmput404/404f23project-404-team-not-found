from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import Follower, Author
from socialdistribution.tests.utils import (
    create_author,
    create_author_dict,
    create_follower,
)


class TestFollowerView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()
        self.follower = create_author()
        self.url = reverse("follower", kwargs={"author_id": self.author.id, "follower_id": self.follower.id})

    def test_delete_follower(self):
        author_json = create_author_dict(author_id=self.follower.id)
        create_follower(self.author, author_json)

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Follower.objects.filter(author=self.author, follower_author=author_json).exists())

    def test_delete_non_existent_follower(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_to_check_follower(self):
        author_json = create_author_dict(author_id=self.follower.id)
        create_follower(self.author, author_json)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_follower"])

    def test_get_to_check_non_follower(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_follower"])

    def test_put_to_add_follower(self):
        data = {
            "actor": create_author_dict(author_id=self.follower.id)
        }

        response = self.client.put(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Follower.objects.filter(author=self.author, follower_author=data["actor"]).exists())

    def test_put_to_add_existing_follower(self):
        author_json = create_author_dict(author_id=self.follower.id)
        data = {"actor": author_json}
        create_follower(self.author, author_json)

        response = self.client.put(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
