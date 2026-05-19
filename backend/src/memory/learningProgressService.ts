import { prisma } from "../db/prisma.js";
import { ensureUser, upsertLearningTopic } from "./memoryService.js";

export type QuizEvaluation = {
  topic: string;
  score: number;
  total: number;
  confidence: number;
};

export async function saveQuizResult(params: {
  userId: string;
  topic: string;
  questions: unknown;
  answers: unknown;
  score: number;
  total: number;
}) {
  await ensureUser(params.userId);

  const confidence = params.total === 0 ? 0 : params.score / params.total;

  await prisma.quizAttempt.create({
    data: {
      userId: params.userId,
      topic: params.topic,
      questionsJson: params.questions as never,
      answersJson: params.answers as never,
      score: params.score,
      total: params.total
    }
  });

  await upsertLearningTopic({
    userId: params.userId,
    topic: params.topic,
    confidence
  });

  return {
    topic: params.topic,
    score: params.score,
    total: params.total,
    confidence
  } satisfies QuizEvaluation;
}

export async function getProgressSummary(userId: string) {
  const [topics, attempts] = await Promise.all([
    prisma.learningTopic.findMany({ where: { userId } }),
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  const averageScore =
    attempts.length === 0
      ? 0
      : attempts.reduce((acc: number, item: { score: number; total: number }) => acc + item.score / Math.max(item.total, 1), 0) /
        attempts.length;

  return {
    topicCount: topics.length,
    weakTopics: topics.filter((t: { strength: string }) => t.strength === "WEAK").map((t: { topic: string }) => t.topic),
    strongTopics: topics.filter((t: { strength: string }) => t.strength === "STRONG").map((t: { topic: string }) => t.topic),
    recentAttempts: attempts,
    averageScore: Number((averageScore * 100).toFixed(1))
  };
}
