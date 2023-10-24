import json
import uuid

from django.contrib.contenttypes.models import ContentType

from socialdistribution.models import *


def create_author():
    # TODO: update when author/user implementation is done for better testing
    author_obj = Author.objects.create(
        displayName="test_not_found",
        host="http://testserver/",
        profileImage="http://example.com/image.jpg",
        url="http://testserver/profile"
    )

    return author_obj


def create_author_dict(author_id):
    author_dict = {
        "type": "author",
        "id": f"http://127.0.0.1:5454/authors/{author_id}",
        "url": f"http://127.0.0.1:5454/authors/{author_id}",
        "host": "http://127.0.0.1:5454/",
        "displayName": "test_not_found",
        "github": "http://github.com/gjohnson",
        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
    }

    return author_dict


def create_follow(author, actor):
    follow_object = Follow.objects.create(
        id=uuid.uuid4(),
        object=author,
        actor=actor
    )

    return follow_object


def create_follow_inbox_item(follow_object, inbox_object):
    content_type = ContentType.objects.get_for_model(follow_object)
    inbox_item_object = InboxItem.objects.create(content_type=content_type,
                                                 object_id=follow_object.id,
                                                 content_object=follow_object)
    inbox_object.items.add(inbox_item_object)

    print(inbox_item_object)
    return inbox_item_object


def create_follower(author, follower_author):
    follower_obj = Follower.objects.create(
        author=author,
        follower_author=follower_author
    )

    return follower_obj


def create_plain_text_post(author):
    post_obj = Post.objects.create(
        author=author,
        title="Test Post",
        description="This is a test post.",
        contentType=Post.ContentType.PLAIN,
        content="This is test content.".encode("utf-8"),
        visibility=Post.Visibility.PUBLIC
    )

    return post_obj


def deserialize_response(response):
    return json.loads(response.content.decode('utf-8').replace("'", "\""))
