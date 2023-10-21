from socialdistribution.models import *


def create_author():
    # TODO: update when author/user implementation is done for better testing
    author_obj = Author.objects.create(
        displayName="test_not_found",
        host="http://example.com",
        profileImage="http://example.com/image.jpg",
        url="http://example.com/profile"
    )

    return author_obj

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
