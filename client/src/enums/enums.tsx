export enum ContentType {
    BASE64 = "application/base64",
    JPEG = "image/jpeg;base64",
    MARKDOWN = "text/markdown",
    PLAIN = "text/plain",
    PNG = "image/png;base64",
}

export enum Links {
  LIKECONTEXT = "https://www.w3.org/ns/activitystreams",
}

export enum ImageLink {
    DEFAULT_PROFILE_PIC = "https://i.imgur.com/DKrKvCI.jpg"
}

export enum InboxItemType {
    COMMENT = "comment",
    FOLLOW = "Follow",
    LIKE = "Like",
    POST = "post",
}

export enum ShareType {
    FRIENDS = "FRIENDS",
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    UNLISTED = "UNLISTED",
}

export enum ToastMessages {
  NOUSERCREDS = "Unable to make a post. Please sign out and log back in.",
}

export enum Username {
  NOTFOUND = "node-404-team-not-found",
}

export enum Hosts {
  CODEMONKEYS = "https://chimp-chat-1e0cca1cc8ce.herokuapp.com/",
  NETNINJAS = "https://netninjas-backend-181348e5439b.herokuapp.com/",
  NETNINJASAPI = "https://netninjas-backend-181348e5439b.herokuapp.com/api/",
  NOTFOUND = "https://distributed-network-37d054f03cf4.herokuapp.com/",
  NOTFOUNDAPINOSLASH = "https://distributed-network-37d054f03cf4.herokuapp.com/api",
  TRIET = "https://social-distribution-backend-f20f02be801f.herokuapp.com/service",
  WEBWIZARDS = "https://webwizards-backend-952a98ea6ec2.herokuapp.com/service/",
}

export enum ApiPaths {
  AUTHOR = "author",
  AUTHORS = "authors",
  COMMENT = "comment",
  COMMENTLIKES = "comment_likes",
  COMMENTS = "comments",
  FOLLOWER = "follower",
  FOLLOWERS = "followers",
  IMAGE = "image",
  INBOX = "inbox",
  POST = "post",
  POSTLIKES = "post_likes",
  POSTS = "posts",
}
