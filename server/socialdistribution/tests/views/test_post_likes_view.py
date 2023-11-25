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
    create_author_dict,
    create_like
)


class TestPostLikesView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = create_author()
        self.post = create_plain_text_post(self.author)
        self.url = reverse("post_likes", args=[self.author.id, self.post.id])
        self.post_url = reverse("single_post", args=[self.author.id, self.post.id])
        
        user_obj = create_auth_user()
        self.auth_header = f'Basic {base64.b64encode(f"test_user:123456".encode()).decode()}'
        self.headers = {"HTTP_REFERER": "http://localhost:3000/"}
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)
        
    def test_get_post_likes(self):
        post_response = self.client.get(self.post_url, **self.headers)
        post_json_obj = deserialize_response(post_response)

        self.author1_liker = create_author()
        author1_liker_json = create_author_dict(self.author1_liker.id)
        create_like(author1_liker_json, self.post, None)
        self.author2_liker = create_author()
        author2_liker_json = create_author_dict(self.author2_liker.id)
        create_like(author2_liker_json, self.post, None)

        likes_response = self.client.get(self.url, **self.headers)
        likes_json_obj = deserialize_response(likes_response)

        self.assertEqual(likes_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(likes_json_obj), 2)
        self.assertEqual(likes_json_obj[0]["object"], post_json_obj["id"])
        self.assertEqual(likes_json_obj[0]["summary"], f"{author1_liker_json['displayName']} likes your post")
        self.assertEqual(likes_json_obj[1]["object"], post_json_obj["id"])
        self.assertEqual(likes_json_obj[0]["summary"], f"{author2_liker_json['displayName']} likes your post")
