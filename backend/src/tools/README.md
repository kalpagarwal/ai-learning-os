# Tools Module

## Purpose

Expose deterministic functions agents can call during reasoning.

## Request flow

1. Tool schemas are passed to model.
2. Model requests function call.
3. Local handler runs and returns structured output.
4. Output is sent back to model for final answer.

## Why this exists

Tool calling blends LLM reasoning with real system capabilities (search, retrieval, user history, roadmap generation).

## Connections

- Registered in `tools/index.ts`
- Executed by `services/responsesToolRunner.ts`
- Traces persisted by orchestrator into memory tables
