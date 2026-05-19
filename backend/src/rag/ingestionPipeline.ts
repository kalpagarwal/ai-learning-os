import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { logger } from "../observability/logger.js";
import { startTimer } from "../observability/timer.js";
import { chunkText, estimateTokenCount } from "./chunker.js";
import { embedTexts } from "./embeddingService.js";
import { parsePdf } from "./pdfParser.js";
import { ensureCollection, qdrantClient } from "./qdrantService.js";

export type IngestResult = {
  documentId: string;
  title: string;
  chunkCount: number;
  timingMs: number;
};

export async function ingestPdf(filePath: string, title: string): Promise<IngestResult> {
  const stop = startTimer();

  const document = await prisma.document.create({
    data: {
      title,
      sourcePath: filePath,
      status: "PROCESSING"
    }
  });

  try {
    const text = await parsePdf(filePath);
    if (!text) {
      throw new Error("Parsed PDF text is empty");
    }

    const chunks = chunkText(text);
    const vectors = await embedTexts(chunks);
    await ensureCollection(vectors[0]?.length ?? 1536);

    await prisma.$transaction(
      chunks.map((chunk, index) =>
        prisma.chunk.create({
          data: {
            documentId: document.id,
            chunkIndex: index,
            text: chunk,
            tokenCount: estimateTokenCount(chunk),
            metadataJson: {
              source: title,
              charLength: chunk.length
            }
          }
        })
      )
    );

    const points = chunks.map((chunk, index) => ({
      id: uuidv4(),
      vector: vectors[index],
      payload: {
        documentId: document.id,
        chunkIndex: index,
        title,
        text: chunk
      }
    }));

    await qdrantClient.upsert(env.QDRANT_COLLECTION, {
      wait: true,
      points
    });

    await prisma.document.update({
      where: { id: document.id },
      data: { status: "READY" }
    });

    const timingMs = stop();
    logger.info({ documentId: document.id, chunkCount: chunks.length, timingMs }, "Ingestion complete");

    return {
      documentId: document.id,
      title,
      chunkCount: chunks.length,
      timingMs
    };
  } catch (error) {
    await prisma.document.update({
      where: { id: document.id },
      data: { status: "FAILED" }
    });

    throw error;
  } finally {
    // Keep local uploads for reproducibility in learning projects.
    await fs.access(filePath).catch(() => undefined);
  }
}
