# RAG_FLOW

## Ingestion flow

```mermaid
flowchart LR
  Upload["PDF Upload"] --> Parse["pdf-parse"]
  Parse --> Chunk["Chunking with overlap"]
  Chunk --> Embed["OpenAI Embeddings"]
  Embed --> Index["Qdrant Upsert"]
  Chunk --> ChunkDB["Store chunks in PostgreSQL"]
```

## Retrieval flow

```mermaid
flowchart LR
  Query["User Query"] --> QueryEmbed["Embed query"]
  QueryEmbed --> VecSearch["Qdrant semantic search"]
  VecSearch --> Rerank["Vector score + lexical bonus"]
  Rerank --> Context["Assemble context text"]
  Context --> LLM["Injected into agent prompt"]
```

## Chunking strategy

- Paragraph-aware chunks with overlap.
- Defaults: `maxChars=900`, `overlapChars=120`.
- Why: keep chunks readable and context-preserving without heavy preprocessing.

## Embeddings

- Embedding model configured by `OPENAI_EMBED_MODEL`.
- Batched embedding requests for efficiency.
- Vector dimension discovered from first embedding response.

## Retrieval and reranking

- Primary signal: cosine similarity from Qdrant.
- Secondary signal: lexical overlap bonus.
- Combined score used to improve beginner-friendly relevance.

## Context assembly

- Top chunks are formatted with scores.
- Combined into one explicit context string.
- Context is injected into selected agent prompt.

## Educational note

This project keeps reranking simple to make reasoning visible. In production, you might replace this with a dedicated reranker model, metadata filters, and citation extraction.
