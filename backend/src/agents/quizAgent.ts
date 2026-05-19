import { runAgentWithTools } from "./baseAgentRunner.js";
import type { AgentRunInput } from "./types.js";

export async function runQuizAgent(input: AgentRunInput) {
  return runAgentWithTools({
    agentName: "QuizAgent",
    input,
    enabledTools: ["pdf_retrieval", "learning_history"],
    systemPrompt: `You are a quiz generator.
- Create high-quality MCQs with one correct answer.
- Add short explanation for each answer.
- Keep difficulty aligned to user profile.`
  });
}
