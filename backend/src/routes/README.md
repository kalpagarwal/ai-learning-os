# Routes Module

## Purpose

Define HTTP entrypoints for frontend and API clients.

## Request flow

- `/api/ingest/pdf`: file upload ingestion
- `/api/chat`: orchestrated conversational flow
- `/api/roadmap/*`: roadmap generation/load
- `/api/quiz/*`: quiz generation/evaluation
- `/api/debug/*`: retrieval and agent diagnostics

## Why this exists

Gives a clear and inspectable boundary from UI to backend logic.

## Connections

Routes call orchestration/services/memory modules and return typed JSON payloads.
