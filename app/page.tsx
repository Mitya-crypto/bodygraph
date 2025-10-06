'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ProfileScreen } from '@/components/ProfileScreen'
import { ProfileManagementScreen } from '@/components/ProfileManagementScreen'
import { ModuleSelectionScreen } from '@/components/ModuleSelectionScreen'
import { ResultsScreen } from '@/components/ResultsScreen'
import { SubscriptionScreen } from '@/components/SubscriptionScreen'
import { useAppStore } from '@/store/appStore'
import { profileManager } from '@/lib/profileManager'

export default function Home() {
  const { currentScreen, userProfile, setUserProfile } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('🚀 Home component mounted')
    
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      try {
        const webApp = (window as any).Telegram.WebApp
        // Telegram WebApp API doesn't have a ready() function
        // Instead, we just expand the app
        if (webApp.expand) {
          webApp.expand()
        }
        if (webApp.enableClosingConfirmation) {
          webApp.enableClosingConfirmation()
        }
      } catch (error) {
        console.warn('Telegram WebApp initialization failed:', error)
      }
    }
    
    // Force reset currentScreen to welcome on mount
    const { setCurrentScreen } = useAppStore.getState()
    console.log('🔄 Forcing currentScreen to welcome')
    setCurrentScreen('welcome')
    
    // Check if user has a profile
    const checkProfile = async () => {
      try {
        // Проверяем localStorage напрямую
        const storedProfiles = localStorage.getItem('bodygraph-profiles')
        console.log('📋 Checking localStorage for profiles')
        
        if (!storedProfiles) {
          console.log('❌ No profiles in localStorage, redirecting to registration')
          setHasProfile(false)
          router.push('/registration')
          return
        }
        
        const profiles = JSON.parse(storedProfiles)
        console.log('📋 Found profiles in localStorage:', profiles.length)
        
        if (profiles.length > 0) {
          // Use the first profile
          const profile = profiles[0]
          setUserProfile(profile)
          setHasProfile(true)
          console.log('✅ Profile found:', profile.name)
        } else {
          console.log('❌ No profile found, redirecting to registration')
          setHasProfile(false)
          router.push('/registration')
          return
        }
      } catch (error) {
        console.error('❌ Error checking profiles:', error)
        setHasProfile(false)
        router.push('/registration')
        return
      }
      
      // Simulate loading
      console.log('⏰ Setting loading timer')
      const timer = setTimeout(() => {
        console.log('✅ Loading complete, setting isLoading to false')
        setIsLoading(false)
      }, 1000)
      
      return () => {
        console.log('🧹 Cleaning up timer')
        clearTimeout(timer)
      }
    }
    
    checkProfile()
  }, [setUserProfile, router])

  console.log('🎯 Home render - isLoading:', isLoading, 'currentScreen:', currentScreen, 'hasProfile:', hasProfile)
  
  // Debug currentScreen changes
  useEffect(() => {
    console.log('🔄 currentScreen changed to:', currentScreen)
  }, [currentScreen])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-cosmic-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="cosmic-title text-2xl">Loading Cosmic Data...</h2>
          <p className="cosmic-text mt-2">Preparing your astrological journey</p>
        </motion.div>
      </div>
    )
  }

  // If no profile, don't render anything (will redirect to registration)
  if (!hasProfile) {
    return null
  }

  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        {/* StarField is already included in layout.tsx */}
        <div className="relative z-10">
          {currentScreen === 'welcome' && <WelcomeScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'profile-management' && <ProfileManagementScreen />}
          {currentScreen === 'modules' && <ModuleSelectionScreen />}
          {currentScreen === 'results' && <ResultsScreen />}
          {currentScreen === 'subscription' && <SubscriptionScreen />}
        </div>
      </main>
      
    </>
  )
}