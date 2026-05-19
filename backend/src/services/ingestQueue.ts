import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../observability/logger.js";
import { ingestPdf } from "../rag/ingestionPipeline.js";

let connection: Redis | null = null;
let ingestQueue: Queue | null = null;

let workerStarted = false;

function getQueue() {
  if (!connection) {
    connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
  }
  if (!ingestQueue) {
    ingestQueue = new Queue("pdf-ingestion", { connection });
  }
  return { connection, ingestQueue };
}

export async function enqueueIngestJob(data: { filePath: string; title: string }) {
  const { ingestQueue } = getQueue();
  return ingestQueue.add("ingest", data);
}

export function startIngestWorker() {
  if (workerStarted || !env.USE_INGEST_QUEUE) {
    return;
  }

  const { connection } = getQueue();

  const worker = new Worker(
    "pdf-ingestion",
    async (job) => {
      const { filePath, title } = job.data as { filePath: string; title: string };
      return ingestPdf(filePath, title);
    },
    { connection }
  );

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Ingestion job completed");
  });
  worker.on("failed", (job, error) => {
    logger.error({ jobId: job?.id, error }, "Ingestion job failed");
  });

  workerStarted = true;
}
