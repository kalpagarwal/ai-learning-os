const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function sendChat(body: { userId?: string; conversationId?: string; message: string }) {
  return callApi<{
    conversationId: string;
    agent: string;
    answer: string;
    retrieval: unknown;
    steps: unknown[];
    toolCalls: unknown[];
  }>("/api/chat", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function generateRoadmap(body: { userId: string; topic: string; level?: string }) {
  return callApi<{ roadmap: unknown; steps: string[]; agent: string; toolTraces: unknown[] }>(
    "/api/roadmap/generate",
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );
}

export async function getLatestRoadmap(userId: string) {
  return callApi<{ roadmap: { title: string; stepsJson: string[] } | null }>(`/api/roadmap/${userId}/latest`);
}

export async function generateQuiz(body: { topic: string; difficulty: "easy" | "medium" | "hard" }) {
  return callApi<{ questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }> }>(
    "/api/quiz/generate",
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );
}

export async function evaluateQuiz(body: {
  userId: string;
  topic: string;
  questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }>;
  userAnswers: string[];
}) {
  return callApi<{
    score: number;
    total: number;
    evaluations: Array<{ question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean; explanation: string }>;
    progress: unknown;
  }>("/api/quiz/evaluate", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function uploadPdf(formData: FormData) {
  const response = await fetch(`${API_BASE}/api/ingest/pdf`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<{
    documentId: string;
    title: string;
    chunkCount: number;
    timingMs: number;
  }>;
}

export async function runRetrievalDebug(query: string) {
  return callApi<{ query: string; chunks: unknown[]; contextText: string; timingMs: number }>(
    `/api/debug/retrieval?query=${encodeURIComponent(query)}`
  );
}

export async function getAgentActivity(conversationId: string) {
  return callApi<{ agents: unknown[]; tools: unknown[] }>(`/api/debug/agent-activity/${conversationId}`);
}
