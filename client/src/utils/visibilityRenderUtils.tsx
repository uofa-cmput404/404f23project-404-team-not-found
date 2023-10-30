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