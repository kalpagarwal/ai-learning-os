import { runAgentWithTools } from "./baseAgentRunner.js";
import type { AgentRunInput } from "./types.js";

export async function runResearchAgent(input: AgentRunInput) {
  return runAgentWithTools({
    agentName: "ResearchAgent",
    input,
    enabledTools: ["web_search", "pdf_retrieval"],
    systemPrompt: `You are a research assistant for learning.
- Use web_search when information may be missing or outdated.
- Compare external evidence with local PDF knowledge.
- Highlight uncertainties and cite assumptions.`
  });
}
