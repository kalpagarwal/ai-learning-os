"use client";

import { useState } from "react";
import { getAgentActivity, runRetrievalDebug } from "../lib/api";

export function DebugPanels() {
  const [retrievalQuery, setRetrievalQuery] = useState("What are embeddings?");
  const [retrievalResult, setRetrievalResult] = useState("{}");
  const [conversationId, setConversationId] = useState("");
  const [agentResult, setAgentResult] = useState("{}");

  async function handleRetrieval() {
    const data = await runRetrievalDebug(retrievalQuery);
    setRetrievalResult(JSON.stringify(data, null, 2));
  }

  async function handleAgentActivity() {
    if (!conversationId) {
      setAgentResult("Set a conversation ID from chat first.");
      return;
    }
    const data = await getAgentActivity(conversationId);
    setAgentResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Retrieval Debug Panel</h3>
        <div className="grid">
          <input value={retrievalQuery} onChange={(e) => setRetrievalQuery(e.target.value)} />
          <button onClick={handleRetrieval}>Run Retrieval Debug</button>
          <pre>{retrievalResult}</pre>
        </div>
      </div>
      <div className="card">
        <h3>Agent Activity Panel</h3>
        <div className="grid">
          <input
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Conversation ID from chat"
          />
          <button onClick={handleAgentActivity}>Load Agent Activity</button>
          <pre>{agentResult}</pre>
        </div>
      </div>
    </div>
  );
}
