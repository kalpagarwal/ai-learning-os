import { prisma } from "../db/prisma.js";
import { ensureUser } from "../memory/memoryService.js";
import { runPlannerAgent } from "../agents/plannerAgent.js";

export async function generateRoadmap(params: { userId: string; topic: string; level?: string }) {
  await ensureUser(params.userId);

  const output = await runPlannerAgent({
    userMessage: `Create a learning roadmap for ${params.topic} at ${params.level ?? "beginner"} level.`,
    userId: params.userId
  });

  const steps = output.answer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);

  const roadmap = await prisma.learningRoadmap.create({
    data: {
      userId: params.userId,
      title: `${params.topic} roadmap`,
      stepsJson: steps
    }
  });

  return { roadmap, steps, agent: output.agentName, toolTraces: output.toolTraces };
}

export async function getLatestRoadmap(userId: string) {
  return prisma.learningRoadmap.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}
