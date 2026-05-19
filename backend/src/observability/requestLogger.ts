import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startedAt = performance.now();

  res.on("finish", () => {
    const durationMs = Math.round(performance.now() - startedAt);
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs
      },
      "HTTP request"
    );
  });

  next();
}
