// Hydration fix utilities for Telegram WebApp

// Prevent Telegram WebApp from adding viewport styles that cause hydration mismatch
export function preventTelegramViewportStyles() {
  if (typeof window === 'undefined') return

  // Override Telegram's viewport style injection
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
  
  CSSStyleDeclaration.prototype.setProperty = function(property: string, value: string, priority?: string) {
    // Prevent Telegram from setting viewport styles
    if (property === '--tg-viewport-height' || property === '--tg-viewport-stable-height') {
      return
    }
    
    return originalSetProperty.call(this, property, value, priority)
  }

  // Set our own viewport styles
  const html = document.documentElement
  if (html) {
    html.style.setProperty('--tg-viewport-height', '100vh', 'important')
    html.style.setProperty('--tg-viewport-stable-height', '100vh', 'important')
  }
}

// Initialize hydration fix
export function initializeHydrationFix() {
  if (typeof window === 'undefined') return

  // Run immediately
  preventTelegramViewportStyles()

  // Also run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preventTelegramViewportStyles)
  }

  // And run after window load
  window.addEventListener('load', preventTelegramViewportStyles)
}

// Check if we're in Telegram WebApp
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).Telegram?.WebApp
}

// Get Telegram WebApp instance safely
export function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return (window as any).Telegram?.WebApp || null
}

