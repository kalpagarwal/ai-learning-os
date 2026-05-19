# Services Module

## Purpose

Hold reusable AI/API service logic (OpenAI client, tool loop, roadmap, quiz, queue).

## Request flow

Routes call services for business logic and external API interactions.

## Why this exists

Keeps route handlers focused on HTTP concerns and keeps workflows reusable.

## Connections

- `responsesToolRunner.ts` bridges agents <-> tools
- `quizService.ts` and `roadmapService.ts` power product features
- `ingestQueue.ts` provides optional background ingestion
