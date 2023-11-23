import uuid

from django.db import models


class Like(models.Model):
    """
    A user can like a post or a comment.
    An author of a like can be a foreign/remote author, which in this case, not in the database.
    It cannot be a foreign key to the Author model, using JSON field instead.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    context = models.TextField(default="https://www.w3.org/ns/activitystreams", editable=False)
    type = models.TextField(default="Like", editable=False)
    author = models.JSONField()
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    comment = models.ForeignKey("Comment", on_delete=models.CASCADE, null=True, blank=True)
