import base64
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from socialdistribution.tests.utils.auth_tests_utils import create_auth_user

from socialdistribution.models import InboxItem, Inbox, Post
from socialdistribution.tests.utils import (
    create_author,
    create_author_dict,
    create_comment,
    create_like,
    create_follow,
    create_inbox_item,
    create_plain_text_post,
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
        self.post = create_plain_text_post(self.author)
        self.url = reverse("inbox", args=[self.author.id])
        self.comments_url = reverse("comments", args=[self.author.id, self.post.id])
        self.posts_url = reverse('posts', args=[self.author.id])

        user_obj = create_auth_user()
        self.auth_header = f'Basic {base64.b64encode(f"test_user:123456".encode()).decode()}'
        self.headers = {"HTTP_REFERER": "http://localhost:3000/"}
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)

    def test_delete_to_clear_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)
        author_json = create_author_dict(author_id=self.follower.id)

        follow_object = create_follow(self.author, author_json)
        create_inbox_item(follow_object, inbox_object)

        response = self.client.delete(self.url, **self.headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(InboxItem.objects.filter(inbox=inbox_object).exists())

    def test_delete_to_clear_empty_inbox(self):
        response = self.client.delete(self.url, **self.headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_with_empty_inbox(self):
        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 0)

    def test_get_with_follow_item_in_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)
        author_json = create_author_dict(author_id=self.follower.id)

        follow_object = create_follow(self.author, author_json)
        create_inbox_item(follow_object, inbox_object)

        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "Follow")

    def test_get_with_post_item_in_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)

        post_object = create_plain_text_post(self.author)
        create_inbox_item(post_object, inbox_object)

        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "post")

    def test_get_with_comment_item_in_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)

        post_object = create_plain_text_post(self.author)
        author = create_author_dict(author_id=self.author.id)
        comment_object = create_comment(author, post_object, "text/plain")
        create_inbox_item(comment_object, inbox_object)

        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "comment")

    def test_get_with_like_item_in_inbox(self):
        inbox_object = Inbox.objects.get(author_id=self.author.id)

        post_object = create_plain_text_post(self.author)
        author = create_author_dict(author_id=self.author.id)
        comment_object = create_comment(author, post_object, "text/plain")
        like_object = create_like(author, post_object, comment_object)
        create_inbox_item(like_object, inbox_object)

        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "Like")

    def test_post_follow_to_inbox(self):
        data = {
            "type": "Follow",
            "summary": "Zz wanna follow u",
            "actor": create_author_dict(author_id=self.follower.id),
            "object": create_author_dict(author_id=self.author.id)
        }

        response = self.client.post(self.url, data=data, format='json', **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "Follow")
        self.assertEqual(json_obj["items"][0]["actor"]["type"], "author")

    def test_post_post_to_inbox(self):
        post_data = {
            "type": "post",
            "title": "Test Title",
            "description": "Test Description",
            "categories": ["test", "test1", "test2"],
            "contentType": Post.ContentType.PLAIN,
            "content": "TEST",
            "visibility": Post.Visibility.PUBLIC,
            "unlisted": False
        }

        post_response = self.client.post(self.posts_url, data=post_data, format="json", **self.headers)
        post_json_obj = deserialize_response(post_response)
        post_data["id"] = post_json_obj["id"]

        inbox_response = self.client.post(self.url, data=post_data, format='json', **self.headers)
        inbox_json_obj = deserialize_response(inbox_response)

        self.assertEqual(inbox_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(inbox_json_obj["type"], "inbox")
        self.assertEqual(len(inbox_json_obj["items"]), 1)
        self.assertEqual(inbox_json_obj["items"][0]["type"], "post")
        self.assertEqual(inbox_json_obj["items"][0]["title"], "Test Title")

    def test_post_comment_to_inbox(self):
        comment_data = {
            "type": "comment",
            "comment": "yee ol comment test",
            "contentType": Post.ContentType.PLAIN,
            "author": create_author_dict(author_id=self.author.id)
        }

        comment_response = self.client.post(self.comments_url, data=comment_data, format="json", **self.headers)
        comment_json_obj = deserialize_response(comment_response)
        comment_data["id"] = comment_json_obj["id"]
        comment_data["author"] = comment_json_obj["author"]

        inbox_response = self.client.post(self.url, data=comment_data, format="json", **self.headers)
        inbox_json_obj = deserialize_response(inbox_response)

        self.assertEqual(inbox_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(inbox_json_obj["type"], "inbox")
        self.assertEqual(len(inbox_json_obj["items"]), 1)
        self.assertEqual(inbox_json_obj["items"][0]["type"], "comment")
        self.assertEqual(inbox_json_obj["items"][0]["comment"], "yee ol comment test")

    def test_post_like_post_to_inbox(self):
        post_data = {
            "type": "post",
            "title": "Test Title",
            "description": "Test Description",
            "categories": ["test", "test1", "test2"],
            "contentType": Post.ContentType.PLAIN,
            "content": "TEST",
            "visibility": Post.Visibility.PUBLIC,
            "unlisted": False,
        }
        like_data = {
            "type": "like",
            "author": create_author_dict(author_id=self.author.id)
        }

        post_response = self.client.post(self.posts_url, data=post_data, format="json", **self.headers)
        post_json_obj = deserialize_response(post_response)
        like_data["object"] = post_json_obj["id"]

        response = self.client.post(self.url, data=like_data, format='json', **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["type"], "inbox")
        self.assertEqual(len(json_obj["items"]), 1)
        self.assertEqual(json_obj["items"][0]["type"], "Like")
        self.assertEqual(json_obj["items"][0]["summary"], f"{self.author.displayName} likes your post")

    def test_post_invalid_without_type(self):
        data = {
            "summary": "Zz wanna follow u",
            "actor": create_author_dict(author_id=self.follower.id),
            "object": create_author_dict(author_id=self.author.id)
        }

        response = self.client.post(self.url, data=data, format='json', **self.headers)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
