import uuid

from django.db import models
from socialdistribution.utils.constants import CONTENT_MAXLEN, STRING_MAXLEN, URL_MAXLEN


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    author = models.ForeignKey("Author", on_delete=models.CASCADE)
    comment = models.TextField()
    published = models.DateTimeField(auto_now_add=True)
    contentType = models.TextField(default="text/plain", editable=False)
