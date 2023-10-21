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
    # add allowed HTTP requests
    # Reference: https://docs.djangoproject.com/en/4.2/ref/class-based-views/base/#django.views.generic.base.View.http_method_names
    http_method_names = ["get", "post"]

    def get(self, request, author_id):
        """
        get the recent posts from author AUTHOR_ID
        TODO: paginate
        """
        posts = Post.objects.filter(author__id=author_id)
        serializer = PostSerializer(posts, many=True, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, author_id):
        """
        create a new post but generate a new id
        """
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
    http_method_names = ["delete", "get", "post", "put"]

    def delete(self, request, author_id, post_id):
        """
        remove the post whose id is POST_ID
        TODO: not doing as it's another user story
        """
        pass

    def get(self, request, author_id, post_id):
        """
        get the public post whose id is POST_ID
        """
        post_object = get_object_or_404(Post, id=post_id, author__id=author_id)
        serializer = PostSerializer(post_object, context={"request": request})

        return Response(serializer.data)

    def post(self, request, author_id, post_id):
        """
        update the post whose id is POST_ID (must be authenticated)
        TODO: update this when authentication is implemented
        """
        post_object = get_object_or_404(Post, id=post_id, author__id=author_id)
        serializer = PostSerializer(instance=post_object, data=request.data, context={"request": request})

        if serializer.is_valid():
            # save update and set updatedAt to current time
            serializer.save(updatedAt=timezone.now())
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, author_id, post_id):
        """
        create a post where its id is POST_ID
        """
        author_obj = get_object_or_404(Author, id=author_id)
        post_object = create_post(author_obj, request.data, post_id)
        serializer = PostSerializer(instance=post_object, data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save(author=author_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
