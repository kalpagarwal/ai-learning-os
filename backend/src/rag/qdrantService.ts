import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "../config/env.js";
import { logger } from "../observability/logger.js";

export const qdrantClient = new QdrantClient({ url: env.QDRANT_URL });

let collectionReady = false;

export async function ensureCollection(vectorSize: number): Promise<void> {
  if (collectionReady) {
    return;
  }

  const existingCollections = await qdrantClient.getCollections();
  const exists = existingCollections.collections.some((item) => item.name === env.QDRANT_COLLECTION);

  if (!exists) {
    await qdrantClient.createCollection(env.QDRANT_COLLECTION, {
      vectors: {
        size: vectorSize,
        distance: "Cosine"
      }
    });
    logger.info({ collection: env.QDRANT_COLLECTION, vectorSize }, "Created Qdrant collection");
  }

  collectionReady = true;
}
