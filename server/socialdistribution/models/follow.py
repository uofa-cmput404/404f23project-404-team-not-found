import uuid

from django.db import models


class Follow(models.Model):
    """
    The Follow handles the follow/friend requests of a given author (actor)
    to another author (object).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    object = models.ForeignKey("Author", on_delete=models.CASCADE)
    actor = models.JSONField()
