from django.db import models
from .constants import CONTENT_MAXLEN, STRING_MAXLEN, URL_MAXLEN


# Create your models here.
class Author(models.Model):
    """
    An author is a basic user in the social distribution app.
    """
    createdAt = models.DateTimeField(auto_now_add=True)
    displayName = models.CharField(max_length=STRING_MAXLEN)
    github = models.URLField(max_length=URL_MAXLEN, null=True)
    host = models.URLField(max_length=URL_MAXLEN)   # home host of the author
    profileImage = models.URLField(max_length=URL_MAXLEN)
    url = models.URLField(max_length=URL_MAXLEN)     # url to the author's profile


class Category(models.Model):
    """
    Categories for posts
    """
    category = models.CharField(max_length=STRING_MAXLEN)


class Post(models.Model):
    """
    A post has a many-to-one relationship with an author.
    """
    # Types of content types
    class ContentType(models.TextChoices):
        BASE64 = 'B64', 'application/base64'    # images can need base 64 decoding
        JPEG = 'JPEG', 'image/jpeg;base64'
        MARKDOWN = 'MD', 'text/markdown'
        PLAIN = 'PL', 'text/plain'
        PNG = 'PNG', 'image/png;base64'

    # Types of visibility for posts
    class Visibility(models.TextChoices):
        FRIENDS = "FR", "FRIENDS"
        PRIVATE = "PR", "PRIVATE"
        PUBLIC = "PB", "PUBLIC"

    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    # ManyToMany rel in Django: sankalpjonna.com/learn-django/the-right-way-to-use-a-manytomanyfield-in-django
    categories = models.ManyToManyField(Category, blank=True)

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
