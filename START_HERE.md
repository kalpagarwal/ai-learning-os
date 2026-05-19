# START_HERE

This guide walks you through the project like an AI systems engineer.

## 1) Where requests enter

- Backend entry: `backend/src/index.ts`
- App setup + middleware: `backend/src/app.ts`
- Route layer: `backend/src/routes/*`

For chat specifically:

- `POST /api/chat` in `backend/src/routes/chatRoutes.ts`

## 2) Where embeddings happen

- `backend/src/rag/embeddingService.ts`
- Uses `openai.embeddings.create(...)`

## 3) Where vector search happens

- `backend/src/rag/retrievalPipeline.ts`
- Query embedding -> Qdrant search -> lightweight reranking

## 4) Where LLM calls happen

- Tool-aware response loop: `backend/src/services/responsesToolRunner.ts`
- Quiz generation/evaluation helper calls: `backend/src/services/quizService.ts`
- Optional OpenAI Agents SDK bridge: `backend/src/agents/agentsSdkBridge.ts`

## 5) Where tools are invoked

- Tool registry: `backend/src/tools/index.ts`
- Tool call loop: `backend/src/services/responsesToolRunner.ts`
- Tool traces persisted in memory DB via `saveToolExecution(...)`

## 6) Where memory loads

- Conversation storage and retrieval: `backend/src/memory/memoryService.ts`
- Learning progress/weak-strong topics: `backend/src/memory/learningProgressService.ts`

## 7) First run checklist

1. `cp .env.example .env`
2. Add `OPENAI_API_KEY` in `.env`
3. `docker compose up -d`
4. `npm install`
5. `npm run db:generate`
6. `npm run db:migrate`
7. `npm run db:seed`
8. `npm run samples:create-pdfs`
9. `npm run dev`

## 8) Try these sample flows

1. Upload `backend/samples/rag-fundamentals.pdf` from `/upload`
2. In chat, ask: `Explain chunking tradeoffs in my uploaded material.`
3. Ask: `Create a 6-week roadmap for learning production RAG.`
4. Ask: `Generate a quiz on vector search.`
5. Open debug panels and inspect retrieved chunks + tool traces.

## 9) Key mental model

This system is intentionally explicit:

- RAG pipeline is separate from agent orchestration.
- Agents are role-based wrappers around LLM + tools.
- Memory is persisted in PostgreSQL and fed back into planning/teaching.
- Debug data is returned so you can inspect AI decisions.
