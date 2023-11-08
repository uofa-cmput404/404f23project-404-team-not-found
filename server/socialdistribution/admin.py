from django.contrib import admin
from .models import Author, Follow, Follower, Inbox, Post, Category, Comment

# Register your models here.

admin.site.register(Author)
admin.site.register(Follow)
admin.site.register(Follower)
admin.site.register(Inbox)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Comment)