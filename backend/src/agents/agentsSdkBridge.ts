/**
 * This file demonstrates how to integrate the OpenAI Agents SDK without hiding details.
 * We keep it optional so learners can run the system even before exploring SDK internals.
 */
export async function runWithAgentsSdk(params: {
  agentName: string;
  instructions: string;
  userMessage: string;
}): Promise<{ text: string } | null> {
  try {
    const sdk = (await import("@openai/agents")) as any;

    if (!sdk?.Agent || !sdk?.run) {
      return null;
    }

    const agent = new sdk.Agent({
      name: params.agentName,
      instructions: params.instructions,
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
    });

    const result = await sdk.run(agent, params.userMessage);

    const text =
      result?.finalOutput ??
      result?.outputText ??
      result?.response?.output_text ??
      "Agents SDK returned no output text.";

    return { text };
  } catch {
    return null;
  }
}
