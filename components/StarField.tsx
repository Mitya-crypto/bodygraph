'use client'

import { useEffect, useRef } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log('🚀 StarField: useEffect triggered')
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('❌ StarField: Canvas not found')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('❌ StarField: Canvas context not found')
      return
    }

    console.log('✅ StarField: Initializing star field animation')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      console.log('📏 StarField: Canvas resized to', canvas.width, 'x', canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create stars
    const stars: Array<{
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      twinkleSpeed: number
    }> = []

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      stars.forEach((star, index) => {
        // Update star position
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        // Twinkling effect
        const twinkle = Math.sin(time * 10 + index) * 0.5 + 0.5
        const opacity = star.opacity * twinkle

        // Draw star
        ctx.save()
        ctx.globalAlpha = opacity
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = star.size * 2
        ctx.shadowColor = '#0ea5e9'
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw constellation lines (occasionally)
      if (Math.random() < 0.1) {
        const star1 = stars[Math.floor(Math.random() * stars.length)]
        const star2 = stars[Math.floor(Math.random() * stars.length)]
        const distance = Math.sqrt(
          Math.pow(star2.x - star1.x, 2) + Math.pow(star2.y - star1.y, 2)
        )

        if (distance < 150) {
          ctx.save()
          ctx.globalAlpha = 0.3
          ctx.strokeStyle = '#0ea5e9'
          ctx.lineWidth = 1
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.moveTo(star1.x, star1.y)
          ctx.lineTo(star2.x, star2.y)
          ctx.stroke()
          ctx.restore()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    console.log('🚀 StarField: Starting animation with', stars.length, 'stars')
    animate()

    return () => {
      console.log('🧹 StarField: Cleaning up animation')
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  console.log('🎨 StarField: Rendering canvas')
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1"
      style={{ 
        background: 'transparent',
        border: '1px solid rgba(255, 0, 0, 0.3)' // Временная красная граница для отладки
      }}
    />
  )
}
