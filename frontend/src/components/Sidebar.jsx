import { useState } from "react"

export default function Sidebar({ sessions, currentSessionId, onSelectSession, onSessionsChange }) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState("")
  const [hoveredId, setHoveredId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  function displayName(session) {
    if (session.name) return session.name
    return session.filename.length > 28 ? session.filename.slice(0, 28) + "..." : session.filename
  }

  async function handleRename(sessionId) {
    if (!renameValue.trim()) return
    await fetch(`http://localhost:8000/api/sessions/${sessionId}/rename`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameValue.trim() })
    })
    setRenamingId(null)
    setRenameValue("")
    onSessionsChange()
  }

  async function handleDelete(e, sessionId) {
    e.stopPropagation() // prevent triggering session select
    setDeletingId(sessionId)
    setTimeout(async () => {
      await fetch(`http://localhost:8000/api/sessions/${sessionId}`, { method: "DELETE" })
      setDeletingId(null)
      onSessionsChange()
    }, 300) // wait for fade animation to finish
  }

  function startRename(e, session) {
    e.stopPropagation()
    setRenamingId(session.session_id)
    setRenameValue(session.name || session.filename)
  }

  return (
    <div style={{
      width: 240,
      borderRight: "0.5px solid var(--border)",
      background: "var(--bg-card)",
      overflowY: "auto",
      flexShrink: 0,
      padding: "20px 12px",
    }}>
      <p style={{
        fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
        letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 12, paddingLeft: 8
      }}>
        Past Sessions
      </p>

      {sessions.length === 0 && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 8 }}>No sessions yet</p>
      )}

      {sessions.map(session => {
        const isActive = session.session_id === currentSessionId
        const isHovered = hoveredId === session.session_id
        const isRenaming = renamingId === session.session_id
        const isDeleting = deletingId === session.session_id

        return (
          <div
            key={session.session_id}
            onClick={() => !isRenaming && onSelectSession(session)}
            onMouseEnter={() => setHoveredId(session.session_id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 4,
              cursor: "pointer",
              background: isActive ? "var(--accent)" : isHovered ? "var(--bg)" : "transparent",
              border: "0.5px solid",
              borderColor: isActive ? "var(--accent)" : isHovered ? "var(--border)" : "transparent",
              transition: "all 0.15s ease, opacity 0.3s ease",
              opacity: isDeleting ? 0 : 1,
              transform: isDeleting ? "translateX(-8px)" : "translateX(0)",
            }}
          >
            {/* Name row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: isActive ? "var(--accent-text)" : "var(--text-muted)",
                opacity: isActive ? 0.9 : 0.4,
              }} />

              {isRenaming ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleRename(session.session_id)
                    if (e.key === "Escape") { setRenamingId(null); setRenameValue("") }
                  }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex: 1, fontSize: 12, padding: "2px 6px", borderRadius: 4,
                    border: "0.5px solid var(--accent)", background: "var(--bg)",
                    color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
                  }}
                />
              ) : (
                <span style={{
                  fontSize: 12, fontWeight: 500, flex: 1,
                  color: isActive ? "var(--accent-text)" : "var(--text-primary)",
                  lineHeight: 1.3,
                }}>
                  {displayName(session)}
                </span>
              )}

              {/* Action buttons — show on hover or active */}
              {(isHovered || isActive) && !isRenaming && (
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {/* Rename button */}
                  <button
                    onClick={e => startRename(e, session)}
                    title="Rename"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "2px 4px", borderRadius: 4, lineHeight: 1,
                      color: isActive ? "var(--accent-text)" : "var(--text-muted)",
                      fontSize: 11, opacity: 0.7,
                      transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                  >
                    ✎
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={e => handleDelete(e, session.session_id)}
                    title="Delete"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "2px 4px", borderRadius: 4, lineHeight: 1,
                      color: isActive ? "var(--accent-text)" : "var(--text-muted)",
                      fontSize: 11, opacity: 0.7,
                      transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#e05252" }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = isActive ? "var(--accent-text)" : "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Date — always visible, subtle */}
            <p style={{
              fontSize: 10, color: isActive ? "var(--accent-text)" : "var(--text-muted)",
              opacity: 0.65, margin: "4px 0 0", paddingLeft: 12,
            }}>
              {formatDate(session.created_at)}
            </p>
          </div>
        )
      })}
    </div>
  )
}