# Memory Module

## Purpose

Persist conversation and learning progress for personalization.

## Request flow

- Chat route stores user and assistant messages.
- Tools can load profile/history for context.
- Quiz evaluation updates topic confidence and strength.

## Why this exists

Learners should get adaptive guidance, not stateless generic responses.

## Connections

- Reads/writes via Prisma (`db/prisma.ts`)
- Used by chat, quiz, roadmap, and tools
- Supports debug/progress endpoints
