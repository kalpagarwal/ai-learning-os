import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function makePdf(filePath: string, title: string, lines: string[]) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText(title, {
    x: 50,
    y: 780,
    size: 20,
    font,
    color: rgb(0.1, 0.2, 0.4)
  });

  let y = 740;
  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    y -= 22;
  }

  const bytes = await pdf.save();
  await fs.writeFile(filePath, bytes);
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sampleDir = path.resolve(__dirname, "../samples");
  await fs.mkdir(sampleDir, { recursive: true });

  await makePdf(path.join(sampleDir, "rag-fundamentals.pdf"), "RAG Fundamentals", [
    "Retrieval-Augmented Generation (RAG) grounds LLM answers in external knowledge.",
    "Ingestion steps: parse document, chunk text, embed chunks, index in vector DB.",
    "Retrieval steps: embed query, search vectors, rerank, assemble context.",
    "Generation step: inject context and ask model to answer with evidence."
  ]);

  await makePdf(path.join(sampleDir, "agents-and-tools.pdf"), "Agents and Tools", [
    "Agents are role-specific LLM workers coordinated by an orchestrator.",
    "Tool calling lets models request deterministic operations.",
    "Common tools: retrieval, web search, profile history, roadmap generation.",
    "Observability should track each tool call and timing data."
  ]);

  console.log(`Sample PDFs generated in ${sampleDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
