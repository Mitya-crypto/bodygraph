'use client'

import { useEffect, useState } from 'react'

interface TelegramWebAppProps {
  children: React.ReactNode
}

export function TelegramWebApp({ children }: TelegramWebAppProps) {
  const [isClient, setIsClient] = useState(false)
  const [isTelegramReady, setIsTelegramReady] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Wait for Telegram WebApp to be ready
    const checkTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        setIsTelegramReady(true)
        
        // Prevent Telegram from adding viewport styles
        const html = document.documentElement
        if (html) {
          html.style.setProperty('--tg-viewport-height', '100vh', 'important')
          html.style.setProperty('--tg-viewport-stable-height', '100vh', 'important')
        }
      } else {
        // If not in Telegram, proceed anyway
        setIsTelegramReady(true)
      }
    }

    // Check immediately and after a short delay
    checkTelegram()
    const timer = setTimeout(checkTelegram, 200)
    
    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch by only rendering on client
  if (!isClient || !isTelegramReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-cosmic-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="cosmic-title text-2xl">Loading Cosmic Data...</h2>
          <p className="cosmic-text mt-2">Preparing your astrological journey</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
