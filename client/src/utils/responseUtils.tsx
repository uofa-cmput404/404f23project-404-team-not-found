import { localAuthorHosts } from "../lists/lists";

export function getAuthorIdFromResponse(author_id_url: string): string {
	return author_id_url.split("/").pop() as string
}

export function isHostLocal(host: string): boolean {
  return localAuthorHosts.includes(host);
}