from django.urls import path
from .views import *
from .utils import SERVICE

urlpatterns = [
    # API endpoints based on the outlined spec for the Distributed Social Networking app:
    # https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org
    path(f"{SERVICE}author/<uuid:author_id>/", AuthorView.as_view(), name="author"),
    path(f"{SERVICE}author/<uuid:author_id>/posts/", PostsView.as_view(), name="posts"),
    path(
        f"{SERVICE}author/<uuid:author_id>/posts/<uuid:post_id>/",
        PostView.as_view(),
        name="single_post",
    ),
    path(
        f"{SERVICE}author/<uuid:author_id>/followers/",
        FollowersView.as_view(),
        name="followers",
    ),
    path(
        f"{SERVICE}author/<uuid:author_id>/followers/<uuid:follower_id>/",
        FollowerView.as_view(),
        name="follower",
    ),
    path(f"{SERVICE}author/<uuid:author_id>/inbox/", InboxView.as_view(), name="inbox"),
    path(
        f"{SERVICE}author/<uuid:author_id>/posts/<uuid:post_id>/comments/",
        CommentView.as_view(),
        name="comments",
    ),
    # login and signup endpoints
    path(f"{SERVICE}login/", LoginView.as_view(), name="login"),
    path(f"{SERVICE}signup/", SignUpView.as_view(), name="signup"),
]
