import { getLearningProfile, loadConversationHistory } from "../memory/memoryService.js";
import type { ToolDefinition } from "./types.js";

export const learningHistoryTool: ToolDefinition = {
  name: "learning_history",
  description: "Returns learning profile and recent messages for personalization.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  },
  handler: async (_input, context) => {
    if (!context.userId || !context.conversationId) {
      return { warning: "No userId/conversationId provided." };
    }

    const [topics, history] = await Promise.all([
      getLearningProfile(context.userId),
      loadConversationHistory(context.conversationId, 10)
    ]);

    return {
      topics,
      history: history.map((msg: { role: string; content: string; createdAt: Date }) => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      }))
    };
  }
};
