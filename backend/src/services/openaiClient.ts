import OpenAI from "openai";
import { env } from "../config/env.js";

// export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
export const openai = new OpenAI({ baseURL: "http://localhost:1234/v1",
   apiKey: 'lm-studio' });
