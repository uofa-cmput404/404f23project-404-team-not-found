import { Post } from "../interfaces/interfaces";

export function compareStringArray(a: string[], b: string[]) {
  return (a.length === b.length &&
    a.every((element, index) => element === b[index]));
}

export function isImage(post: Post) {
  return ((post.content.slice(0, 4) === "http" && post.contentType === "text/plain") ||
    post.contentType.includes("base64"))
}

export function isText(post: Post) {
  return (post.content.slice(0, 4) !== "http" &&
    (post.contentType === "text/plain" || post.contentType === "text/markdown"))
}

export function renderVisibility(post: any) {
    if (post.unlisted === true) {
      return "Unlisted";    
    } else if (post.visibility === "PUBLIC") {
      return "Public";
    } else if (post.visibility === "PRIVATE") {
      return "Private";
    } else if (post.visibility === "FRIENDS") {
      return "Friends";
    }
  }