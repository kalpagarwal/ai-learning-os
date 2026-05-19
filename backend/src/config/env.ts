import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().default(4000),
  BACKEND_HOST: z.string().default("0.0.0.0"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_EMBED_MODEL: z.string().default("text-embedding-3-small"),
  DATABASE_URL: z.string().url(),
  QDRANT_URL: z.string().url(),
  QDRANT_COLLECTION: z.string().default("learning_chunks"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  USE_INGEST_QUEUE: z.string().default("false").transform((v) => v === "true"),
  USE_AGENTS_SDK: z.string().default("false").transform((v) => v === "true")
});

export const env = envSchema.parse(process.env);
