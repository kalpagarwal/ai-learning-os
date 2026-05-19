import { prisma } from "../db/prisma.js";
import { ensureUser } from "../memory/memoryService.js";
import { openai } from "../services/openaiClient.js";
import type { ToolDefinition } from "./types.js";
import { env } from "../config/env.js";
// import { AI_MODEL } from "../../src/constant.js";


export const roadmapGeneratorTool: ToolDefinition = {
  name: "roadmap_generator",
  description: "Generates a phased learning roadmap for a topic and stores it.",
  parameters: {
    type: "object",
    properties: {
      topic: { type: "string" },
      level: { type: "string", enum: ["beginner", "intermediate", "advanced"] }
    },
    required: ["topic"],
    additionalProperties: false
  },
  handler: async (input, context) => {
    const topic = String(input.topic ?? "AI Systems");
    const level = String(input.level ?? "beginner");

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You create practical roadmaps. Return JSON with title and steps (array of concise strings)."
        },
        {
          role: "user",
          content: `Create a ${level} roadmap for ${topic}. Keep to 8 steps.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "roadmap_output",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              steps: { type: "array", items: { type: "string" } }
            },
            required: ["title", "steps"],
            additionalProperties: false
          }
        }
      }
    });

    const parsed = JSON.parse(response.output_text) as { title: string; steps: string[] };

    if (context.userId) {
      await ensureUser(context.userId);
      await prisma.learningRoadmap.create({
        data: {
          userId: context.userId,
          title: parsed.title,
          stepsJson: parsed.steps
        }
      });
    }

    return parsed;
  }
};
