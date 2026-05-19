import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { ingestPdf } from "../rag/ingestionPipeline.js";
import { enqueueIngestJob } from "../services/ingestQueue.js";

const uploadDir = path.resolve(process.cwd(), "backend/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

export const ingestRoutes = Router();

ingestRoutes.post("/ingest/pdf", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const title = req.body.title || req.file.originalname;

    if (env.USE_INGEST_QUEUE) {
      const job = await enqueueIngestJob({
        filePath: req.file.path,
        title
      });

      res.json({ queued: true, jobId: job.id, title });
      return;
    }

    const result = await ingestPdf(req.file.path, title);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
