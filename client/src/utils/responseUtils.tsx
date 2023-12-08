import { localAuthorHosts, trietNoSlashApiPath, webWizardsNoSlashApiPath } from "../lists/lists";
import { ContentType, Hosts } from "../enums/enums";
import { Post } from "../interfaces/interfaces";
import { codes } from "../objects/objects";

export function configureImageEncoding(post: Post): string {
  // different context for image base64, so we have to adapt the encoding to show images
  if (post.author.host === Hosts.CODEMONKEYS ||
    post.author.host === Hosts.WEBWIZARDS) {
    return `data:${post.contentType},${post.content}`;
  } else {
    return post.content;
  }
}

// TODO: this should be named getIdFromIdUrl
export function getAuthorIdFromResponse(author_id_url: string): string {
	return author_id_url.split("/").pop() as string
}

export function getAuthorUrlFromIdUrl(url: string): string {
  const parts: string[] = url.split("/");
  const authorsIndex = parts.indexOf("authors");
  const extractedParts = parts.slice(0, authorsIndex + 2);

  return extractedParts.join("/");
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
  return (url.includes(Hosts.TRIET) && trietNoSlashApiPath.includes(path)) ||
    (url.includes(Hosts.WEBWIZARDS) && webWizardsNoSlashApiPath.includes(path))
}

export function isHostLocal(host: string): boolean {
  return localAuthorHosts.includes(host);
}

export function isObjectFromTriet(objectUrlId: string): boolean {
  return objectUrlId.includes(Hosts.TRIET);
}

export function isPostImage(post: Post): boolean {
  if (post.author.host === Hosts.WEBWIZARDS) {
    return post.content_type?.includes("base64") || post.contentType?.includes("base64");
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
