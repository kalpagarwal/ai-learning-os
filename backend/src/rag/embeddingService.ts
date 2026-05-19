import { env } from "../config/env.js";
import { logger } from "../observability/logger.js";
import { startTimer } from "../observability/timer.js";
import { openai } from "../services/openaiClient.js";
// import { EMBED_MODEL} from "../../src/constant.js";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const stop = startTimer();
  const response = await openai.embeddings.create({
    model: env.OPENAI_EMBED_MODEL,
    input: texts
  });

  const vectors = response.data.map((item) => item.embedding);
  logger.info(
    {
      textCount: texts.length,
      vectorDim: vectors[0]?.length,
      durationMs: stop()
    },
    "Embeddings generated"
  );
  return vectors;
}
