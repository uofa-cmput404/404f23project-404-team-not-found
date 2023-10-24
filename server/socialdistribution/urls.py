from django.urls import path
from .views import *

urlpatterns = [
    # API endpoints based on the outlined spec for the Distributed Social Networking app:
    # 
    path("author/<uuid:author_id>/", AuthorView.as_view(), name="author"),
    path("author/<uuid:author_id>/posts/", PostsView.as_view(), name="posts"),
    path("author/<uuid:author_id>/posts/<uuid:post_id>/", PostView.as_view(), name="single_post"),
    path("author/<uuid:author_id>/followers/", FollowersView.as_view(), name="followers"),
    path("author/<uuid:author_id>/followers/<uuid:follower_id>/", FollowerView.as_view(), name="follower"),
    path("author/<uuid:author_id>/inbox/", InboxView.as_view(), name="inbox"),

    # login and signup endpoints
    path("login/", LoginView.as_view(), name="login"),
    path("signup/", SignUpView.as_view(), name="signup")
]