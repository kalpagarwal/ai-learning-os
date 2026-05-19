import { logger } from "../observability/logger.js";
import { startTimer } from "../observability/timer.js";
import { openai } from "./openaiClient.js";
// import { AI_MODEL } from "../../src/constant.js";

export type ToolDefinitionInput = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type ToolExecutionTrace = {
  name: string;
  callId: string;
  input: unknown;
  output: unknown;
  durationMs: number;
};

export type ToolHandlerMap = Record<string, (args: Record<string, unknown>) => Promise<unknown>>;

function toResponseTools(tools: ToolDefinitionInput[]) {
  return tools.map((tool) => ({
    type: "function" as const,
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    strict: true
  }));
}

function parseFunctionCalls(response: any) {
  const items: any[] = response?.output ?? [];
  return items.filter((item) => item.type === "function_call");
}

export async function runResponseWithTools(params: {
  model: string;
  systemPrompt: string;
  userMessage: string;
  tools: ToolDefinitionInput[];
  handlers: ToolHandlerMap;
}): Promise<{ text: string; traces: ToolExecutionTrace[] }> {
  const traces: ToolExecutionTrace[] = [];

  let response: any = await openai.responses.create({
    model: params.model,
    input: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userMessage }
    ],
    tools: toResponseTools(params.tools)
  });

  for (let i = 0; i < 4; i += 1) {
    const calls = parseFunctionCalls(response);
    if (calls.length === 0) {
      break;
    }

    const toolOutputs: any[] = [];
    for (const call of calls) {
      const stop = startTimer();
      const name = String(call.name);
      const callId = String(call.call_id);
      const args = JSON.parse(call.arguments ?? "{}");

      const handler = params.handlers[name];
      if (!handler) {
        toolOutputs.push({
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify({ error: `No handler found for tool ${name}` })
        });
        continue;
      }

      const output = await handler(args);
      const durationMs = stop();
      traces.push({ name, callId, input: args, output, durationMs });

      toolOutputs.push({
        type: "function_call_output",
        call_id: callId,
        output: JSON.stringify(output)
      });
    }

    response = await openai.responses.create({
      model: params.model,
      previous_response_id: response.id,
      input: toolOutputs
    });
  }

  logger.info({ toolCalls: traces.length }, "Response tool loop complete");
  return {
    text: response.output_text ?? "No response text returned.",
    traces
  };
}
