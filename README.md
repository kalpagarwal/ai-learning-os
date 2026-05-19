# AI Learning Operating System (Node.js + TypeScript)

An educational, end-to-end AI engineering project that demonstrates:

- Document ingestion + chunking + embeddings
- Vector search RAG with Qdrant
- Conversational Q&A using OpenAI Responses API
- Multi-agent orchestration with OpenAI Agents SDK
- Learning memory in PostgreSQL (Prisma)
- Quiz generation and progress tracking
- Tool calling + agent traces
- Simple observability and debug panels

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Start infra:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Run database setup:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Generate sample PDFs:

```bash
npm run samples:create-pdfs
```

6. (Optional) seed sample vector data:

```bash
npm run vectors:seed
```

7. Start apps:

```bash
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Demo user ID: `demo-user`

## Documentation Map

- [START_HERE.md](./START_HERE.md): beginner walkthrough
- [ARCHITECTURE.md](./ARCHITECTURE.md): system architecture and flows
- [RAG_FLOW.md](./RAG_FLOW.md): ingestion + retrieval details
- [AGENTS.md](./AGENTS.md): agent roles and orchestration
- [MEMORY.md](./MEMORY.md): memory architecture and strategy
- [docs/REQUEST_SEQUENCES.md](./docs/REQUEST_SEQUENCES.md): end-to-end sequence walkthroughs

## Folder Structure

```text
backend/      # API, RAG, agents, tools, memory, orchestration
frontend/     # Next.js UI
scripts/      # setup helpers
docs/         # extra diagrams and references
```

## Educational Design Principles

- Keep each module small and explicit.
- Favor readable request flows over abstract frameworks.
- Add comments where AI behavior can be confusing.
- Include debug data in API responses when possible.

## Sample prompts

- `Explain RAG with examples from my uploaded PDF.`
- `Create a beginner roadmap for production AI systems.`
- `Generate a 5-question quiz on vector search.`
- `Research recent best practices for evaluation in RAG pipelines.`
