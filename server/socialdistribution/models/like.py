import uuid

from django.db import models
from socialdistribution.utils.constants import CONTENT_MAXLEN, STRING_MAXLEN, URL_MAXLEN


class Like(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    context = models.TextField(default="https://www.w3.org/ns/activitystreams", editable=False)
    type = models.TextField(default="Like", editable=False)
    author = models.ForeignKey("Author", on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    comment = models.ForeignKey("Comment", on_delete=models.CASCADE, null=True, blank=True)

    