import { Router } from "express";
import { chatRoutes } from "./chatRoutes.js";
import { debugRoutes } from "./debugRoutes.js";
import { healthRoutes } from "./healthRoutes.js";
import { ingestRoutes } from "./ingestRoutes.js";
import { quizRoutes } from "./quizRoutes.js";
import { roadmapRoutes } from "./roadmapRoutes.js";

export const apiRoutes = Router();

apiRoutes.use(healthRoutes);
apiRoutes.use("/api", ingestRoutes);
apiRoutes.use("/api", chatRoutes);
apiRoutes.use("/api", roadmapRoutes);
apiRoutes.use("/api", quizRoutes);
apiRoutes.use("/api", debugRoutes);
