from django.db import models
from .inbox_item import InboxItem


class Inbox(models.Model):
    """
    The Inbox model is an author's inbox.
    An author can receive different types of items: post, follow, like, comment
    """
    author = models.ForeignKey("Author", on_delete=models.CASCADE)
    items = models.ManyToManyField(InboxItem)
