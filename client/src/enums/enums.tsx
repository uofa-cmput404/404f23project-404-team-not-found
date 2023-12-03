export enum ContentType {
    BASE64 = "application/base64",
    JPEG = "image/jpeg;base64",
    MARKDOWN = "text/markdown",
    PLAIN = "text/plain",
    PNG = "image/png;base64",
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
  NOTFOUND = "https://distributed-network-37d054f03cf4.herokuapp.com/",
  WEBWIZARDS = "https://webwizards-backend-952a98ea6ec2.herokuapp.com/service/",
}
