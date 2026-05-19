# Backend

## Purpose

Expose APIs for ingestion, chat, roadmap, quiz, and debugging while coordinating RAG, agents, tools, and memory.

## Request flow

1. Express route receives request.
2. Input is validated.
3. Relevant pipeline/service executes.
4. Observability logs timing and events.
5. Response includes useful debug metadata.

## Why this component exists

Keeps AI orchestration on server side where we can safely manage keys, memory, and tool access.

## Connection map

- `routes/` -> entrypoints
- `orchestration/` -> agent coordination
- `rag/` -> knowledge retrieval
- `memory/` -> learner state
- `tools/` -> callable capabilities

## API surface

- `GET /health`
- `POST /api/ingest/pdf`
- `POST /api/chat`
- `POST /api/roadmap/generate`
- `GET /api/roadmap/:userId/latest`
- `POST /api/quiz/generate`
- `POST /api/quiz/evaluate`
- `GET /api/debug/retrieval`
- `GET /api/debug/agent-activity/:conversationId`
- `GET /api/debug/progress/:userId`
- `GET /api/debug/learning-profile/:userId`
