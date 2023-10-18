from django.test import TestCase

from socialdistribution.models import Post
from socialdistribution.tests.utils import create_author, create_plain_text_post


# Create your tests here.
class TestPostModel(TestCase):
    def setUp(self):
        """
        Setting up the tests. This will run before any of the test methods.
        """
        self.author = create_author()

    def test_create_and_retrieve_post(self):
        Post.objects.create(
            author=self.author,
            title="Test Post",
            description="This is a test post.",
            contentType=Post.ContentType.PLAIN,
            content="This is test content.".encode("utf-8"),
            visibility=Post.Visibility.PUBLIC
        )

        post = Post.objects.get(title="Test Post")
        self.assertEqual(post.description, "This is a test post.")

    def test_post_has_author(self):
        post = create_plain_text_post(self.author)

        self.assertEqual(post.author, self.author)
