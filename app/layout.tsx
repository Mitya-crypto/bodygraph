import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TelegramProvider } from '@/components/TelegramProvider'
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
        <NoSSR>
          <TelegramWebApp>
            <TelegramProvider>
              <NoSSR>
                <div
                  id="starfield-container"
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: 'transparent',
                    overflow: 'hidden'
                  }}
                >
                  {/* Больше быстрых падающих звезд - летят по диагонали */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '15%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 15px #0ea5e9, 0 0 30px rgba(14, 165, 233, 0.8), 0 0 45px rgba(14, 165, 233, 0.4)',
                      animation: 'fast-falling-star 1.2s linear infinite'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '35%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 12px #0ea5e9, 0 0 25px rgba(14, 165, 233, 0.7), 0 0 35px rgba(14, 165, 233, 0.3)',
                      animation: 'fast-falling-star 1.4s linear infinite 0.2s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '55%',
                      width: '4px',
                      height: '4px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 18px #0ea5e9, 0 0 35px rgba(14, 165, 233, 0.9), 0 0 50px rgba(14, 165, 233, 0.5)',
                      animation: 'fast-falling-star 1.6s linear infinite 0.4s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '75%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #0ea5e9, 0 0 20px rgba(14, 165, 233, 0.6), 0 0 30px rgba(14, 165, 233, 0.3)',
                      animation: 'fast-falling-star 1.3s linear infinite 0.6s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '95%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 14px #0ea5e9, 0 0 28px rgba(14, 165, 233, 0.8), 0 0 42px rgba(14, 165, 233, 0.4)',
                      animation: 'fast-falling-star 1.7s linear infinite 0.8s'
                    }}
                  />

                  {/* Много статичных мерцающих звезд - создают богатый звездный фон */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8%',
                      left: '12%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #0ea5e9, 0 0 15px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 4s ease-in-out infinite'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '15%',
                      left: '28%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px #0ea5e9, 0 0 12px rgba(14, 165, 233, 0.3)',
                      animation: 'twinkle-star 3.5s ease-in-out infinite 0.5s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '22%',
                      left: '45%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #0ea5e9, 0 0 20px rgba(14, 165, 233, 0.5)',
                      animation: 'twinkle-star 4.2s ease-in-out infinite 1s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '30%',
                      left: '62%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 7px #0ea5e9, 0 0 14px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 3.8s ease-in-out infinite 1.5s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '38%',
                      left: '78%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 5px #0ea5e9, 0 0 10px rgba(14, 165, 233, 0.2)',
                      animation: 'twinkle-star 5s ease-in-out infinite 2s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '45%',
                      left: '8%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #0ea5e9, 0 0 16px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 4.5s ease-in-out infinite 0.3s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '52%',
                      left: '25%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 11px #0ea5e9, 0 0 22px rgba(14, 165, 233, 0.6)',
                      animation: 'twinkle-star 3.2s ease-in-out infinite 1.8s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '58%',
                      left: '42%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px #0ea5e9, 0 0 12px rgba(14, 165, 233, 0.3)',
                      animation: 'twinkle-star 4.8s ease-in-out infinite 0.8s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '65%',
                      left: '58%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 9px #0ea5e9, 0 0 18px rgba(14, 165, 233, 0.5)',
                      animation: 'twinkle-star 3.6s ease-in-out infinite 2.3s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '72%',
                      left: '75%',
                      width: '4px',
                      height: '4px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 12px #0ea5e9, 0 0 25px rgba(14, 165, 233, 0.7)',
                      animation: 'twinkle-star 3.9s ease-in-out infinite 1.2s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '78%',
                      left: '92%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 5px #0ea5e9, 0 0 10px rgba(14, 165, 233, 0.2)',
                      animation: 'twinkle-star 5.1s ease-in-out infinite 0.6s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '85%',
                      left: '18%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #0ea5e9, 0 0 20px rgba(14, 165, 233, 0.5)',
                      animation: 'twinkle-star 4.1s ease-in-out infinite 1.9s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '92%',
                      left: '35%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #0ea5e9, 0 0 16px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 3.7s ease-in-out infinite 0.9s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '5%',
                      left: '88%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 7px #0ea5e9, 0 0 14px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 4.3s ease-in-out infinite 1.7s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12%',
                      left: '5%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 5px #0ea5e9, 0 0 10px rgba(14, 165, 233, 0.2)',
                      animation: 'twinkle-star 5.3s ease-in-out infinite 0.4s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '35%',
                      left: '95%',
                      width: '3px',
                      height: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 11px #0ea5e9, 0 0 22px rgba(14, 165, 233, 0.6)',
                      animation: 'twinkle-star 3.4s ease-in-out infinite 2.4s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '48%',
                      left: '15%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #0ea5e9, 0 0 16px rgba(14, 165, 233, 0.4)',
                      animation: 'twinkle-star 4.6s ease-in-out infinite 1.1s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '68%',
                      left: '82%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px #0ea5e9, 0 0 12px rgba(14, 165, 233, 0.3)',
                      animation: 'twinkle-star 4.7s ease-in-out infinite 0.7s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '82%',
                      left: '48%',
                      width: '2px',
                      height: '2px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 9px #0ea5e9, 0 0 18px rgba(14, 165, 233, 0.5)',
                      animation: 'twinkle-star 3.8s ease-in-out infinite 1.6s'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '95%',
                      left: '65%',
                      width: '1px',
                      height: '1px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 5px #0ea5e9, 0 0 10px rgba(14, 165, 233, 0.2)',
                      animation: 'twinkle-star 5.2s ease-in-out infinite 2.1s'
                    }}
                  />
                </div>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                      @keyframes fast-falling-star {
                        0% {
                          transform: translateY(-10px) translateX(0px);
                          opacity: 0;
                        }
                        5% {
                          opacity: 1;
                        }
                        95% {
                          opacity: 1;
                        }
                        100% {
                          transform: translateY(calc(100vh + 10px)) translateX(80px);
                          opacity: 0;
                        }
                      }
                      
                      @keyframes twinkle-star {
                        0%, 100% {
                          opacity: 0.3;
                          transform: scale(1);
                        }
                        50% {
                          opacity: 1;
                          transform: scale(1.2);
                        }
                      }
                    `
                  }}
                />
              </NoSSR>
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
