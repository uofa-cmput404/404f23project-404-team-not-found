from django.db import models


class Follow(models.Model):
    """
    The Follow handles the follow/friend requests of a given author (requestor)
    to another author (recipient).
    """
    recipient = models.ForeignKey("Author", on_delete=models.CASCADE)
    requestor = models.JSONField()
