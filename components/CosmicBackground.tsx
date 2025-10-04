'use client'

import { useEffect, useRef } from 'react'

export function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating planets
    const planets = [
      { size: 60, color: '#fbbf24', x: 20, y: 30, speed: 0.5 },
      { size: 40, color: '#ef4444', x: 80, y: 20, speed: 0.3 },
      { size: 35, color: '#8b5cf6', x: 15, y: 70, speed: 0.4 },
      { size: 50, color: '#06b6d4', x: 85, y: 60, speed: 0.6 },
    ]

    planets.forEach((planet, index) => {
      const planetEl = document.createElement('div')
      planetEl.className = 'planet absolute'
      planetEl.style.cssText = `
        width: ${planet.size}px;
        height: ${planet.size}px;
        background: radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}dd);
        left: ${planet.x}%;
        top: ${planet.y}%;
        animation: float ${6 + index}s ease-in-out infinite;
        animation-delay: ${index * 0.5}s;
        z-index: 1;
      `
      container.appendChild(planetEl)
    })

    // Create orbit rings
    const rings = [
      { size: 200, delay: 0 },
      { size: 300, delay: 2 },
      { size: 400, delay: 4 },
    ]

    rings.forEach((ring, index) => {
      const ringEl = document.createElement('div')
      ringEl.className = 'orbit-ring absolute'
      ringEl.style.cssText = `
        width: ${ring.size}px;
        height: ${ring.size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: orbit ${20 + index * 5}s linear infinite;
        animation-delay: ${ring.delay}s;
        z-index: 0;
      `
      container.appendChild(ringEl)
    })

    return () => {
      // Cleanup will be handled by React
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 nebula-bg"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, #d946ef 0%, #86198f 30%, transparent 70%),
          radial-gradient(ellipse at 80% 80%, #0ea5e9 0%, #0369a1 30%, transparent 70%),
          radial-gradient(ellipse at 50% 50%, #fbbf24 0%, #f59e0b 20%, transparent 60%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `
      }}
    />
  )
}
