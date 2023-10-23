
def build_default_post_uri(obj, request):
    uri = request.build_absolute_uri("/")
    return f"{uri}author/{obj.author.id}/posts/{obj.id}"
