"""
Module for all models in the app
"""

# Django Software Foundation, "Organizing models in a package", October 15, 2023
# https://docs.djangoproject.com/en/4.2/topics/db/models/#organizing-models-in-a-package

from .author import Author
from .category import Category
from .follow import Follow
from .follower import Follower
from .inbox import Inbox
from .inbox_item import InboxItem
from .post import Post
from .comment import Comment
