from rest_framework import serializers
from rest_framework.serializers import *

import base64

from .models import *
from .utils import build_default_author_uri, build_default_post_uri, is_image


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "createdAt", "displayName", "github", "host", "profileImage", "url")


class FollowSerializer(serializers.ModelSerializer):
    actor = serializers.JSONField()  # requestor
    object = AuthorSerializer(many=False, read_only=True)  # recipient
    summary = SerializerMethodField("get_summary")
    type = SerializerMethodField("get_type")

    class Meta:
        model = Follow
        fields = ("type", "summary", "actor", "object")

    def get_summary(self, obj):
        actor_display_name = obj.actor["displayName"]
        return f"{actor_display_name} wants to follow {obj.object.displayName}"

    def get_type(self, obj):
        return "Follow"


class FollowerSerializer(serializers.ModelSerializer):
    object = SerializerMethodField("get_object")
    actor = serializers.JSONField()  # requestor
    type = SerializerMethodField("get_type")

    class Meta:
        model = Follower
        fields = ("type", "actor", "object")

    def get_object(self, obj):
        return AuthorSerializer(obj.author).data

    def get_type(self, obj):
        return "follower"


class PostSerializer(serializers.ModelSerializer):
    # Nik Tomazic, Using SerializerMethodField, October 20, 2023,
    # https://testdriven.io/blog/drf-serializers/
    id = SerializerMethodField("get_id_url")
    author = AuthorSerializer(many=False, read_only=True)
    # Christie Ziegler, Using SlugRelatedField, October 26, 2023,
    # https://medium.com/@chriziegler/slugrelatedfield-with-django-and-the-rest-framework-36717b07a197
    categories = serializers.SlugRelatedField(many=True, queryset=Category.objects.all(), slug_field='category')
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


class InboxItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InboxItem

    # Michael Van De Waeter, handling polymorhic types, October 23, 2023
    # https://stackoverflow.com/questions/19976202/django-rest-framework-django-polymorphic-modelserialization
    def to_representation(self, obj):
        if isinstance(obj.content_object, Follow):
            return FollowSerializer(obj.content_object).data
        elif isinstance(obj.content_object, Post):
            return PostSerializer(obj.content_object).data
        # TODO: later on, handle serializing likes and comments in inbox


class InboxSerializer(serializers.ModelSerializer):
    author = SerializerMethodField("get_author_url")
    items = SerializerMethodField("get_items")
    type = SerializerMethodField("get_type")

    class Meta:
        model = Inbox
        fields = ("type", "author", "items")

    def get_author_url(self, obj):
        return build_default_author_uri(obj=obj, request=self.context["request"])

    def get_items(self, obj):
        return InboxItemSerializer(obj.items.all(), many=True, context=self.context).data

    def get_type(self, obj):
        return "inbox"
