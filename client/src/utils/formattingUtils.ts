import { Post } from "../interfaces/interfaces";
import { renderVisibility } from "./postUtils";
import { formatDateTime } from "./dateUtils";

export function getFormattedPostSubheader(post: Post): string {
  // some posts don't have their published field, we should handle it
  if (post.published === undefined || post.published === null) {
    return ((post.updatedAt === undefined || post.updatedAt === null) ?
      `${renderVisibility(post)}` :
      `${renderVisibility(post)} • Edited`
    )
  } else {
    return ((post.updatedAt === undefined || post.updatedAt === null) ?
      `${formatDateTime(post.published)} • ${renderVisibility(post)}` :
      `${formatDateTime(post.published)} • ${renderVisibility(post)} • Edited`
    )
  }
}
