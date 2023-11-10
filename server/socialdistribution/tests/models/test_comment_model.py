from django.test import TestCase

from socialdistribution.models import Post, Comment
from socialdistribution.tests.utils import (
    create_author,
    create_plain_text_post,
    create_comment,
)


class TestCommentModel(TestCase):
    def setUp(self):
        self.author = create_author()
        self.post = create_plain_text_post(self.author)
        self.comment = create_comment(self.author, self.post)

    def test_create_and_retrieve_comment(self):
        Comment.objects.create(
            author=self.author,
            post=self.post,
            comment="This is a test comment.",
            contentType="text/plain",
        )
        comment1 = Comment.objects.get(comment="This is a test comment.")

        self.assertEqual(comment1.comment, "This is a test comment.")
        self.assertEqual(comment1.type, "comment")

    def test_comment_has_author_and_post(self):
        comment2 = create_comment(self.author, self.post)
        self.assertEqual(comment2.author, self.author)
        self.assertEqual(comment2.post, self.post)
