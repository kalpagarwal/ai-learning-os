"use client";

import { useState } from "react";
import { uploadPdf } from "../lib/api";

export function PdfUploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string>("");

  async function handleUpload() {
    if (!file) {
      setStatus("Pick a PDF first.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("title", title || file.name);

    setStatus("Uploading and ingesting...");
    try {
      const result = await uploadPdf(form);
      setStatus(`Done. Document ${result.documentId} indexed with ${result.chunkCount} chunks.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <div className="card">
      <h3>PDF Upload</h3>
      <p className="muted">Upload a learning PDF to trigger parsing, chunking, embedding, and indexing.</p>
      <div className="grid">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional display title" />
        <button onClick={handleUpload}>Ingest PDF</button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}
