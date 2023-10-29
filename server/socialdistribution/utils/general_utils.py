from socialdistribution.models.post import Post


def is_image(data):
    return (data == Post.ContentType.JPEG or
          data == Post.ContentType.BASE64 or
          data == Post.ContentType.PNG or
          data == Post.ContentType.WEBP)


def is_text(contentType):
    return (contentType == Post.ContentType.PLAIN or
            contentType == Post.ContentType.MARKDOWN)
