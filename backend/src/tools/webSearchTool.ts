import { openai } from "../services/openaiClient.js";
import type { ToolDefinition } from "./types.js";
// import { AI_MODEL } from "../../src/constant.js";
import { env } from "../config/env.js";

export const webSearchTool: ToolDefinition = {
  name: "web_search",
  description: "Searches the web for a topic and returns a concise educational summary.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "What to search for" }
    },
    required: ["query"],
    additionalProperties: false
  },
  handler: async (input) => {
    const query = String(input.query ?? "");
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      tools: [{ type: "web_search_preview" }],
      input: `Find reliable, recent information for: ${query}. Return 5 bullet points.`
    });

    return {
      query,
      summary: response.output_text
    };
  }
};
