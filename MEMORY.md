# MEMORY

## Memory architecture

Memory is stored in PostgreSQL via Prisma.

Main memory types:

- Conversation memory: `Conversation`, `Message`
- Learning profile memory: `LearningTopic` (weak/medium/strong)
- Progress memory: `QuizAttempt`
- Execution memory: `AgentExecution`, `ToolExecution`

## Storage model

```text
User
  -> Conversations
    -> Messages
  -> LearningTopics (strength + confidence)
  -> LearningRoadmaps
  -> QuizAttempts
```

## Retrieval strategy

- Chat route loads/creates conversation by ID.
- Learning tools fetch profile and recent messages for personalization.
- Quiz evaluation updates topic confidence and strength.

## Weak/strong topic tracking

- Confidence comes from quiz scores (`score / total`).
- Topic strength mapping:
  - `<0.45` => `WEAK`
  - `0.45-0.74` => `MEDIUM`
  - `>=0.75` => `STRONG`

## Why memory exists

RAG answers questions about documents, but memory helps tailor *how* the system teaches. This is the difference between pure retrieval and adaptive tutoring.
