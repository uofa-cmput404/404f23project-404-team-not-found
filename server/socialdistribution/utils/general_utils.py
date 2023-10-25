from socialdistribution.models.post import Post

def is_image(data):
    return (data == Post.ContentType.JPEG or
          data == Post.ContentType.BASE64 or
          data == Post.ContentType.PNG or
          data == Post.ContentType.WEBP)
