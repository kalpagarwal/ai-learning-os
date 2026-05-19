import { Router } from "express";
import { z } from "zod";
import { generateQuiz, evaluateQuiz } from "../services/quizService.js";

const generateSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium")
});

const evaluateSchema = z.object({
  userId: z.string(),
  topic: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      explanation: z.string()
    })
  ),
  userAnswers: z.array(z.string())
});

export const quizRoutes = Router();

quizRoutes.post("/quiz/generate", async (req, res, next) => {
  try {
    const body = generateSchema.parse(req.body);
    const quiz = await generateQuiz(body.topic, body.difficulty);
    res.json(quiz);
  } catch (error) {
    next(error);
  }
});

quizRoutes.post("/quiz/evaluate", async (req, res, next) => {
  try {
    const body = evaluateSchema.parse(req.body);
    const evaluation = await evaluateQuiz(body);
    res.json(evaluation);
  } catch (error) {
    next(error);
  }
});
