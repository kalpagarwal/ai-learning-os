# Orchestration Module

## Purpose

Coordinate multi-agent execution in a transparent sequence.

## Request flow

1. Pick agent by intent.
2. Run retrieval pipeline.
3. Invoke selected agent with context.
4. Persist agent/tool traces.
5. Return answer + debug metadata.

## Why this exists

Centralizes cross-agent workflow logic and keeps agent files focused on role behavior.

## Connections

- Depends on `rag/`, `agents/`, and `memory/`
- Called by chat route
