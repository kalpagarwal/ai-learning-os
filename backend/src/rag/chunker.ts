/**
 * Chunking is the bridge between raw documents and retrieval quality.
 * We keep it simple and explicit: split by paragraph blocks with overlap.
 */
export function chunkText(
  text: string,
  options: { maxChars?: number; overlapChars?: number } = {}
): string[] {
  const maxChars = options.maxChars ?? 900;
  const overlapChars = options.overlapChars ?? 120;

  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!normalized) {
    return [];
  }

  const paragraphs = normalized.split("\n\n");
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      chunks.push(current);
      const overlap = current.slice(Math.max(0, current.length - overlapChars));
      current = `${overlap}\n\n${paragraph}`.slice(-maxChars);
    } else {
      // Fallback for very long single paragraph.
      for (let i = 0; i < paragraph.length; i += maxChars - overlapChars) {
        chunks.push(paragraph.slice(i, i + maxChars));
      }
      current = "";
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

export function estimateTokenCount(text: string): number {
  // Rough heuristic for educational transparency: 1 token ~= 4 chars in English.
  return Math.ceil(text.length / 4);
}
