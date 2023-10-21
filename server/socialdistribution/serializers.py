from rest_framework import serializers
from rest_framework.serializers import *
from .models import Author, Post


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "createdAt", "displayName", "github", "host", "profileImage", "url")


class PostSerializer(serializers.ModelSerializer):
    # SerializerMethodField Reference: https://testdriven.io/blog/drf-serializers/
    id = SerializerMethodField("get_id_url")
    author = AuthorSerializer(many=False, read_only=True)
    content = SerializerMethodField("get_content")
    origin = SerializerMethodField("get_origin_url")
    source = SerializerMethodField("get_source_url")
    type = SerializerMethodField("get_type")

    class Meta:
        model = Post
        fields = ("id", "author", "categories", "content", "contentType", "description", "title", "type", "source",
                  "origin", "published", "updatedAt", "visibility", "unlisted")

    def get_id_url(self, obj):
        # id field needs to be a uri of the post
        uri = self.context["request"].build_absolute_uri("/")
        return f"{uri}author/{obj.author.id}/posts/{obj.id}"

    def get_content(self, obj):
        # decode content as it's a binary field
        if obj.contentType == Post.ContentType.PLAIN and obj.content:
            return obj.content.decode("utf-8")

    def get_origin_url(self, obj):
        # if source is given, pass in the origin, otherwise, build it using current request uri
        if obj.origin:
            return obj.origin
        else:
            uri = self.context["request"].build_absolute_uri("/")
            return f"{uri}author/{obj.author.id}/posts/{obj.id}"

    def get_type(self, obj):
        return "post"

    def get_source_url(self, obj):
        # if source is given, pass in the source, otherwise, build it using current request uri
        if obj.source:
            return obj.source
        else:
            uri = self.context["request"].build_absolute_uri("/")
            return f"{uri}author/{obj.author.id}/posts/{obj.id}"
