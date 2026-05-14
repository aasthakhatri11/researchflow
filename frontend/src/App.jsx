import { useState, useEffect } from "react"
import Upload from "./components/Upload"
import Chat from "./components/Chat"
import Archie from "./components/Archie"

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [filename, setFilename] = useState(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", borderBottom: "0.5px solid var(--border)" }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="7" r="3" fill="var(--accent-text)" opacity="0.9"/>
            <path d="M4 13 Q8 10 12 13" stroke="var(--accent-text)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>ResearchFlow</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Hybrid Research Assistant</span>
        <button
          onClick={() => setDark(d => !d)}
          style={{
            border: "0.5px solid var(--border)", borderRadius: 7, padding: "5px 12px",
            fontSize: 11, cursor: "pointer", background: "transparent",
            color: "var(--text-secondary)", fontFamily: "inherit", marginLeft: 12
          }}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 100px" }}>
        {!sessionId ? (
          <Upload onUpload={(id, name) => { setSessionId(id); setFilename(name) }} />
        ) : (
          <Chat sessionId={sessionId} filename={filename} onReset={() => setSessionId(null)} />
        )}
      </div>

      <Archie />
    </div>
  )
}