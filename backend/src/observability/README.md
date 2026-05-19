# Observability Module

## Purpose

Provide readable logs and timing metrics for key AI steps.

## Request flow

- Request middleware logs HTTP traffic.
- Pipelines and orchestrator log durations.
- Tool and agent execution are persisted for later inspection.

## Why this exists

AI systems are hard to debug without traceability. This module makes behavior visible.

## Connections

Used by ingestion, retrieval, services, and orchestrator modules.
