export type ToolContext = {
  userId?: string;
  conversationId?: string;
};

export type ToolHandler = (input: Record<string, unknown>, context: ToolContext) => Promise<unknown>;

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: ToolHandler;
};
