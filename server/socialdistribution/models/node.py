from django.db import models
from socialdistribution.utils.constants import STRING_MAXLEN
from django.contrib.auth.models import User


class Node(models.Model):
    """
    A node is an object that represents a team.
    This is used to manage the permissions (is_allowed)
    """

    name = models.CharField(primary_key=True, max_length=STRING_MAXLEN)
    host = models.CharField(max_length=STRING_MAXLEN)
    username = models.CharField(max_length=STRING_MAXLEN)
    password = models.CharField(max_length=STRING_MAXLEN)

    # We set the default of is_allowed to True. Meaning all newly created nodes are allowed to connect.
    is_allowed = models.BooleanField(default=True)
