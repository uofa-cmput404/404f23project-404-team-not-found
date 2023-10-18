from django.urls import path
from .views import *

urlpatterns = [
    path("author/<uuid:author_id>/", AuthorView.as_view(), name="author"),
    path("author/<uuid:author_id>/posts/", PostsView.as_view(), name="posts"),
    path("author/<uuid:author_id>/posts/<uuid:post_id>/", PostView.as_view(), name="single_post"),
]