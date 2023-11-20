import uuid

from django.db import models
from socialdistribution.utils.constants import STRING_MAXLEN


class Comment(models.Model):
    """
    This is a comment of a post.
    An author of a comment can be a foreign/remote author, which in this case, not in the database.
    It cannot be a foreign key to the Author model, using JSON field instead.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="comment", editable=False)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    author = models.JSONField()
    comment = models.TextField(max_length=STRING_MAXLEN)
    published = models.DateTimeField(auto_now_add=True)
    contentType = models.TextField(default="text/plain", editable=False)
