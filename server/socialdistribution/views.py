from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from .models import *
from .utils import *


# Create your views here.
class AuthorView(APIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class PostsView(APIView):
    def get(self, request, author_id):
        posts = Post.objects.filter(author__id=author_id)
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, author_id):
        try:
            author = Author.objects.get(id=author_id)
        except Author.DoesNotExist:
            return Response({"error": "Author not found."}, status=status.HTTP_404_NOT_FOUND)

        post_object = create_post(author, request.data)
        serializer = PostSerializer(instance=post_object, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(author=author)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
