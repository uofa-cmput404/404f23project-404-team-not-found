from django.urls import path
from .views import *
from .utils import SERVICE

urlpatterns = [
    # API endpoints based on the outlined spec for the Distributed Social Networking app:
    # https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org
    path(f"{SERVICE}authors/", AuthorsView.as_view(), name="authors"),
    path(f"{SERVICE}authors/<uuid:author_id>/", AuthorView.as_view(), name="author"),
    path(f"{SERVICE}authors/<uuid:author_id>/posts/", PostsView.as_view(), name="posts"),
    path(f"{SERVICE}authors/<uuid:author_id>/posts/<uuid:post_id>/", PostView.as_view(), name="single_post"),
    path(f"{SERVICE}authors/<uuid:author_id>/posts/<uuid:post_id>/image/", ImagePostView.as_view(), name="image_post"),
    path(f"{SERVICE}authors/<uuid:author_id>/followers/", FollowersView.as_view(), name="followers"),
    path(f"{SERVICE}authors/<uuid:author_id>/followers/<uuid:follower_id>/", FollowerView.as_view(), name="follower"),
    path(f"{SERVICE}authors/<uuid:author_id>/inbox/", InboxView.as_view(), name="inbox"),
    path(f"{SERVICE}authors/<uuid:author_id>/posts/<uuid:post_id>/comments/", CommentsView.as_view(), name="comments"),
    path (f"{SERVICE}authors/<uuid:author_id>/posts/<uuid:post_id>/likes/", PostLikesView.as_view(), name="post_likes"),
    path (f"{SERVICE}authors/<uuid:author_id>/posts/<uuid:post_id>/comments/<uuid:comment_id>/likes/", CommentLikesView.as_view(), name="comment_likes"),
    path (f"{SERVICE}authors/<uuid:author_id>/liked/", LikedView.as_view(), name="liked"),

    # additional API endpoints
    path(f"{SERVICE}authors/<uuid:author_id>/follows/<uuid:requester_id>/", FollowView.as_view(), name="follow"),
    # adding this because one of the teams doesn't use uuid, so we have to receive str
    path(f"{SERVICE}authors/<uuid:author_id>/followers/<str:follower_id>/", FollowerView.as_view(), name="follower_id"),

    # login and signup endpoints
    path(f"{SERVICE}login/", LoginView.as_view(), name="login"),
    path(f"{SERVICE}signup/", SignUpView.as_view(), name="signup")
]
