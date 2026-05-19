import { env } from "./config/env.js";
import { logger } from "./observability/logger.js";
import { startIngestWorker } from "./services/ingestQueue.js";
import { app } from "./app.js";

startIngestWorker();

app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
  logger.info(
    {
      host: env.BACKEND_HOST,
      port: env.BACKEND_PORT,
      queueEnabled: env.USE_INGEST_QUEUE
    },
    "Backend started"
  );
});
