from django.db.models.signals import post_save
from django.dispatch import receiver
from socialdistribution.models import *

@receiver(post_save, sender=Author)
def create_inbox(sender, instance, created, **kwargs):
    """
    Create an Inbox for every new Author.
    """
    # Django Software Foundation, Using signals, October 23, 2023,
    # https://docs.djangoproject.com/en/4.2/topics/signals/
    # Arafat Olayiwola, Understanding Django signals, October 23, 2023,
    # https://earthly.dev/blog/django-signals/
    if created:
        Inbox.objects.create(author=instance)
