"use client";

import { useState } from "react";
import { sendChat } from "../lib/api";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel() {
  const [userId, setUserId] = useState("demo-user");
  const [conversationId, setConversationId] = useState<string>("");
  const [message, setMessage] = useState("Explain retrieval-augmented generation using my uploaded docs.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [agent, setAgent] = useState<string>("");
  const [retrievalJson, setRetrievalJson] = useState<string>("");
  const [toolJson, setToolJson] = useState<string>("");
  const [stepJson, setStepJson] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      const response = await sendChat({
        userId,
        conversationId: conversationId || undefined,
        message
      });

      setConversationId(response.conversationId);
      setAgent(response.agent);
      setRetrievalJson(JSON.stringify(response.retrieval, null, 2));
      setToolJson(JSON.stringify(response.toolCalls, null, 2));
      setStepJson(JSON.stringify(response.steps, null, 2));
      setMessages((prev) => [...prev, { role: "assistant", content: response.answer }]);
      setMessage("");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Chat failed";
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Conversational Q&A</h3>
        <p className="muted">This endpoint runs retrieval + orchestrator + selected agent + tool loop.</p>
        <div className="grid" style={{ marginBottom: 12 }}>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID or email" />
          <input
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Conversation ID (optional)"
          />
        </div>

        <div style={{ minHeight: 220, marginBottom: 12, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 8, padding: 12 }}>
          {messages.map((msg, idx) => (
            <p key={idx}>
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
            </p>
          ))}
        </div>

        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
          {agent && <p>Active agent: <strong>{agent}</strong></p>}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Retrieval Debug Panel</h3>
          <p className="muted">Shows retrieved chunks, scores, and injected context.</p>
          <pre>{retrievalJson || "No retrieval yet."}</pre>
        </div>
        <div className="card">
          <h3>Agent Activity Panel</h3>
          <p className="muted">Shows active agent, execution steps, and tool calls.</p>
          <pre>
            {JSON.stringify(
              {
                agent,
                steps: stepJson ? JSON.parse(stepJson) : [],
                toolCalls: toolJson ? JSON.parse(toolJson) : []
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
