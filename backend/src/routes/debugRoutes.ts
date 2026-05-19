import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { getProgressSummary } from "../memory/learningProgressService.js";
import { getLearningProfile } from "../memory/memoryService.js";
import { retrieveRelevantChunks } from "../rag/retrievalPipeline.js";

export const debugRoutes = Router();

debugRoutes.get("/debug/retrieval", async (req, res, next) => {
  try {
    const query = String(req.query.query ?? "What is this document about?");
    const data = await retrieveRelevantChunks(query, 6);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

debugRoutes.get("/debug/agent-activity/:conversationId", async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;

    const [agents, tools] = await Promise.all([
      prisma.agentExecution.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.toolExecution.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: 40
      })
    ]);

    res.json({ agents, tools });
  } catch (error) {
    next(error);
  }
});

debugRoutes.get("/debug/progress/:userId", async (req, res, next) => {
  try {
    const summary = await getProgressSummary(req.params.userId);
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

debugRoutes.get("/debug/learning-profile/:userId", async (req, res, next) => {
  try {
    const topics = await getLearningProfile(req.params.userId);
    res.json({ topics });
  } catch (error) {
    next(error);
  }
});
