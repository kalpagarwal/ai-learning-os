import { runAgentWithTools } from "./baseAgentRunner.js";
import type { AgentRunInput } from "./types.js";

export async function runPlannerAgent(input: AgentRunInput) {
  return runAgentWithTools({
    agentName: "PlannerAgent",
    input,
    enabledTools: ["learning_history", "roadmap_generator"],
    systemPrompt: `You are a learning planner.
- Produce phased roadmaps with clear weekly outcomes.
- Personalize sequence based on weak topics from memory.
- Keep outputs concrete and actionable.`
  });
}
