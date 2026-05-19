# Agents Module

## Purpose

Define role-specific AI workers (Tutor, Planner, Quiz, Research).

## Request flow

1. Orchestrator selects agent.
2. Agent builds role prompt + retrieved context.
3. Agent runs tool loop via Responses API.
4. Optional: Agents SDK path if enabled.

## Why this exists

Makes behavior composable and easy to reason about instead of one monolithic assistant prompt.

## Connections

- Invoked by `orchestration/agentOrchestrator.ts`
- Uses `tools/` and `services/responsesToolRunner.ts`
- Writes traces through `memory/`
