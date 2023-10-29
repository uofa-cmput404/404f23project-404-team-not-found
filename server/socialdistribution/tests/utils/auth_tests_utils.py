import json
import uuid

from django.contrib.contenttypes.models import ContentType

from django.contrib.auth.models import User
from socialdistribution.models import *


def create_auth_user():
    user_data = {
        "username": "test_user",
        "email": "test_user@gmail.com",
        "password": "123456",
    }

    user_obj = User.objects.create_user(username=user_data["username"], 
                                        email=user_data["email"], 
                                        password=user_data["password"])
    
    return user_obj

def create_auth_author(user_obj):
    author_data = {"displayName": "test_author", 
                    "github": "https://placeholder.com", 
                    "host": "https://placeholder.com",
                    "profileImage": "https://placeholder.com",
                    "url": "https://placeholder.com"}



    auth_obj = Author.objects.create(displayName=author_data["displayName"], 
                                    github=author_data["github"],
                                    host=author_data["host"],
                                    profileImage=author_data["profileImage"],
                                    url=author_data["url"],
                                    user=user_obj)

    return auth_obj
