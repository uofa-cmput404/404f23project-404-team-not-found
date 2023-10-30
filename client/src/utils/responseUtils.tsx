export function getAuthorIdFromResponse(author_id_url: string): string {
	return author_id_url.split("/").pop() as string
}