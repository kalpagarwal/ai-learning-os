import { runAgentWithTools } from "./baseAgentRunner.js";
import type { AgentRunInput } from "./types.js";

export async function runTutorAgent(input: AgentRunInput) {
  return runAgentWithTools({
    agentName: "TutorAgent",
    input,
    enabledTools: ["pdf_retrieval", "learning_history"],
    systemPrompt: `You are a practical AI tutor.
- Explain concepts step-by-step.
- Prefer examples grounded in the user's uploaded documents.
- End with one short "check your understanding" question.`
  });
}
