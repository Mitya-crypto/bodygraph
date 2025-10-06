'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface TelegramContextType {
  webApp: any
  user: any
  initData: string
  isReady: boolean
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  initData: '',
  isReady: false,
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [initData, setInitData] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Delay Telegram WebApp initialization to prevent hydration issues
    const initTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp
        setWebApp(tg)
        setUser(tg.initDataUnsafe?.user)
        setInitData(tg.initData)
        setIsReady(true)
        
        // Configure WebApp
        // Note: ready() is not a function in Telegram WebApp API
        if (tg.expand) tg.expand()
        if (tg.enableClosingConfirmation) tg.enableClosingConfirmation()
        
        // Set theme
        tg.setHeaderColor('#0f172a')
        tg.setBackgroundColor('#0f172a')
        
        // Prevent Telegram from adding viewport styles
        const html = document.documentElement
        if (html) {
          html.style.setProperty('--tg-viewport-height', '100vh', 'important')
          html.style.setProperty('--tg-viewport-stable-height', '100vh', 'important')
        }
      }
    }

    // Delay initialization to prevent hydration mismatch
    const timer = setTimeout(initTelegram, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <TelegramContext.Provider value={{ webApp: null, user: null, initData: '', isReady: false }}>
        {children}
      </TelegramContext.Provider>
    )
  }

  return (
    <TelegramContext.Provider value={{ webApp, user, initData, isReady }}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
