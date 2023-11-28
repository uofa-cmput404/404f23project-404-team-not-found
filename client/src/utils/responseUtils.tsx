import { localAuthorHosts } from "../lists/lists";
import { Hosts } from "../enums/enums";
import { Post } from "../interfaces/interfaces";

export function getAuthorIdFromResponse(author_id_url: string): string {
	return author_id_url.split("/").pop() as string
}

export function isHostLocal(host: string): boolean {
  return localAuthorHosts.includes(host);
}


export function isHostCodeMonkeys(host: string): boolean {
  return host === Hosts.CODEMONKEYS;
}

export function configureImageEncoding(post: Post): string {
  // different context for image base64, so we have to adapt the encoding to show images
  if (isHostCodeMonkeys(post.author.host)) {
    return `data:${post.contentType},${post.content}`;
  } else {
    return post.content;
  }
}