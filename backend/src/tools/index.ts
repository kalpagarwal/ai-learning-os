import { learningHistoryTool } from "./learningHistoryTool.js";
import { pdfRetrievalTool } from "./pdfRetrievalTool.js";
import { roadmapGeneratorTool } from "./roadmapGeneratorTool.js";
import type { ToolDefinition } from "./types.js";
import { webSearchTool } from "./webSearchTool.js";

export const toolRegistry: Record<string, ToolDefinition> = {
  [webSearchTool.name]: webSearchTool,
  [pdfRetrievalTool.name]: pdfRetrievalTool,
  [learningHistoryTool.name]: learningHistoryTool,
  [roadmapGeneratorTool.name]: roadmapGeneratorTool
};

export const tools = Object.values(toolRegistry);
