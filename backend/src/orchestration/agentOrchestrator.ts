import { saveAgentExecution, saveToolExecution } from "../memory/memoryService.js";
import { logger } from "../observability/logger.js";
import { startTimer } from "../observability/timer.js";
import { retrieveRelevantChunks } from "../rag/retrievalPipeline.js";
import type { RetrievalDebug } from "../types/index.js";
import { runPlannerAgent } from "../agents/plannerAgent.js";
import { runQuizAgent } from "../agents/quizAgent.js";
import { runResearchAgent } from "../agents/researchAgent.js";
import { runTutorAgent } from "../agents/tutorAgent.js";
import type { AgentName } from "../agents/types.js";

function pickAgent(message: string): AgentName {
  const normalized = message.toLowerCase();
  if (normalized.includes("roadmap") || normalized.includes("plan")) {
    return "PlannerAgent";
  }
  if (normalized.includes("quiz") || normalized.includes("mcq")) {
    return "QuizAgent";
  }
  if (normalized.includes("research") || normalized.includes("latest") || normalized.includes("compare")) {
    return "ResearchAgent";
  }
  return "TutorAgent";
}

export async function runOrchestrator(params: {
  userMessage: string;
  userId?: string;
  conversationId?: string;
}): Promise<{
  answer: string;
  agentName: AgentName;
  steps: { step: string; detail: string; timestamp: string }[];
  retrieval: RetrievalDebug;
  toolTraces: unknown[];
}> {
  const startedAt = new Date();
  const stop = startTimer();
  const agentName = pickAgent(params.userMessage);

  const retrieval = await retrieveRelevantChunks(params.userMessage, 6);

  const agentInput = {
    userMessage: params.userMessage,
    userId: params.userId,
    conversationId: params.conversationId,
    retrievedContext: retrieval.contextText
  };

  const run =
    agentName === "PlannerAgent"
      ? runPlannerAgent
      : agentName === "QuizAgent"
        ? runQuizAgent
        : agentName === "ResearchAgent"
          ? runResearchAgent
          : runTutorAgent;

  const result = await run(agentInput);
  const durationMs = stop();
  const endedAt = new Date();

  for (const trace of result.toolTraces) {
    await saveToolExecution({
      conversationId: params.conversationId,
      agentName: result.agentName,
      toolName: trace.name,
      input: trace.input,
      output: trace.output,
      durationMs: trace.durationMs
    });
  }

  await saveAgentExecution({
    conversationId: params.conversationId,
    agentName: result.agentName,
    status: "SUCCESS",
    steps: result.steps,
    startedAt,
    endedAt,
    durationMs
  });

  logger.info({ agentName: result.agentName, durationMs, toolCalls: result.toolTraces.length }, "Agent run complete");

  return {
    answer: result.answer,
    agentName: result.agentName,
    steps: result.steps,
    retrieval,
    toolTraces: result.toolTraces
  };
}
