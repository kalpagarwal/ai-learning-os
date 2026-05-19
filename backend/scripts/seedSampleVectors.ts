import { v4 as uuidv4 } from "uuid";
import { env } from "../src/config/env.js";
import { prisma } from "../src/db/prisma.js";
import { chunkText, estimateTokenCount } from "../src/rag/chunker.js";
import { embedTexts } from "../src/rag/embeddingService.js";
import { ensureCollection, qdrantClient } from "../src/rag/qdrantService.js";

const sampleDocs = [
  {
    title: "Sample - Embeddings Intro",
    text: `Embeddings convert text into vectors. Similar meanings end up near each other.

In RAG, we embed chunks and the user query. The vector database returns chunks closest to the query embedding.

Cosine similarity is a common metric for nearest-neighbor retrieval.`
  },
  {
    title: "Sample - Multi Agent Basics",
    text: `A tutor agent explains concepts. A planner agent creates roadmaps.

A quiz agent tests understanding. A research agent gathers external evidence.

An orchestrator decides which agent should handle each user request.`
  }
];

async function main() {
  for (const doc of sampleDocs) {
    const created = await prisma.document.create({
      data: {
        title: doc.title,
        sourcePath: "seed://sample",
        status: "READY"
      }
    });

    const chunks = chunkText(doc.text);
    const vectors = await embedTexts(chunks);

    await ensureCollection(vectors[0]?.length ?? 1536);

    await prisma.$transaction(
      chunks.map((chunk, index) =>
        prisma.chunk.create({
          data: {
            documentId: created.id,
            chunkIndex: index,
            text: chunk,
            tokenCount: estimateTokenCount(chunk)
          }
        })
      )
    );

    await qdrantClient.upsert(env.QDRANT_COLLECTION, {
      wait: true,
      points: chunks.map((chunk, index) => ({
        id: uuidv4(),
        vector: vectors[index],
        payload: {
          documentId: created.id,
          chunkIndex: index,
          title: created.title,
          text: chunk
        }
      }))
    });

    console.log(`Seeded vectors for ${doc.title}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
