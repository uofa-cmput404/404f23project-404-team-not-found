CMPUT404-project-socialdistribution
===================================

CMPUT 404 Project: Social Distribution

[Project requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 

Contributors / Licensing
========================
Authors:
* Kaye Ena Crayzhel Misay
* Kaustubh Mukherjee
* Nhat Minh Luu
* Raphael Gutierrez
* Mehsheed Ahmed Syed Abdul

Generally, everything is LICENSE'D under the Apache 2 license by 404_Team_not_found.

User Stories
========================
- [x] As an author I want to make public posts.
- [x] As an author I want to edit public posts.
- [x] As an author, posts I create can link to images.
- [x] As an author, posts I create can be images.
- [x] As a server admin, images can be hosted on my server.
- [x] As an author, posts I create can be private to another author
- [x] As an author, posts I create can be private to my friends
- [x] As an author, I can share other author’s public posts
- [x] As an author, I can re-share other author’s friend posts to my friends
- [x] As an author, posts I make can be in simple plain text
- [x] As an author, posts I make can be in CommonMark
- [x] As an author, I want a consistent identity per server
- [x] As a server admin, I want to host multiple authors on my server
- [x] As a server admin, I want to share public images with users on other servers.
- [x] As an author, I want to pull in my github activity to my “stream”
- [x] As an author, I want to post posts to my “stream”
- [x] As an author, I want to delete my own public posts.
- [x] As an author, I want to befriend local authors
- [x] As an author, I want to befriend remote authors
- [x] As an author, I want to feel safe about sharing images and posts with my friends – images shared to friends should only be visible to friends. [public images are public]
- [x] As an author, when someone sends me a friends only-post I want to see the likes.
- [x] As an author, comments on friend posts are private only to me the original author.
- [x] As an author, I want un-befriend local and remote authors
  - Done for local. Unfollowing Code Monkey's author works.
  - Some teams have implemented their `DELETE` `/followers` request in local-only mode, so we aren't able to "Unfollow" their author.
- [x] As an author, I want to be able to use my web-browser to manage my profile
- [x] As an author, I want to be able to use my web-browser to manage/author my posts
- [x] As a server admin, I want to be able to add, modify, and remove authors.
- [x] As a server admin, I want to OPTIONALLY be able to allow users to sign up but require my OK to finally be on my server
- [x] As a server admin, I don’t want to do heavy setup to get the posts of my author’s friends.
- [x] As a server admin, I want a restful interface for most operations
- [x] As an author, other authors cannot modify my public post
- [x] As an author, other authors cannot modify my shared to friends post.
- [x] As an author, I want to comment on posts that I can access
- [x] As an author, I want to like posts that I can access
- [x] As an author, my server will know about my friends
- [x] As an author, When I befriend someone it follows them, only when the other authors befriends me do I count as a real friend.
- [x] As an author, I want to know if I have friend requests.
- [x] As an author I should be able to browse the public posts of everyone
- [x] As a server admin, I want to be able to add nodes to share with
- [x] As a server admin, I want to be able to remove nodes and stop sharing with them.
- [x] As a server admin, I can limit nodes connecting to me via authentication.
- [x] As a server admin, node to node connections can be authenticated with HTTP Basic Auth
- [x] As a server admin, I can disable the node to node interfaces for connections that are not authenticated!
- [x] As an author, I want to be able to make posts that are unlisted, that are publicly shareable by URI alone (or for embedding images)

Connections
========================
- Code Monkeys
  - website url: https://chimp-chat-1e0cca1cc8ce.herokuapp.com/
  - username: node-404-team-not-found
  - password: chimpchatapi
  - full connection
- Web Wizards
   - website url: https://uofa-cmput404.github.io/404f23project-web-wizards/
   - username: node-404-team-not-found
   - password: socialpassword
   - full connection
   - Note: At the time of writing, Web Wizards doesn't support visibility = "Private".
- Triet
  - website url: https://fakebook-frontend-f922a5dc4574.herokuapp.com/
  - username: 404-not-found
  - password: 1
  - partial connection
  - Note: At the time of writing, Triet's database resets every day, so node and author registrations need to be done manually.
- Net Ninjas
  - website url: https://netninjas-58669f3bc849.herokuapp.com
  - credentials: can create on their own website
  - partial connection
  - Note: At the time of writing, their API is currently returning an OperationalError. Net ninjas mentioned that it's something related to their database.
