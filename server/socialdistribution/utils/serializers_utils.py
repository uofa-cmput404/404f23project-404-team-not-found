from .constants import SERVICE


def build_default_author_uri(obj, request, source):
    uri = request.build_absolute_uri("/")
    author_id = obj.id if source == "author" else obj.author.id
    return f"{uri}{SERVICE}author/{author_id}"


def build_default_post_uri(obj, request):
    uri = request.build_absolute_uri("/")
    return f"{uri}{SERVICE}author/{obj.author.id}/posts/{obj.id}"


def build_default_comment_uri(obj, request):
    uri = request.build_absolute_uri("/")
    return f"{uri}{SERVICE}author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.id}"