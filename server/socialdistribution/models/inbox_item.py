from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class InboxItem(models.Model):
    """
    Since an author's inbox can receive different types of items, and hence,
    an item for an inbox is polymorphic, this model is to track different items
    that go through an author's inbox.
    """
    # Django Software Foundation, Using contenttypes to handle polymorphic types, October 23, 2023,
    # https://docs.djangoproject.com/en/4.2/ref/contrib/contenttypes/
    # content_type points to the model of a content_object with an object_id
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.UUIDField(null=True, blank=True)
    content_object = GenericForeignKey("content_type", "object_id")

    # Add a JSON field to store remote data being sent to the inbox
    json_data = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Custom save method to ensure either content_object or json_data is used, not both
        if self.content_object and self.json_data:
            raise ValueError("InboxItem cannot have both a content_object and json_data.")
        super(InboxItem, self).save(*args, **kwargs)
