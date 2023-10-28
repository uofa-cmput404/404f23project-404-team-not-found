from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import InboxItem, Inbox
from socialdistribution.tests.utils import (
    create_author,
    create_author_dict,
    create_follow,
    create_follow_inbox_item,
    deserialize_response
)


class TestInboxView(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.client = APIClient()
        self.author = create_author()
        self.follower = create_author()
        self.url = reverse("inbox", args=[self.author.id])

    def test_delete_to_clear_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)
        author_json = create_author_dict(author_id=self.follower.id)

        follow_object = create_follow(self.author, author_json)
        create_follow_inbox_item(follow_object, inbox_object)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(InboxItem.objects.filter(inbox=inbox_object).exists())

    def test_delete_to_clear_empty_inbox(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_with_empty_inbox(self):
        response = self.client.get(self.url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 0)

    def test_get_with_follow_item_in_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)
        author_json = create_author_dict(author_id=self.follower.id)

        follow_object = create_follow(self.author, author_json)
        create_follow_inbox_item(follow_object, inbox_object)

        response = self.client.get(self.url)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "Follow")

    def test_post_follow_to_inbox(self):
        data = {
            "type": "Follow",
            "summary": "Zz wanna follow u",
            "actor": create_author_dict(author_id=self.follower.id),
            "object": create_author_dict(author_id=self.author.id)
        }

        response = self.client.post(self.url, data=data, format='json')
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["type"], "Follow")
        self.assertEqual(json_obj["actor"]["type"], "author")

    def test_post_invalid_without_type(self):
        data = {
            "summary": "Zz wanna follow u",
            "actor": create_author_dict(author_id=self.follower.id),
            "object": create_author_dict(author_id=self.author.id)
        }

        response = self.client.post(self.url, data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
