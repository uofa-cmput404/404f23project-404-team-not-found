from django.db import models


class Follower(models.Model):
    """
    The Follower model consists of an author and a follower author.
    """
    class Meta:
        # Django Software Foundation, UniqueConstraint, October 23, 2023,
        # https://docs.djangoproject.com/en/4.2/ref/models/constraints/#uniqueconstraint
        constraints = [
            # follower_author can only follow author once
            models.UniqueConstraint(fields=["author", "follower_author"], name="unique_follower"),
        ]

    author = models.ForeignKey("Author", on_delete=models.CASCADE)
    follower_author = models.JSONField()
