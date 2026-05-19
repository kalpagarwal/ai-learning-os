import cors from "cors";
import express from "express";
import { apiRoutes } from "./routes/index.js";
import { requestLogger } from "./observability/requestLogger.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(requestLogger);

app.use(apiRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  res.status(500).json({ error: message });
});
