from django.db import models
from socialdistribution.utils.constants import STRING_MAXLEN


class Category(models.Model):
    """
    Categories for posts
    """
    category = models.CharField(max_length=STRING_MAXLEN)
