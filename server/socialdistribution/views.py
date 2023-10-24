from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token 
from django.contrib.auth.models import User


from .serializers import *
from .models import *
from .utils import *


class AuthorView(APIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get(self, request, author_id):
        # get the author data whose id is AUTHOR_ID
        author = Author.objects.get(id=author_id)
        serializer = AuthorSerializer(author)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostsView(APIView):
    # Django Software Foundation, Allowing HTTP request, October 20, 2023,
    # https://docs.djangoproject.com/en/4.2/ref/class-based-views/base/#django.views.generic.base.View.http_method_names
    http_method_names = ["get", "post"]

    def get(self, request, author_id):
        """
        get the recent posts from author AUTHOR_ID
        TODO: paginate
        """
        posts = Post.objects.filter(author__id=author_id).order_by("-published")
        serializer = PostSerializer(posts, many=True, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, author_id):
        """
        create a new post but generate a new id
        """
        # Django Software Foundation, get_object_or_404 is a Django shortcut, October 20, 2023,
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


class LoginView(APIView):
    http_method_names = ["post"]

    def post(self, request):
        username = request.POST["username"]
        password = request.POST["password"]

        try:
            user = User.objects.get(username=username)
            success = user.check_password(password)

            # on success login check
            if success:
                # create token 
                token, created = Token.objects.get_or_create(user=user)
                matching_author = Author.objects.get(user=user)

                data = {"token": token.key, "author_id": matching_author.id}
                return Response(data, status=status.HTTP_201_CREATED)
            # on wrong password
            else:
                data = {"message": "Wrong password"}
                return Response(data, status=status.HTTP_401_UNAUTHORIZED)


        except User.DoesNotExist:
            data = {"message": "User not found"}
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        
class SignUpView(APIView):
    http_method_names = ["post"]

    def post(self, request):
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        displayName = request.POST["displayName"]


        try:
            # check if the User with given username already exists
            user = User.objects.get(username=username)
            data = {"message": "Username already exists"}
            return Response(data, status=status.HTTP_409_CONFLICT)
        except:
            # TODO: This one is currently a placeholder
            author_data = {"displayName": displayName, 
                            "github": "https://placeholder.com", 
                            "host": "https://placeholder.com",
                            "profileImage": "https://placeholder.com",
                            "url": "https://placeholder.com"}


            post_object = Author.objects.create(displayName=author_data["displayName"], 
                                                github=author_data["github"],
                                                host=author_data["host"],
                                                profileImage=author_data["profileImage"],
                                                url=author_data["url"],
                                                user=User.objects.create_user(username=username, 
                                                                            email=email, 
                                                                            password=password))
    
            serializer = AuthorSerializer(instance=post_object, 
                                        data=author_data, 
                                        context={"request": request})

            if serializer.is_valid():
                # save update and set updatedAt to current time
                serializer.save(updatedAt=timezone.now())
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
