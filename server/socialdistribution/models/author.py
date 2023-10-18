import uuid

from django.db import models
from socialdistribution.utils.constants import STRING_MAXLEN, URL_MAXLEN


class Author(models.Model):
    """
    An author is a basic user in the social distribution app.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    displayName = models.CharField(max_length=STRING_MAXLEN)
    github = models.URLField(max_length=URL_MAXLEN, null=True)
    host = models.URLField(max_length=URL_MAXLEN)   # home host of the author
    profileImage = models.URLField(max_length=URL_MAXLEN)
    url = models.URLField(max_length=URL_MAXLEN)     # url to the author's profile
