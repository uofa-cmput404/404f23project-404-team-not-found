import uuid

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from socialdistribution.models import Post
from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    deserialize_response,
    create_comment,
)


class TestCommentView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = create_author()
        self.post = create_plain_text_post(self.author)
        self.url = reverse("comments", args=[self.author.id, self.post.id])
        self.contentType = "text/plain"


    def test_post_create_comment(self):
        data = {"contentType": "text/plain", "comment": "crazy post"}
        response = self.client.post(self.url, data, format="json")
        json_obj = deserialize_response(response)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json_obj["type"], "comment")
        self.assertEqual(json_obj["comment"],"crazy post")
        self.assertEqual(json_obj["contentType"],"text/plain")
    

    def test_get_comments(self):
        comment_obj = create_comment(self.author, self.post, self.contentType)
        response = self.client.get(self.url)
        json_obj = deserialize_response(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_obj['comments'][0]['type'], "comment")
        self.assertEqual(json_obj['comments'][0]['type'], comment_obj.type)
        self.assertEqual(json_obj['comments'][0]['comment'], comment_obj.comment)
        self.assertEqual(json_obj['comments'][0]['contentType'], comment_obj.contentType)


        
        


    

    
