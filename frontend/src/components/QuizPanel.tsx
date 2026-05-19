"use client";

import { useState } from "react";
import { evaluateQuiz, generateQuiz } from "../lib/api";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export function QuizPanel() {
  const [userId, setUserId] = useState("demo-user");
  const [topic, setTopic] = useState("Vector search in RAG");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  async function handleGenerate() {
    const data = await generateQuiz({ topic, difficulty });
    setQuestions(data.questions);
    setAnswers(new Array(data.questions.length).fill(""));
    setResult("");
  }

  async function handleEvaluate() {
    const data = await evaluateQuiz({
      userId,
      topic,
      questions,
      userAnswers: answers
    });
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="card">
      <h3>Quiz Page</h3>
      <div className="grid">
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Quiz topic" />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard") }>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <button onClick={handleGenerate}>Generate MCQs</button>
      </div>

      {questions.map((q, idx) => (
        <div key={idx} style={{ marginTop: 12, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          <p><strong>Q{idx + 1}.</strong> {q.question}</p>
          <select
            value={answers[idx] ?? ""}
            onChange={(e) => {
              const next = [...answers];
              next[idx] = e.target.value;
              setAnswers(next);
            }}
          >
            <option value="">Select an answer</option>
            {q.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}

      {questions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button onClick={handleEvaluate}>Evaluate Answers</button>
        </div>
      )}

      <pre>{result || "No evaluation yet."}</pre>
    </div>
  );
}
