import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TelegramProvider } from '@/components/TelegramProvider'
import { StarField } from '@/components/StarField'
import { Toaster } from 'react-hot-toast'
import { TelegramWebApp } from '@/components/TelegramWebApp'
import { NoSSR } from '@/components/NoSSR'
import { initializeHydrationFix } from '@/lib/hydrationFix'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cosmic BodyGraph - Numerology, Human Design & Astrology',
  description: 'Discover your cosmic destiny through numerology, Human Design, and natal charts in this innovative 3D space-themed app.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              ${initializeHydrationFix.toString()}
              initializeHydrationFix();
            })();
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              --tg-viewport-height: 100vh !important;
              --tg-viewport-stable-height: 100vh !important;
            }
          `
        }} />
      </head>
      <body className={`${inter.className} cosmic-scrollbar`}>
        <NoSSR fallback={
          <div className="min-h-screen flex items-center justify-center bg-space-900">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-cosmic-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="cosmic-title text-2xl">Loading Cosmic Data...</h2>
              <p className="cosmic-text mt-2">Preparing your astrological journey</p>
            </div>
          </div>
        }>
          <TelegramWebApp>
            <TelegramProvider>
              <StarField />
              <div className="relative z-10">
                {children}
              </div>
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                  },
                }}
              />
            </TelegramProvider>
          </TelegramWebApp>
        </NoSSR>
      </body>
    </html>
  )
}
