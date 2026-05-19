# Frontend

## Purpose

Provide a minimal but complete UI for interacting with every backend capability.

## Request flow

- Upload panel -> `/api/ingest/pdf`
- Chat panel -> `/api/chat`
- Roadmap panel -> `/api/roadmap/generate`
- Quiz panel -> `/api/quiz/generate` + `/api/quiz/evaluate`
- Debug panels -> `/api/debug/*`

## Why this exists

Transforms backend learning flows into visible UX with retrieval/agent introspection panels.

## Connections

- API client in `src/lib/api.ts`
- Feature panels in `src/components/*`
