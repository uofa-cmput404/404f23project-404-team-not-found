from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    deserialize_response,
    create_author_dict,
    create_like,
    create_comment
)


class TestCommentLikesView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = create_author()
        self.author_json = create_author_dict(self.author.id)
        self.post = create_plain_text_post(self.author)
        self.comment = create_comment(self.author_json, self.post, "text/plain")
        self.url = reverse("comment_likes", args=[self.author.id, self.post.id, self.comment.id])
        self.post_url = reverse("single_post", args=[self.author.id, self.post.id])

    def test_get_post_likes(self):
        post_response = self.client.get(self.post_url)
        post_json_obj = deserialize_response(post_response)
        comment_url = f"{post_json_obj['id']}/comments/{self.comment.id}"

        self.author_liker = create_author()
        author_liker_json = create_author_dict(self.author_liker.id)
        create_like(author_liker_json, self.post, self.comment)

        likes_response = self.client.get(self.url)
        likes_json_obj = deserialize_response(likes_response)

        self.assertEqual(likes_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(likes_json_obj), 1)
        self.assertEqual(likes_json_obj[0]["object"], comment_url)
        self.assertEqual(likes_json_obj[0]["summary"], f"{author_liker_json['displayName']} likes your comment")
