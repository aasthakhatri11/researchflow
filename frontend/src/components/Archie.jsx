import { useRef, useState } from "react"

export default function Archie() {
  const [awake, setAwake] = useState(false)
  const [tilt, setTilt] = useState(0)
  const wrapRef = useRef(null)

  function handleMouseEnter() {
    setAwake(true)
  }

  function handleMouseLeave() {
    setAwake(false)
    setTilt(0)
  }

  function handleMouseMove(e) {
    if (!awake) return
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const dx = e.clientX - cx
    setTilt(Math.max(-10, Math.min(10, dx / 5)))
  }

  return (
    <div
      ref={wrapRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ position: "fixed", bottom: 0, left: 16, width: 90, cursor: "pointer", zIndex: 50 }}
    >
      <svg
        viewBox="0 0 90 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 90,
          height: 100,
          transform: awake ? `translateY(-8px) rotate(${tilt}deg)` : "translateY(0px)",
          transition: "transform 0.3s ease"
        }}
      >
        <defs>
          <radialGradient id="bodyGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#4A4A44"/>
            <stop offset="100%" stopColor="#1E1E1C"/>
          </radialGradient>
          <radialGradient id="bellyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#6A6A62"/>
            <stop offset="100%" stopColor="#3A3A36"/>
          </radialGradient>
          <radialGradient id="eyeGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#2DD4A0"/>
            <stop offset="60%" stopColor="#1D9E75"/>
            <stop offset="100%" stopColor="#0A5A40"/>
          </radialGradient>
          <radialGradient id="headGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#3C3C38"/>
            <stop offset="100%" stopColor="#1A1A18"/>
          </radialGradient>
        </defs>

        {/* Body */}
        <ellipse cx="45" cy="78" rx="26" ry="22" fill="url(#bodyGrad)"/>
        <ellipse cx="45" cy="80" rx="16" ry="16" fill="url(#bellyGrad)"/>
        <path d="M37 72 Q45 69 53 72" stroke="#7A7A72" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M35 77 Q45 73 55 77" stroke="#7A7A72" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M36 82 Q45 79 54 82" stroke="#7A7A72" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* Wings */}
        <path d="M20 70 Q12 62 16 80 Q22 90 32 84 Q26 78 24 70 Z" fill="url(#bodyGrad)"/>
        <path d="M70 70 Q78 62 74 80 Q68 90 58 84 Q64 78 66 70 Z" fill="url(#bodyGrad)"/>

        {/* Head */}
        <ellipse cx="45" cy="42" rx="22" ry="24" fill="url(#headGrad)"/>

        {/* Ear tufts */}
        <path d="M32 22 Q28 10 34 16 Q36 12 38 20 Z" fill="#2A2A26"/>
        <path d="M58 22 Q62 10 56 16 Q54 12 52 20 Z" fill="#2A2A26"/>

        {/* Face disc */}
        <ellipse cx="45" cy="46" rx="16" ry="14" fill="#2E2E2A" opacity="0.5"/>

        {/* Sleepy eyes */}
        {!awake && (
          <g>
            <circle cx="37" cy="43" r="7" fill="#0A1A12"/>
            <circle cx="37" cy="43" r="5.5" fill="url(#eyeGrad)"/>
            <circle cx="37" cy="43" r="2.5" fill="#041A0E"/>
            <circle cx="38.5" cy="41.5" r="1.2" fill="white" opacity="0.85"/>
            <path d="M30 43 Q37 38 44 43" fill="#1E1E1C"/>
            <circle cx="53" cy="43" r="7" fill="#0A1A12"/>
            <circle cx="53" cy="43" r="5.5" fill="url(#eyeGrad)"/>
            <circle cx="53" cy="43" r="2.5" fill="#041A0E"/>
            <circle cx="54.5" cy="41.5" r="1.2" fill="white" opacity="0.85"/>
            <path d="M46 43 Q53 38 60 43" fill="#1E1E1C"/>
          </g>
        )}

        {/* Awake eyes */}
        {awake && (
          <g>
            <circle cx="37" cy="43" r="7" fill="#0A1A12"/>
            <circle cx="37" cy="43" r="5.5" fill="url(#eyeGrad)"/>
            <circle cx="37" cy="43" r="2.5" fill="#041A0E"/>
            <circle cx="38.8" cy="41.2" r="1.4" fill="white" opacity="0.9"/>
            <circle cx="53" cy="43" r="7" fill="#0A1A12"/>
            <circle cx="53" cy="43" r="5.5" fill="url(#eyeGrad)"/>
            <circle cx="53" cy="43" r="2.5" fill="#041A0E"/>
            <circle cx="54.8" cy="41.2" r="1.4" fill="white" opacity="0.9"/>
          </g>
        )}

        {/* Glasses */}
        <circle cx="37" cy="43" r="7.5" fill="none" stroke="#9A8458" strokeWidth="0.8" opacity="0.8"/>
        <circle cx="53" cy="43" r="7.5" fill="none" stroke="#9A8458" strokeWidth="0.8" opacity="0.8"/>
        <path d="M44.5 43 L45.5 43" stroke="#9A8458" strokeWidth="0.8"/>
        <path d="M29.5 41.5 L27 40" stroke="#9A8458" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M60.5 41.5 L63 40" stroke="#9A8458" strokeWidth="0.8" strokeLinecap="round"/>

        {/* Beak */}
        <path d="M42 50 L45 55 L48 50 Q45 48 42 50Z" fill="#C49A3C"/>

        {/* Feet */}
        <path d="M36 98 L32 100 M36 98 L36 101 M36 98 L40 100" stroke="#C49A3C" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M54 98 L50 100 M54 98 L54 101 M54 98 L58 100" stroke="#C49A3C" strokeWidth="1.4" strokeLinecap="round"/>

        {/* Zzz when sleepy */}
        {!awake && (
          <g>
            <text x="62" y="30" fontSize="8" fill="#6A6A60" fontFamily="serif" opacity="0.7">z</text>
            <text x="68" y="22" fontSize="10" fill="#6A6A60" fontFamily="serif" opacity="0.5">z</text>
            <text x="75" y="14" fontSize="12" fill="#6A6A60" fontFamily="serif" opacity="0.3">z</text>
          </g>
        )}
      </svg>
      <div style={{ textAlign: "center", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.04em", marginTop: -4 }}>Archie</div>
    </div>
  )
}