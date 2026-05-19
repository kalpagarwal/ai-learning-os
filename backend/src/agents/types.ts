import type { ToolTrace } from "../types/index.js";

export type AgentName = "TutorAgent" | "PlannerAgent" | "QuizAgent" | "ResearchAgent";

export type AgentRunInput = {
  userMessage: string;
  userId?: string;
  conversationId?: string;
  retrievedContext?: string;
};

export type AgentRunOutput = {
  agentName: AgentName;
  answer: string;
  steps: { step: string; detail: string; timestamp: string }[];
  toolTraces: ToolTrace[];
};
