import { useState } from "react"

export default function Sidebar({ sessions, currentSessionId }) {
  const [expandedId, setExpandedId] = useState(null)

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  function truncateName(name, max = 28) {
    return name.length > max ? name.slice(0, max) + "..." : name
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
      <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, paddingLeft: 8 }}>
        Past Sessions
      </p>

      {sessions.length === 0 && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 8 }}>No sessions yet</p>
      )}

      {sessions.map(session => {
        const isActive = session.session_id === currentSessionId
        const isExpanded = expandedId === session.session_id

        return (
          <div
            key={session.session_id}
            onClick={() => setExpandedId(isExpanded ? null : session.session_id)}
            style={{
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 4,
              cursor: "pointer",
              background: isActive ? "var(--accent)" : isExpanded ? "var(--bg)" : "transparent",
              border: "0.5px solid",
              borderColor: isActive ? "var(--accent)" : isExpanded ? "var(--border)" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            {/* Filename row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>📄</span>
              <span style={{
                fontSize: 12,
                fontWeight: 500,
                color: isActive ? "var(--accent-text)" : "var(--text-primary)",
                lineHeight: 1.3,
              }}>
                {truncateName(session.filename)}
              </span>
            </div>

            {/* Expanded info */}
            {isExpanded && !isActive && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                  📅 {formatDate(session.created_at)}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0", wordBreak: "break-all" }}>
                  🔑 {session.session_id.slice(0, 16)}...
                </p>
              </div>
            )}

            {/* Active session expanded info */}
            {isActive && (
              <div style={{ marginTop: 6 }}>
                <p style={{ fontSize: 11, color: "var(--accent-text)", opacity: 0.75, margin: 0 }}>
                  {formatDate(session.created_at)} · active
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}