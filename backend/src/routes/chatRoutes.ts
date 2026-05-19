import { Router } from "express";
import { z } from "zod";
import { addMessage, getOrCreateConversation } from "../memory/memoryService.js";
import { runOrchestrator } from "../orchestration/agentOrchestrator.js";

const chatSchema = z.object({
  userId: z.string().optional(),
  conversationId: z.string().optional(),
  message: z.string().min(1)
});

export const chatRoutes = Router();

chatRoutes.post("/chat", async (req, res, next) => {
  try {
    const body = chatSchema.parse(req.body);
    const conversation = await getOrCreateConversation(body.conversationId);

    await addMessage({
      conversationId: conversation.id,
      role: "USER",
      content: body.message
    });

    const result = await runOrchestrator({
      conversationId: conversation.id,
      userId: body.userId,
      userMessage: body.message
    });

    await addMessage({
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: result.answer,
      agentName: result.agentName,
      toolCallsJson: result.toolTraces,
      retrievalJson: result.retrieval
    });

    res.json({
      conversationId: conversation.id,
      agent: result.agentName,
      answer: result.answer,
      retrieval: result.retrieval,
      steps: result.steps,
      toolCalls: result.toolTraces
    });
  } catch (error) {
    next(error);
  }
});
