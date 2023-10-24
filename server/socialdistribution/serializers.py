from rest_framework import serializers
from rest_framework.serializers import *
from .models import Author

from .utils import *
import base64


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "createdAt", "displayName", "github", "host", "profileImage", "url")


class PostSerializer(serializers.ModelSerializer):
    # Nik Tomazic, Using SerializerMethodField, Ocotber 20, 2023,
    # https://testdriven.io/blog/drf-serializers/
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
        """id field needs to be a uri of the post"""
        return build_default_post_uri(obj=obj, request=self.context["request"])
 
    def get_content(self, obj):
        """decode content as it's a binary field"""
        if obj.contentType == Post.ContentType.PLAIN and obj.content:
            return obj.content.decode("utf-8")
        elif is_image(obj.contentType) and obj.content:
            base64_encoded = base64.b64encode(obj.content)
            return f"data:{obj.contentType},{base64_encoded.decode('utf-8')}"

    def get_origin_url(self, obj):
        """if source is given, pass in the origin, otherwise, build it using current request uri"""
        return obj.origin if obj.origin else build_default_post_uri(obj=obj, request=self.context["request"])

    def get_type(self, obj):
        return "post"

    def get_source_url(self, obj):
        """if source is given, pass in the source, otherwise, build it using current request uri"""
        return obj.source if obj.source else build_default_post_uri(obj=obj, request=self.context["request"])
