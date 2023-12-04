import { localAuthorHosts, webWizardsNoSlashApiPath } from "../lists/lists";
import { ContentType, Hosts } from "../enums/enums";
import { Post } from "../interfaces/interfaces";
import { codes } from "../objects/objects";

export function configureImageEncoding(post: Post): string {
  // different context for image base64, so we have to adapt the encoding to show images
  if (isHostCodeMonkeys(post.author.host)) {
    return `data:${post.contentType},${post.content}`;
  } else {
    return post.content;
  }
}

export function getAuthorIdFromResponse(author_id_url: string): string {
	return author_id_url.split("/").pop() as string
}

export function getCodeFromObjectId(objectIdUrl: string): string {
  for (let key in codes) {
    if (objectIdUrl.includes(key)) {
      return codes[key];
    }
  }

  return "";
}

export function isApiPathNoSlash(url: string, path: string): boolean {
  return url.includes(Hosts.TRIET) ||
    (url.includes(Hosts.WEBWIZARDS) && webWizardsNoSlashApiPath.includes(path))
}

export function isHostLocal(host: string): boolean {
  return localAuthorHosts.includes(host);
}

export function isHostCodeMonkeys(host: string): boolean {
  return host === Hosts.CODEMONKEYS;
}

export function isPostImage(post: Post): boolean {
  if (post.author.host === Hosts.WEBWIZARDS) {
    return post.content_type!.includes("base64");
  } else if (post.contentType === undefined) {
    return false;
  } else {
      return post.contentType.includes("base64") || post.content.includes("base64");
  }
}

export function isPostMarkdown(post: Post): boolean {
  if (post.author.host === Hosts.WEBWIZARDS) {
    return post.content_type === ContentType.MARKDOWN;
  } else {
      return post.contentType === ContentType.MARKDOWN;
  }
}

export function isPostPlainText(post: Post): boolean {
  if (post.author.host === Hosts.WEBWIZARDS) {
    return post.content_type === ContentType.PLAIN;
  } else {
      return post.contentType === ContentType.PLAIN;
  }
}

export function isUrlIdLocal(objectUrlId: string): boolean {
  return localAuthorHosts.some((host: string) => objectUrlId.includes(host));
}
