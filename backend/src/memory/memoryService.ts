import { prisma } from "../db/prisma.js";

type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";
type TopicStrength = "WEAK" | "MEDIUM" | "STRONG";

export async function getOrCreateConversation(conversationId?: string) {
  if (conversationId) {
    const existing = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (existing) {
      return existing;
    }
  }
  return prisma.conversation.create({ data: {} });
}

export async function ensureUser(userId: string) {
  return prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId }
  });
}

export async function addMessage(params: {
  conversationId: string;
  role: MessageRole;
  content: string;
  agentName?: string;
  toolCallsJson?: unknown;
  retrievalJson?: unknown;
}) {
  return prisma.message.create({
    data: {
      conversationId: params.conversationId,
      role: params.role,
      content: params.content,
      agentName: params.agentName,
      toolCallsJson: params.toolCallsJson as never,
      retrievalJson: params.retrievalJson as never
    }
  });
}

export async function loadConversationHistory(conversationId: string, limit = 12) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: limit
  });
}

export async function getLearningProfile(userId: string) {
  return prisma.learningTopic.findMany({
    where: { userId },
    orderBy: [{ strength: "asc" }, { confidence: "asc" }]
  });
}

export async function upsertLearningTopic(params: {
  userId: string;
  topic: string;
  confidence: number;
}) {
  let strength: TopicStrength = "WEAK";
  if (params.confidence >= 0.75) {
    strength = "STRONG";
  } else if (params.confidence >= 0.45) {
    strength = "MEDIUM";
  }

  return prisma.learningTopic.upsert({
    where: { userId_topic: { userId: params.userId, topic: params.topic } },
    update: {
      confidence: params.confidence,
      strength,
      lastReviewedAt: new Date()
    },
    create: {
      userId: params.userId,
      topic: params.topic,
      confidence: params.confidence,
      strength,
      lastReviewedAt: new Date()
    }
  });
}

export async function saveToolExecution(params: {
  conversationId?: string;
  agentName: string;
  toolName: string;
  input: unknown;
  output: unknown;
  durationMs: number;
}) {
  return prisma.toolExecution.create({
    data: {
      conversationId: params.conversationId,
      agentName: params.agentName,
      toolName: params.toolName,
      inputJson: params.input as never,
      outputJson: params.output as never,
      durationMs: params.durationMs
    }
  });
}

export async function saveAgentExecution(params: {
  conversationId?: string;
  agentName: string;
  status: string;
  steps: unknown;
  startedAt: Date;
  endedAt: Date;
  durationMs: number;
}) {
  return prisma.agentExecution.create({
    data: {
      conversationId: params.conversationId,
      agentName: params.agentName,
      status: params.status,
      stepsJson: params.steps as never,
      startedAt: params.startedAt,
      endedAt: params.endedAt,
      durationMs: params.durationMs
    }
  });
}
