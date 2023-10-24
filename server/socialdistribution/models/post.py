import uuid

from django.db import models
from socialdistribution.utils.constants import CONTENT_MAXLEN, STRING_MAXLEN, URL_MAXLEN


class Post(models.Model):
    """
    A post has a many-to-one relationship with an author.
    """
    # Types of content types
    class ContentType(models.TextChoices):
        BASE64 = "application/base64"    # images can need base 64 decoding
        JPEG = "image/jpeg;base64"
        MARKDOWN = "text/markdown"
        PLAIN = "text/plain"
        PNG = "image/png;base64"

    # Types of visibility for posts
    class Visibility(models.TextChoices):
        FRIENDS = "FRIENDS"
        PRIVATE = "PRIVATE"
        PUBLIC = "PUBLIC"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey("Author", on_delete=models.CASCADE)
    # ManyToMany rel in Django: sankalpjonna.com/learn-django/the-right-way-to-use-a-manytomanyfield-in-django
    categories = models.ManyToManyField("Category", blank=True)

    content = models.BinaryField(max_length=CONTENT_MAXLEN, null=True, blank=True)
    contentType = models.CharField(choices=ContentType.choices, max_length=STRING_MAXLEN, default=ContentType.PLAIN)
    description = models.TextField(max_length=STRING_MAXLEN)
    title = models.TextField(max_length=STRING_MAXLEN)
    source = models.URLField(max_length=URL_MAXLEN)
    origin = models.URLField(max_length=STRING_MAXLEN)
    published = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(null=True)
    visibility = models.TextField(default="PUBLIC")
    unlisted = models.BooleanField(default=False)
