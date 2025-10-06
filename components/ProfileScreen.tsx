'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Calendar, Clock, MapPin, User, ArrowLeft, CheckCircle, AlertCircle, Crown, AlertTriangle, Lock } from 'lucide-react'
import SubscriptionManager from '@/components/SubscriptionManager'
import { profileManager } from '@/lib/profileManager'
import toast from 'react-hot-toast'

export function ProfileScreen() {
  const { userProfile, language } = useAppStore()
  const [telegramId, setTelegramId] = useState<number | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [showSubscription, setShowSubscription] = useState(false)

  // Инициализация Telegram пользователя
  useEffect(() => {
    const initTelegramUser = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
          const user = (window as any).Telegram.WebApp.initDataUnsafe.user
          setTelegramId(user.id)
          console.log('Telegram user ID:', user.id)
        }
      } catch (error) {
        console.error('Error initializing Telegram user:', error)
      }
    }

    initTelegramUser()
  }, [])

  // Загрузка подписки
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        if (telegramId) {
          const response = await fetch('/api/telegram/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramId })
          })
          
          if (response.ok) {
            const data = await response.json()
            setSubscription(data.subscription)
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error)
      }
    }

    loadSubscription()
  }, [telegramId])

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Профиль не найден</h2>
          <p className="text-cosmic-300">Пожалуйста, создайте профиль</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <a 
            href="/welcome"
            className="p-2 bg-space-700 hover:bg-space-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cosmic-300" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-white">Профиль</h1>
            <p className="text-cosmic-300">Ваши персональные данные</p>
          </div>
        </motion.div>

        {/* Информация о профиле */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-space-800/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-6 mb-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-cosmic-400" />
            <h2 className="text-xl font-semibold text-white">Персональные данные</h2>
            <span className="text-xs bg-cosmic-500/20 text-cosmic-300 px-2 py-1 rounded-full">
              Только для просмотра
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Имя */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cosmic-400" />
                <label className="text-sm font-medium text-cosmic-300">Имя</label>
              </div>
              <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                <p className="text-white font-medium">{userProfile.name}</p>
              </div>
            </div>

            {/* Дата рождения */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cosmic-400" />
                <label className="text-sm font-medium text-cosmic-300">Дата рождения</label>
              </div>
              <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                <p className="text-white font-medium">
                  {new Date(userProfile.birthDate).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Время рождения */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cosmic-400" />
                <label className="text-sm font-medium text-cosmic-300">Время рождения</label>
              </div>
              <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                <p className="text-white font-medium">{userProfile.birthTime}</p>
              </div>
            </div>

            {/* Место рождения */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cosmic-400" />
                <label className="text-sm font-medium text-cosmic-300">Место рождения</label>
              </div>
              <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                <p className="text-white font-medium">{userProfile.birthPlace}</p>
                {userProfile.coordinates && (
                  <p className="text-xs text-cosmic-400 mt-1">
                    {userProfile.coordinates.lat.toFixed(4)}, {userProfile.coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Уведомление о невозможности редактирования */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Профиль заблокирован</h4>
                <p className="text-sm text-cosmic-300">
                  Данные профиля нельзя изменить после создания. Это обеспечивает точность астрологических расчетов.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Подписка */}
        {showSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-space-800/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-6 shadow-2xl"
          >
            <SubscriptionManager
              userId={telegramId?.toString() || ''}
              onSubscriptionChange={setSubscription}
            />
          </motion.div>
        )}

        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => setShowSubscription(!showSubscription)}
            className="flex-1 px-6 py-3 bg-cosmic-500 hover:bg-cosmic-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            {showSubscription ? 'Скрыть подписку' : 'Управление подпиской'}
          </button>
          
          <button
            onClick={() => window.location.href = '/welcome'}
            className="flex-1 px-6 py-3 bg-space-700 hover:bg-space-600 text-cosmic-300 rounded-xl transition-colors"
          >
            Назад к главной
          </button>
        </motion.div>
      </div>
    </div>
  )
}