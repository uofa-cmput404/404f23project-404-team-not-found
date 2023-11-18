import uuid
import base64

from django.contrib.contenttypes.models import ContentType

from socialdistribution.models import (
    Post,
    Follow,
    Follower,
    Category,
    Author,
    Comment,
    InboxItem,
    Like
)

from .general_utils import *
from .serializers_utils import build_default_author_uri


def create_author(author_data, request, user_object):
    host = f"{request.build_absolute_uri('/')}"

    author = Author.objects.create(
        displayName=author_data["displayName"],
        host=host,
        profileImage=author_data["profileImage"],
        user=user_object,
    )

    author.url = build_default_author_uri(obj=author, request=request, source="author")

    return author


def create_follow(author, data):
    follow = Follow.objects.create(
        id=uuid.uuid4(),
        object=author,
        actor=data["actor"]
    )

    return follow


def create_follower(recipient, data):
    follower = Follower.objects.create(
        author=recipient,
        follower_author=data["actor"]
    )

    return follower


def create_inbox_item(inbox, content):
    content_type = ContentType.objects.get_for_model(content)
    inbox_item_object = InboxItem.objects.create(content_type=content_type,
                                                 object_id=content.id,
                                                 content_object=content)
    inbox.items.add(inbox_item_object)


def create_like(author, post, comment):
    like = Like.objects.create(
        author=author,
        post=post
    )

    if comment:
        like.comment = comment

    return like

def create_post(author, data, post_id=None):
    """
    Creating a post given an author and its data.
    ID can be randomly generated or given.
    """
    if not post_id:
        post_id = uuid.uuid4()

    # still have to handle categories
    post = Post.objects.create(
        id=post_id,
        author=author,
        contentType=data["contentType"],
        description=data["description"],
        title=data["title"],
        unlisted=data["unlisted"],
        visibility=data["visibility"]
    )
    if "source" and "origin" in data:
        post.source = data["source"]
        post.origin = data["origin"]

    categories = data.get("categories", [])

    for category in categories:
        category_object, created = Category.objects.get_or_create(category=category)
        post.categories.add(category_object)

    # creating a binary-suitable object for content field
    update_post_content(data["content"], data["contentType"], post)

    return post


def update_post_content(content, content_type, post_object):
    """
    creating a binary-suitable object for content field
    """
    if is_text(content_type):
        post_object.content = content.encode("utf-8")
    elif is_image(content_type):
        base64_content = content.split("base64,")[1]
        post_object.content = base64.b64decode(base64_content)


def update_post_categories(categories, post_object):
    current_categories = set(post_object.categories.values_list('category', flat=True))
    updated_categories = set(categories)

    # Add new categories
    for category in updated_categories - current_categories:
        category_object, created = Category.objects.get_or_create(category=category)
        post_object.categories.add(category_object)

    # Remove categories that aren't in the updated list
    for category in current_categories - updated_categories:
        category_object = Category.objects.get(category=category)
        post_object.categories.remove(category_object)


def create_comment(author,post, data, comment_id=None):
    """
    Creating a comment given an author and its data.
    ID can be randomly generated or given.
    """
    if not comment_id:
        comment_id = uuid.uuid4()

    comment_obj = Comment.objects.create(
        id=comment_id,
        author=author,
        post= post,
        comment=data["comment"],
        contentType=data["contentType"],
        
    )

    return comment_obj
