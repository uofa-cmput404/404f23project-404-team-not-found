export function extractEndpointSegmentFromCommentId(url: string): string {
  const parts: string[] = url.split("/");
  const startIndex: number = parts.indexOf("authors") + 1;

  if (startIndex === 0) {
    throw new Error("Required segments not found in the URL");
  }

  const extractedParts: string[] = parts.slice(startIndex);
  return extractedParts.join("/");
}