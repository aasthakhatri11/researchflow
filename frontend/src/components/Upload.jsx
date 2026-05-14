import { useState } from "react"

export default function Upload({ onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(file) {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file")
      return
    }
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      onUpload(data.session_id, data.filename)
    } catch {
      setError("Upload failed. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 20 }}>

      {/* Eyebrow */}
      <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Research smarter
      </span>

      {/* Heading */}
      <h2 style={{ fontSize: 26, fontWeight: 500, color: "var(--text-primary)", textAlign: "center", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
        Ask anything about<br/>your research papers
      </h2>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.65, maxWidth: 360, marginBottom: 8 }}>
        Upload a paper and ask questions. Archie searches your document first — and the web when he needs to.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => document.getElementById("fileInput").click()}
        style={{
          width: "100%",
          border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 16,
          padding: "36px 24px 28px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          background: dragging ? "var(--green-light)" : "var(--bg-card)",
          transition: "all 0.2s",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v10M10 3L6 7M10 3l4 4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 15h12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {loading ? (
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Uploading and processing...</p>
        ) : (
          <>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Drop your PDF here</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>research papers, books, reports — any PDF</p>
            <button
              style={{
                background: "var(--accent)", color: "var(--accent-text)", border: "none",
                borderRadius: 8, padding: "9px 22px", fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", marginTop: 4
              }}
            >
              Choose file
            </button>
          </>
        )}
      </div>

      <input id="fileInput" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

      {error && <p style={{ fontSize: 12, color: "#C0392B" }}>{error}</p>}

      {/* Feature cards */}
      <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 8 }}>
        {[
          { dot: "#1D9E75", label: "Document Q&A", desc: "Cited answers from your paper" },
          { dot: "#BA7517", label: "Web fallback", desc: "Searches web when unsure" },
          { dot: "#6C6FE8", label: "Multi-paper", desc: "Compare across documents" },
        ].map((f) => (
          <div key={f.label} style={{
            flex: 1, background: "var(--bg-card)", border: "0.5px solid var(--border)",
            borderRadius: 10, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 5
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.dot, marginBottom: 2 }}/>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{f.label}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}