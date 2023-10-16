from rest_framework import serializers
from .models import Author, Post


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "createdAt", "displayName", "github", "host", "profileImage", "url")

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("id", "author", "categories", "content", "description", "title", "source",
                  "origin", "published", "updatedAt", "visibility", "unlisted")
