#!/usr/bin/env bash
set -euo pipefail

cp .env.example .env || true
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run samples:create-pdfs

echo "Setup complete."
echo "Optional next step (requires OPENAI_API_KEY): npm run vectors:seed"
echo "Run apps: npm run dev"
