import { useRef, useState, useEffect } from "react"
import archieSleep from "../assets/archie-sleep.png"
import archieIdle from "../assets/archie-idle.png"
import archieAwake from "../assets/archie-awake.png"

export default function Archie() {
  const [state, setState] = useState("sleep") // sleep, idle, awake
  const [tilt, setTilt] = useState(0)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleMouseMove(e) {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 100) {
        setState("awake")
        setTilt(Math.max(-12, Math.min(12, dx / 8)))
      } else if (dist < 220) {
        setState("idle")
        setTilt(Math.max(-6, Math.min(6, dx / 16)))
      } else {
        setState("sleep")
        setTilt(0)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const src = state === "sleep" ? archieSleep : state === "idle" ? archieIdle : archieAwake

  return (
    <div
      ref={wrapRef}
      style={{ position: "fixed", bottom: 0, right: 20, width: 100, zIndex: 50 }}
    >
      <img
        src={src}
        alt="Archie"
        style={{
          width: 100,
          height: 120,
          objectFit: "contain",
          transform: `rotate(${tilt}deg) translateY(${state === "awake" ? -10 : state === "idle" ? -4 : 0}px)`,
          transition: "transform 0.2s ease, opacity 0.3s ease",
          mixBlendMode: "screen",
          filter: state === "awake"
            ? "drop-shadow(0 0 12px rgba(108,111,232,0.5))"
            : "none",
        }}
      />
      <div style={{
        textAlign: "center", fontSize: 9,
        color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: -8
      }}>
        Archie
      </div>
    </div>
  )
}