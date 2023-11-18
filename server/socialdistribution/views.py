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
from socialdistribution.utils.views_utils import (
    create_author,
    create_follow,
    create_follower,
    create_inbox_item,
    create_post,
    update_post_categories,
    update_post_content,
    create_comment
)

from urllib.parse import urlparse


class AuthorsView(APIView):
    http_method_names = ["get"]

    def get(self, request):
        """
        retrieve all profiles on the server (paginated)
        TODO: paginate response
        """
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True, context={"request": request})

        return Response(
            data={
                "type": "authors",
                "items": serializer.data
            },
            status=status.HTTP_200_OK)


class AuthorView(APIView):
    http_method_names = ["get", "post"]

    def get(self, request, author_id):
        """
        get the author data whose id is AUTHOR_ID
        """
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(instance=author_object, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, author_id):
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(instance=author_object, data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowersView(APIView):
    http_method_names = ["get"]

    def get(self, request, author_id):
        """
        get a list of authors who are AUTHOR_ID’s followers
        """
        author_object = get_object_or_404(Author, id=author_id)
        followers = Follower.objects.filter(author=author_object)
        return Response(
            data={
                "type": "followers",
                "items": [follower_object.follower_author for follower_object in followers]
            },
            status=status.HTTP_200_OK)


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
        is_follower = (Follower.objects.filter(author=author_object,
                                               follower_author__id__endswith=follower_id)
                       .exists())

        if is_follower:
            return Response(already_followed_error, status=status.HTTP_400_BAD_REQUEST)

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
        """
        post_object = get_object_or_404(Post, id=post_id, author__id=author_id)
        post_object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        # takes care of updating categories
        categories = request.data.get("categories", [])
        if categories:
            update_post_categories(categories, post_object)

        # takes care of updating content
        content = request.data.get("content", "")
        content_type = request.data.get("contentType", "")
        if content and content_type:
            update_post_content(content, content_type, post_object)

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

        if data['type'].lower() == "follow":
            follow_object = create_follow(author_object, data)
            serializer = FollowSerializer(instance=follow_object, data=data, context={"request": request})

            if serializer.is_valid():
                # create follow instance
                follow_instance = serializer.save()

                # Add that follow to the AUTHOR_ID's inbox.
                inbox_object = get_object_or_404(Inbox, author=author_object)
                create_inbox_item(inbox_object, follow_instance)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif data["type"].lower() == "post":
            parsed_url = urlparse(data["id"])
            post_id = parsed_url.path.split('/')[-1]
            post_object = get_object_or_404(Post, id=post_id)
            serializer = PostSerializer(instance=post_object, data=data, context={"request": request})

            if serializer.is_valid():
                inbox_object = get_object_or_404(Inbox, author=author_object)
                create_inbox_item(inbox_object, post_object)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # TODO: HANDLE like, comment

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
            author_data = {
                "displayName": displayName,
                "profileImage": DEFAULT_PIC_LINK,
            }
            user_object = User.objects.create_user(username=username,
                                                   email=email,
                                                   password=password)
            author_object = create_author(author_data, request, user_object)
            author_data["host"] = author_object.host
            author_data["url"] = author_object.url

            serializer = AuthorSerializer(instance=author_object,
                                          data=author_data,
                                          context={"request": request})

            if serializer.is_valid():
                # save update and set updatedAt to current time
                serializer.save(updatedAt=timezone.now())
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentsView(APIView):
    http_method_names = ["get", "post"]

    #TODO: Pagination
    def get(self, request,author_id,post_id):

        post_object = get_object_or_404(Post,id=post_id)
        author_object = get_object_or_404(Author, id=author_id)
        comments = Comment.objects.order_by("-published").filter(post=post_object)
        post_url = build_default_post_uri(obj=post_object, request=request)
        return Response(
            {
                "type": "comments",
                "page": None,
                "size": None,
                "post":post_url,
                "id": request.build_absolute_uri(),
                "comments": CommentSerializer(comments,context={"request": request}, many=True).data,

            }
        )
    
    def post(self, request, author_id, post_id):
        
        post_object = get_object_or_404(Post,id=post_id)
        author_object = get_object_or_404(Author, id=author_id)
        comment_object = create_comment(author_object, post_object, request.data)
        serializer = CommentSerializer(instance=comment_object, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(author=author_object, post=post_object)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
class PostLikesView(APIView):
    http_method_names = ["get"]

    def get(self, request, author_id, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = LikeSerializer(
            Like.objects.filter(post=post, comment=None),context={"request": request}, many=True)
        return  Response( serializer.data, status=status.HTTP_200_OK)
    
class CommentLikesView(APIView):
    http_method_names = ["get"]

    def get(self, request, author_id, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = LikeSerializer(
            Like.objects.filter(comment=comment),context={"request": request}, many=True)
        return  Response( serializer.data, status=status.HTTP_200_OK)

class LikedView(APIView):
    http_method_names = ["get"]

    def get(self, request, author_id):
        """
        get a list of posts that AUTHOR_ID likes
        """
        author_object = get_object_or_404(Author, id=author_id)
        likes = Like.objects.filter(author=author_object)
        return Response(
            {
                "type": "liked",
                "items": LikeSerializer(
                likes,
                context= {"request": request},
                many=True,
                ).data

                
            }
            
        )



