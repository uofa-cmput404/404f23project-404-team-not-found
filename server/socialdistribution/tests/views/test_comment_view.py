import base64
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from socialdistribution.tests.utils.auth_tests_utils import create_auth_user

from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    deserialize_response,
    create_comment,
    create_author_dict
)


class TestCommentView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = create_author()
        self.post = create_plain_text_post(self.author)
        self.url = reverse("comments", args=[self.author.id, self.post.id])
        self.post_url = reverse("single_post", args=[self.author.id, self.post.id])
        self.contentType = "text/plain"

        user_obj = create_auth_user()
        self.auth_header = f'Basic {base64.b64encode(f"test_user:123456".encode()).decode()}'
        self.headers = {"HTTP_REFERER": "http://localhost:3000/"}
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)

    def test_post_create_comment(self):
        data = {
            "contentType": "text/plain",
            "comment": "crazy post",
            "author": create_author_dict(author_id=self.author.id)
        }

        response = self.client.post(self.url, data, format="json", **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["type"], "comment")
        self.assertEqual(json_obj["comment"], "crazy post")
        self.assertEqual(json_obj["contentType"],"text/plain")

    def test_get_comments(self):
        author = create_author_dict(author_id=self.author.id)
        comment_obj = create_comment(author, self.post, self.contentType)

        response = self.client.get(self.url, **self.headers)
        json_obj = deserialize_response(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj['comments'][0]['type'], "comment")
        self.assertEqual(json_obj['comments'][0]['type'], comment_obj.type)
        self.assertEqual(json_obj['comments'][0]['comment'], comment_obj.comment)
        self.assertEqual(json_obj['comments'][0]['contentType'], comment_obj.contentType)
