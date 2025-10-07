// components/ProfileManagementScreen.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Crown, Settings, Users } from 'lucide-react'
import { ProfileList } from '@/components/ProfileList'
import SubscriptionManager from '@/components/SubscriptionManager'
import { MultipleProfilesManager } from '@/components/MultipleProfilesManager'
import { profileManager } from '@/lib/profileManager'
import { useAppStore } from '@/store/appStore'

export function ProfileManagementScreen() {
  const { setUserProfile, triggerProfileUpdate, language } = useAppStore()
  const [telegramId, setTelegramId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'profiles' | 'multiple-profiles' | 'subscription'>('profiles')
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const initTelegramUser = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
          const telegramUser = (window as any).Telegram.WebApp.initDataUnsafe.user
          setTelegramId(telegramUser.id)
          
          const sub = profileManager.getSubscription(telegramUser.id)
          setSubscription(sub)
        } else {
          // Fallback для тестирования
          const testTelegramId = 123456789
          setTelegramId(testTelegramId)
          
          const sub = profileManager.getSubscription(testTelegramId)
          setSubscription(sub)
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error)
      }
    }
    
    initTelegramUser()
  }, [])

  // Функция создания профиля удалена - профили создаются только при регистрации

  const handleProfileSelect = (profile: any) => {
    console.log('🎯 Selecting profile for calculations:', profile)
    console.log('🎯 Profile data structure:', {
      id: profile.id,
      profile: profile.profile,
      name: profile.profile?.name,
      birthDate: profile.profile?.birthDate,
      birthTime: profile.profile?.birthTime,
      birthPlace: profile.profile?.birthPlace,
      birthCoordinates: profile.profile?.birthCoordinates
    })
    setUserProfile(profile.profile) // Устанавливаем данные профиля
    triggerProfileUpdate() // Триггерим обновление всех компонентов
    console.log('🎯 UserProfile set in store and update triggered:', profile.profile)
    window.location.href = '/modules'
  }

  // Функция редактирования профиля удалена - профили нельзя изменять

  // Функция обновления подписки удалена - используется setSubscription напрямую

  if (!telegramId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-400"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <a 
              href="/welcome"
              className="cosmic-button bg-space-700 hover:bg-space-600 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="cosmic-title text-3xl">
                {language === 'ru' ? 'Управление профилями' : 'Profile Management'}
              </h1>
              <p className="text-cosmic-400 mt-1">
                {language === 'ru' 
                  ? 'Создавайте и управляйте своими профилями' 
                  : 'Create and manage your profiles'
                }
              </p>
            </div>
          </div>

          {/* Навигация по вкладкам */}
          <div className="flex gap-2 bg-space-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'profiles' 
                  ? 'bg-cosmic-600 text-cosmic-100' 
                  : 'text-cosmic-400 hover:text-cosmic-300'
              }`}
            >
              <User className="w-4 h-4" />
              {language === 'ru' ? 'Профили' : 'Profiles'}
            </button>
            <button
              onClick={() => setActiveTab('multiple-profiles')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'multiple-profiles' 
                  ? 'bg-cosmic-600 text-cosmic-100' 
                  : 'text-cosmic-400 hover:text-cosmic-300'
              }`}
            >
              <Users className="w-4 h-4" />
              {language === 'ru' ? 'Семья' : 'Family'}
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'subscription' 
                  ? 'bg-cosmic-600 text-cosmic-100' 
                  : 'text-cosmic-400 hover:text-cosmic-300'
              }`}
            >
              <Crown className="w-4 h-4" />
              {language === 'ru' ? 'Подписка' : 'Subscription'}
            </button>
          </div>
        </motion.div>

        {/* Контент вкладок */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profiles' && (
            <ProfileList
              telegramId={telegramId}
              onProfileSelect={handleProfileSelect}
              language={language}
            />
          )}

          {activeTab === 'multiple-profiles' && (
            <MultipleProfilesManager />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionManager
              userId={telegramId.toString()}
              onSubscriptionChange={setSubscription}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
