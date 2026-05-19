import { env } from "../config/env.js";
import { logger } from "../observability/logger.js";
import { startTimer } from "../observability/timer.js";
import type { RetrievalDebug, RetrievedChunk } from "../types/index.js";
import { embedTexts } from "./embeddingService.js";
import { qdrantClient } from "./qdrantService.js";

function lexicalBonusScore(query: string, text: string): number {
  const queryTerms = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  const textTerms = new Set(text.toLowerCase().split(/\W+/).filter(Boolean));
  let overlap = 0;
  for (const term of queryTerms) {
    if (textTerms.has(term)) {
      overlap += 1;
    }
  }
  return queryTerms.size === 0 ? 0 : overlap / queryTerms.size;
}

export async function retrieveRelevantChunks(query: string, limit = 5): Promise<RetrievalDebug> {
  const stop = startTimer();
  const [queryVector] = await embedTexts([query]);

  let result: Awaited<ReturnType<typeof qdrantClient.search>> = [];
  try {
    result = await qdrantClient.search(env.QDRANT_COLLECTION, {
      vector: queryVector,
      limit,
      with_payload: true
    });
  } catch {
    logger.warn({ collection: env.QDRANT_COLLECTION }, "Retrieval attempted before collection/index existed");
    const timingMs = stop();
    return {
      query,
      chunks: [],
      contextText: "No indexed chunks found yet. Upload and ingest PDFs first.",
      timingMs
    };
  }

  // Educational reranking: combine vector score + lexical overlap.
  const reranked = result
    .map((point) => {
      const payload = point.payload as Record<string, unknown>;
      const text = String(payload.text ?? "");
      const vectorScore = point.score ?? 0;
      const lexicalScore = lexicalBonusScore(query, text);
      const combinedScore = vectorScore * 0.85 + lexicalScore * 0.15;
      return {
        chunkId: String(point.id),
        documentId: String(payload.documentId ?? "unknown"),
        chunkIndex: Number(payload.chunkIndex ?? 0),
        text,
        score: Number(combinedScore.toFixed(5))
      } as RetrievedChunk;
    })
    .sort((a, b) => b.score - a.score);

  const contextText = reranked
    .map((chunk, idx) => `Chunk ${idx + 1} (score=${chunk.score}):\n${chunk.text}`)
    .join("\n\n---\n\n");

  const timingMs = stop();
  logger.info({ query, chunkCount: reranked.length, timingMs }, "Retrieval complete");

  return {
    query,
    chunks: reranked,
    contextText,
    timingMs
  };
}
