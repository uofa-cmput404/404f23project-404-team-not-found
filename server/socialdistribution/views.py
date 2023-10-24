import json

from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token 
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType

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


class FollowersView(APIView):
    http_method_names = ["get"]

    def get(self, request, author_id):
        """
        get a list of authors who are AUTHOR_ID’s followers
        """
        author_object = get_object_or_404(Author, id=author_id)
        followers = Follower.objects.filter(author=author_object)

        return Response({
            "type": "followers",
            "items": [json.loads(follower_object.follower_author) for follower_object in followers]
        })


class FollowerView(APIView):
    http_method_names = ["delete", "get", "put"]

    def delete(self, request, author_id, follower_id):
        """
        remove FOLLOWER_ID as a follower of AUTHOR_ID
        """
        author_object = get_object_or_404(Author, id=author_id)
        follower_object = get_object_or_404(Follower,
                                            author=author_object,
                                            follower_author__id__endswith=follower_id)
        follower_object.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, author_id, follower_id):
        """
        check if FOLLOWER_ID is a follower of AUTHOR_ID
        """
        author_object = get_object_or_404(Author, id=author_id)
        is_follower = (Follower.objects.filter(author=author_object,
                                               follower_author__id__endswith=follower_id)
                       .exists())

        return Response({"is_follower": is_follower}, status=status.HTTP_200_OK)

    def put(self, request, author_id, follower_id):
        """
        Add FOLLOWER_ID as a follower of AUTHOR_ID
        TODO: must be authenticated
        """
        author_object = get_object_or_404(Author, id=author_id)
        follower_object = create_follower(author_object, request.data)
        serializer = FollowerSerializer(instance=follower_object, data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class InboxView(APIView):
    http_method_names = ["delete", "get", "post"]
    queryset = InboxItem.objects.all()
    serializer_class = InboxItemSerializer

    def delete(self, request, author_id):
        """
        clear the inbox
        """
        author_object = get_object_or_404(Author, id=author_id)
        inbox_object = get_object_or_404(Inbox, author=author_object)
        inbox_object.items.clear()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, author_id):
        """
        If authenticated get a list of posts sent to AUTHOR_ID
        TODO: add authentication_classes and permission_classes
        TODO: paginate
        """
        author_object = get_object_or_404(Author, id=author_id)
        inbox_object = get_object_or_404(Inbox, author=author_object)
        serializer = InboxSerializer(instance=inbox_object, context={"request": request})

        return Response(serializer.data)

    def post(self, request, author_id):
        """
        send a post to the author
        if the type is “post” then add that post to AUTHOR_ID’s inbox
        if the type is “Follow” then add that follow is added to AUTHOR_ID’s inbox to approve later
        if the type is “Like” then add that like to AUTHOR_ID’s inbox
        if the type is “comment” then add that comment to AUTHOR_ID’s inbox
        """
        author_object = get_object_or_404(Author, id=author_id)
        data = request.data

        if "type" not in data:
            return Response(missing_type_in_inbox_post_error, status=status.HTTP_400_BAD_REQUEST)

        if data['type'] == "Follow":
            follow_object = create_follow(author_object, request.data)
            serializer = FollowSerializer(instance=follow_object, data=data)

            if serializer.is_valid():
                # create follow instance
                follow_instance = serializer.save()

                # Add that follow to the AUTHOR_ID's inbox.
                author_object = get_object_or_404(Author, id=author_id)
                inbox_object = get_object_or_404(Inbox, author=author_object)
                content_type = ContentType.objects.get_for_model(follow_instance)
                inbox_item_object = InboxItem.objects.create(content_type=content_type,
                                                             object_id=follow_instance.id,
                                                             content_object=follow_instance)
                inbox_object.items.add(inbox_item_object)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # TODO: HANDLE post, like, comment

        return Response({'detail': 'Invalid type or unhandled type in request.'}, status=status.HTTP_400_BAD_REQUEST)


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
