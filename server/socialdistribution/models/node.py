import uuid

from django.db import models
from socialdistribution.utils.constants import STRING_MAXLEN, URL_MAXLEN
from django.contrib.auth.models import User


class Node(models.Model):
    """
    A node is an object that represents a team.
    This is used to manage the permissions.
    """

    # - Node model: name, host, username, password, is_allow(default=true). name primary key

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=STRING_MAXLEN)
    host = models.CharField(max_length=STRING_MAXLEN)
    username = models.CharField(max_length=STRING_MAXLEN)
    password = models.CharField(max_length=STRING_MAXLEN)

    # We set the default of is_allowed to True. Meaning all newly created nodes are allowed to connect.
    is_allowed = models.BooleanField(default=True)
