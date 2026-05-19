export const AI_MODEL =
  process.env.OPENAI_MODEL || "qwen2.5-3b-instruct";

export const EMBED_MODEL =
  process.env.OPENAI_EMBED_MODEL ||
  "text-embedding-nomic-embed-text-v1.5";