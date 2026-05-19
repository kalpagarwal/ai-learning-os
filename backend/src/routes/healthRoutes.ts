import { Router } from "express";

export const healthRoutes = Router();

healthRoutes.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ai-learning-os-backend", time: new Date().toISOString() });
});
