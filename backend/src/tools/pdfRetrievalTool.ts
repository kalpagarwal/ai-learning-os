import { retrieveRelevantChunks } from "../rag/retrievalPipeline.js";
import type { ToolDefinition } from "./types.js";

export const pdfRetrievalTool: ToolDefinition = {
  name: "pdf_retrieval",
  description: "Retrieves relevant knowledge chunks from uploaded PDFs.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string" },
      limit: { type: "number", minimum: 1, maximum: 10 }
    },
    required: ["query"],
    additionalProperties: false
  },
  handler: async (input) => {
    const query = String(input.query ?? "");
    const limit = Number(input.limit ?? 5);
    return retrieveRelevantChunks(query, limit);
  }
};
