import uuid
import base64

from socialdistribution.models.post import Post
from socialdistribution.models.follow import Follow
from socialdistribution.models.follower import Follower

from .general_utils import *


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

    # creating a binary-suitable object for content field
    if is_text(data["contentType"]):
        post.content = data["content"].encode("utf-8")
    elif is_image(data["contentType"]):
        base64_content = data["content"].split("base64,")[1]
        post.content = base64.b64decode(base64_content)

    return post
