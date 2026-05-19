import { Router } from "express";
import { z } from "zod";
import { getLatestRoadmap, generateRoadmap } from "../services/roadmapService.js";

const generateSchema = z.object({
  userId: z.string(),
  topic: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional()
});

export const roadmapRoutes = Router();

roadmapRoutes.post("/roadmap/generate", async (req, res, next) => {
  try {
    const body = generateSchema.parse(req.body);
    const roadmap = await generateRoadmap(body);
    res.json(roadmap);
  } catch (error) {
    next(error);
  }
});

roadmapRoutes.get("/roadmap/:userId/latest", async (req, res, next) => {
  try {
    const roadmap = await getLatestRoadmap(req.params.userId);
    res.json({ roadmap });
  } catch (error) {
    next(error);
  }
});
