import fs from "node:fs/promises";
import pdf from "pdf-parse";

export async function parsePdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const parsed = await pdf(buffer);
  return parsed.text?.trim() ?? "";
}
