# AGENTS

## What agents are in this project

Agents are role-specific prompt + tool bundles, coordinated by one orchestrator.

- `TutorAgent`: teaching explanations
- `PlannerAgent`: roadmap generation
- `QuizAgent`: MCQ generation behavior
- `ResearchAgent`: external comparison/research behavior

## Orchestration loop

```text
1) Router picks an agent based on user intent keywords.
2) Retrieval context is prepared first.
3) Selected agent runs with role prompt + context.
4) Responses API tool loop executes function calls.
5) Tool outputs are fed back to model until final answer.
6) Agent/tool traces are logged and saved.
```

## Tool calling lifecycle

Implemented in `backend/src/services/responsesToolRunner.ts`:

1. Send model request with tool schemas.
2. Parse function call outputs.
3. Execute matching local tool handler.
4. Return `function_call_output` back to model.
5. Repeat until no further tool calls.

## OpenAI Agents SDK usage

- Optional SDK bridge: `backend/src/agents/agentsSdkBridge.ts`
- Controlled by `USE_AGENTS_SDK=true`
- Why optional: keeps project runnable even if learners want to focus first on raw response/tool loops.

## Why this component exists

Without clear agent boundaries, all behavior gets mixed into one giant prompt. This module teaches how to compose specialized AI workers while preserving a simple codebase.
