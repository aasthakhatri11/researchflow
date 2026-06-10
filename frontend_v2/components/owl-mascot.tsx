'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

type ArchieState = 'sleep' | 'idle' | 'awake'

export function OwlMascot() {
  const [state, setState] = useState<ArchieState>('sleep')
  const [tilt, setTilt] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 100) {
        setState('awake')
        setTilt(Math.max(-12, Math.min(12, dx / 8)))
      } else if (dist < 220) {
        setState('idle')
        setTilt(Math.max(-6, Math.min(6, dx / 16)))
      } else {
        setState('sleep')
        setTilt(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const src =
    state === 'sleep'
      ? '/archie-sleep.png'
      : state === 'idle'
      ? '/archie-idle.png'
      : '/archie-awake.png'

  const translateY =
    state === 'awake' ? -10 : state === 'idle' ? -4 : 0

  return (
    <div
      ref={wrapRef}
      style={{ position: 'fixed', bottom: 0, right: 20, width: 100, zIndex: 50 }}
    >
      <Image
        src={src}
        alt="Archie"
        width={100}
        height={120}
        style={{
          objectFit: 'contain',
          transform: `rotate(${tilt}deg) translateY(${translateY}px)`,
          transition: 'transform 0.2s ease, opacity 0.3s ease',
          mixBlendMode: 'screen',
          // Brighten slightly in light mode so Archie doesn't look like a shadow
          filter:
            state === 'awake'
              ? 'drop-shadow(0 0 12px rgba(180,100,60,0.45)) brightness(var(--archie-brightness, 1))'
              : 'brightness(var(--archie-brightness, 1))',
        }}
        priority
      />
      <div
        style={{
          textAlign: 'center',
          fontSize: 9,
          color: 'var(--muted-foreground)',
          letterSpacing: '0.05em',
          marginTop: -8,
        }}
      >
        Archie
      </div>
    </div>
  )
}