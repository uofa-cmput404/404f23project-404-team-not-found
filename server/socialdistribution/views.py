from django.shortcuts import render, get_object_or_404
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
        # get_object_or_404 is a django shortcut
        # Reference: https://docs.djangoproject.com/en/4.2/topics/http/shortcuts/#get-object-or-404
        author_obj = get_object_or_404(Author, id=author_id)
        post_object = create_post(author_obj, request.data)
        serializer = PostSerializer(instance=post_object, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(author=author_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
