CMPUT404-project-socialdistribution
===================================

CMPUT 404 Project: Social Distribution

[Project requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 

## Distributed
- Come check out our [website application](https://distributed-network-37d054f03cf4.herokuapp.com/)!
- Come check out our [server admin page](https://distributed-network-37d054f03cf4.herokuapp.com/admin/)!
- Get access to our [API](https://distributed-network-37d054f03cf4.herokuapp.com/api/)
- [API Documentation](https://documenter.getpostman.com/view/29719988/2s9Ye8hFfD) in Postman

Contributors / Licensing
========================

## Contributors
<table style="height:500px;">
  <tr>
    <td><a href="https://github.com/kaynzhel"/><img src="https://github.com/kaynzhel.png" width="200"></td>
    <td><a href="https://github.com/Boredalien248"/><img src="https://github.com/Boredalien248.png" width="200"></td>
    <td><a href="https://github.com/nluu175"/><img src="https://github.com/nluu175.png" width="200"></td>
    <td><a href="https://github.com/rmgutierrez"/><img src="https://github.com/rmgutierrez.png" width="200"></td>
    <td><a href="https://github.com/mehsheed"/><img src="https://github.com/mehsheed.png" width="200"></td>
  </tr>
  <tr>
    <td>Kaye Ena Crayzhel Misay</td>
    <td>Kaustubh Mukherjee</td>
    <td>Nhat Minh Luu</td>
    <td>Raphael Gutierrez</td>
    <td>Mehsheed Ahmed Syed Abdul</td>
  </tr>
</table>

## Licensing
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
  - Done for local. Unfollowing Code Monkeys' authors and Net Ninjas' authors works.
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
- Credentials to use our application
  - username: project_test
  - password: password
- Credentials to use our admin page
  - username: not_found
  - password: not_found
- Code Monkeys
  - website URL: https://chimp-chat-1e0cca1cc8ce.herokuapp.com/
  - username: node-404-team-not-found
  - password: chimpchatapi
  - full connection
- Net Ninjas
  - website URL: https://netninjas-58669f3bc849.herokuapp.com
  - username: 404-team-not-found
  - password: 404-team-not-found
  - full connection
- Web Wizards
   - website URL: https://uofa-cmput404.github.io/404f23project-web-wizards/
   - username: node-404-team-not-found
   - password: socialpassword
   - (almost) full connection, given Web Wizards' API state
   - **Notes**:
     - At the time of writing, Web Wizards doesn't support visibility = "Private". However, we handle sending a private post to them, in case it changes.
     - They implemented their `DELETE` `/followers` request in local-only mode, so we aren't able to "Unfollow" their authors.
- Triet
  - website URL: https://fakebook-frontend-f922a5dc4574.herokuapp.com/
  - username: node-404-team-not-found (or if it doesn't work, try 404-not-found)
  - password: 1
  - partial connection
    - Can view their authors, public posts, and followers
    - Can follow their authors and accept their follows
    - Can fetch comments, however Triet implemented some comments restrictions where the comment and post authors are the only ones who can see their comments.
