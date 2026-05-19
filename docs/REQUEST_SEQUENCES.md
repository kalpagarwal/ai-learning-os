# Request Sequences

## Sequence A: PDF Ingestion

```text
User -> UI Upload Panel -> POST /api/ingest/pdf
  -> ingestPdf(filePath, title)
  -> parsePdf
  -> chunkText
  -> embedTexts
  -> qdrant upsert
  -> postgres chunk rows
  -> response with {documentId, chunkCount, timingMs}
```

## Sequence B: Conversational Q&A

```text
User -> UI Chat Panel -> POST /api/chat
  -> save user message
  -> retrieveRelevantChunks
  -> runOrchestrator
    -> pick agent
    -> run tool loop
    -> save tool executions
    -> save agent execution
  -> save assistant message with retrieval/tool metadata
  -> return answer + debug payload
```

## Sequence C: Quiz + Progress Update

```text
User -> UI Quiz Panel -> POST /api/quiz/generate
  -> OpenAI structured generation
User answers -> POST /api/quiz/evaluate
  -> score answers
  -> save QuizAttempt
  -> update LearningTopic confidence/strength
  -> return evaluation + progress
```
