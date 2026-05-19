export type RetrievedChunk = {
  chunkId: string;
  documentId: string;
  text: string;
  score: number;
  chunkIndex: number;
};

export type RetrievalDebug = {
  query: string;
  chunks: RetrievedChunk[];
  contextText: string;
  timingMs: number;
};

export type AgentStep = {
  step: string;
  detail: string;
  timestamp: string;
};

export type ToolTrace = {
  name: string;
  input: unknown;
  output: unknown;
  durationMs: number;
};
