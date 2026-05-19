# RAG Module

## Purpose

Handle document ingestion and retrieval for grounded answers.

## Request flow

- Ingestion route calls `ingestPdf(...)`:
  parse PDF -> chunk -> embed -> index in Qdrant -> store chunk rows in PostgreSQL.
- Chat/debug retrieval calls `retrieveRelevantChunks(...)`:
  embed query -> vector search -> rerank -> assemble context.

## Why this exists

Separates knowledge processing from agent prompting so retrieval quality can be improved independently.

## Connections

- Used by tools (`pdf_retrieval`)
- Used directly by orchestrator before agent run
- Emits debug context returned to frontend panel
