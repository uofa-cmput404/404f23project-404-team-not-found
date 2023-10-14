from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from .models import *


# Create your views here.
class AuthorView(APIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class PostView(APIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
