export function renderVisibility(post:any) {
    if (post.visibility === "PUBLIC" && post.unlisted === false) {
      return "Public";
    } else if (post.visibility === "PRIVATE") {
      return "Private";
    } else if (post.visibility === "FRIENDS") {
      return "Friends";
    } else if (post.unlisted === true) {
      return "Unlisted";
    }
  }