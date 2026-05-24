import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"

export default function Chat({ sessionId, filename, onReset, onFirstMessage }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

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
      if (isFirst && onFirstMessage) onFirstMessage()
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  console.log("Key:", import.meta.env.VITE_GROQ_API_KEY)
  async function handleExport() {
    if (messages.length === 0) return
    setExporting(true)

    try {
      // Step 1 — ask Groq to generate a summary based on the conversation
      const transcript = messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => `${m.role === "user" ? "User" : "ResearchFlow"}: ${m.content}`)
        .join("\n\n")

      const summaryRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a research assistant. Based on the conversation below, write a concise summary (5-8 sentences) of the key findings and topics discussed about the document. Be factual and clear."
            },
            {
              role: "user",
              content: transcript
            }
          ],
          temperature: 0.2,
        })
      })

      const summaryData = await summaryRes.json()
      const summary = summaryData.choices[0].message.content

      // Step 2 — build the PDF
      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 48
      const contentWidth = pageWidth - margin * 2
      let y = margin

      function addText(text, fontSize, color, bold = false, extraGap = 0) {
        doc.setFontSize(fontSize)
        doc.setTextColor(...color)
        doc.setFont("helvetica", bold ? "bold" : "normal")
        const lines = doc.splitTextToSize(text, contentWidth)
        lines.forEach(line => {
          if (y + fontSize + 4 > pageHeight - margin) {
            doc.addPage()
            y = margin
          }
          doc.text(line, margin, y)
          y += fontSize + 4
        })
        y += extraGap
      }

      function addDivider() {
        if (y + 20 > pageHeight - margin) { doc.addPage(); y = margin }
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageWidth - margin, y)
        y += 16
      }

      // Title
      addText("ResearchFlow — Export", 20, [28, 58, 47], true, 4)
      addText(`Document: ${filename}`, 11, [120, 116, 104], false, 2)
      addText(`Exported: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 11, [120, 116, 104], false, 16)

      addDivider()

      // Summary section
      addText("Summary", 15, [28, 58, 47], true, 8)
      addText(summary, 11, [40, 40, 40], false, 16)

      addDivider()

      // Transcript section
      addText("Chat Transcript", 15, [28, 58, 47], true, 8)

      messages.forEach(m => {
        if (m.role === "user") {
          addText("You", 10, [108, 111, 232], true, 2)
          addText(m.content, 11, [40, 40, 40], false, 4)
          if (m.source) {
            addText(`Source: ${m.source} · Confidence: ${m.confidence}`, 9, [154, 148, 136], false, 0)
          }
        } else {
          addText("ResearchFlow", 10, [28, 92, 50], true, 2)
          addText(m.content, 11, [40, 40, 40], false, 4)
          if (m.source) {
            addText(`Source: ${m.source} · Confidence: ${m.confidence}`, 9, [154, 148, 136], false, 0)
          }
        }
        y += 10
      })

      // Save
      const safeName = filename.replace(/\.pdf$/i, "")
      doc.save(`${safeName}_researchflow.pdf`)

    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setExporting(false)
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {messages.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                fontSize: 12, color: "var(--accent)", background: "none",
                border: "0.5px solid var(--accent)", borderRadius: 7,
                padding: "5px 12px", cursor: "pointer", fontFamily: "inherit",
                opacity: exporting ? 0.5 : 1, transition: "opacity 0.15s ease"
              }}
            >
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
          )}
          <button
            onClick={onReset}
            style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            ← Upload new
          </button>
        </div>
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