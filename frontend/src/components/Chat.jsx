import { useState, useEffect } from "react"

export default function Chat({ sessionId, filename, onReset, onFirstMessage }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Load chat history when session changes
  useEffect(() => {
    if (!sessionId) return
    setMessages([])
    fetch(`http://localhost:8000/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map(m => ({
            role: m.role,
            content: m.content,
            source: m.meta?.source,
            confidence: m.meta?.confidence,
          })))
        }
      })
  }, [sessionId])

  async function sendMessage() {
    if (!input.trim()) return
    const isFirst = messages.length === 0
    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, query: input }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        source: data.source,
        confidence: data.confidence,
      }])

      // Tell sidebar to refresh after first message so auto-name appears
      if (isFirst && onFirstMessage) onFirstMessage()

    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Chatting with</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>{filename}</p>
        </div>
        <button
          onClick={onReset}
          style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          ← Upload new
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: 48 }}>
            Ask anything about your document
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "var(--accent)" : "var(--bg-card)",
              color: m.role === "user" ? "var(--accent-text)" : "var(--text-primary)",
              border: m.role === "user" ? "none" : "0.5px solid var(--border)",
            }}>
              {m.content}
              {m.source && (
                <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 20,
                    background: m.source === "web" ? "#FDF0DC" : "#E1F0E6",
                    color: m.source === "web" ? "#7A4A0A" : "#1C5C32",
                  }}>
                    {m.source === "web" ? "Web" : "Document"}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>confidence: {m.confidence}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              background: "var(--bg-card)", border: "0.5px solid var(--border)",
              padding: "10px 14px", borderRadius: "14px 14px 14px 3px",
              fontSize: 13, color: "var(--text-muted)"
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, paddingRight: 80 }}>
        <input
          style={{
            flex: 1, background: "var(--bg-card)", border: "0.5px solid var(--border)",
            borderRadius: 12, padding: "14px 18px", fontSize: 14,
            color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
          }}
          placeholder="Ask a question about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: "var(--accent)", color: "var(--accent-text)", border: "none",
            borderRadius: 12, padding: "14px 22px", fontSize: 14,
            cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}