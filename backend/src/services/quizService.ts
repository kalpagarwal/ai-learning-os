
import { openai } from "./openaiClient.js";
import { env } from "../config/env.js";
import { saveQuizResult } from "../memory/learningProgressService.js";
import { AI_MODEL } from "../../src/constant.js";
export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export async function generateQuiz(topic: string, difficulty: "easy" | "medium" | "hard" = "medium") {
  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "Generate quiz JSON only. 5 MCQs. Each has question, options (4), correctAnswer, explanation."
      },
      {
        role: "user",
        content: `Topic: ${topic}. Difficulty: ${difficulty}.`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "quiz_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correctAnswer: { type: "string" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correctAnswer", "explanation"],
                additionalProperties: false
              }
            }
          },
          required: ["questions"],
          additionalProperties: false
        }
      }
    }
  });

  return JSON.parse(response.output_text) as { questions: QuizQuestion[] };
}

export async function evaluateQuiz(params: {
  userId: string;
  topic: string;
  questions: QuizQuestion[];
  userAnswers: string[];
}) {
  let score = 0;

  const evaluations = params.questions.map((q, index) => {
    const userAnswer = params.userAnswers[index];
    const correct = userAnswer === q.correctAnswer;
    if (correct) {
      score += 1;
    }
    return {
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: correct,
      explanation: q.explanation
    };
  });

  const progress = await saveQuizResult({
    userId: params.userId,
    topic: params.topic,
    questions: params.questions,
    answers: params.userAnswers,
    score,
    total: params.questions.length
  });

  return {
    score,
    total: params.questions.length,
    evaluations,
    progress
  };
}
