"use client";

import { useState } from "react";
import { generateRoadmap, getLatestRoadmap } from "../lib/api";

export function RoadmapPanel() {
  const [userId, setUserId] = useState("demo-user");
  const [topic, setTopic] = useState("RAG + Agents in Production");
  const [level, setLevel] = useState("beginner");
  const [result, setResult] = useState<string>("");

  async function handleGenerate() {
    const data = await generateRoadmap({ userId, topic, level });
    setResult(JSON.stringify(data, null, 2));
  }

  async function handleLoadLatest() {
    const data = await getLatestRoadmap(userId);
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="card">
      <h3>Learning Roadmap View</h3>
      <div className="grid">
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="beginner">beginner</option>
          <option value="intermediate">intermediate</option>
          <option value="advanced">advanced</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleGenerate}>Generate Roadmap</button>
          <button onClick={handleLoadLatest}>Load Latest</button>
        </div>
      </div>
      <pre>{result || "No roadmap response yet."}</pre>
    </div>
  );
}
