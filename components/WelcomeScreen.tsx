'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { Sparkles, Star, Zap, User, Crown } from 'lucide-react'
import { profileManager } from '@/lib/profileManager'
import ModernNumerologyWidget from './ModernNumerologyWidget'
import ModernHumanDesignWidget from './ModernHumanDesignWidget'
import ModernAstrologyWidget from './ModernAstrologyWidget'
import { calculateNumerology } from '@/lib/numerology'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'

export function WelcomeScreen() {
  const router = useRouter()
  const { userProfile, profileUpdateTrigger } = useAppStore()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  console.log('🌟 WelcomeScreen rendered')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Используем профиль из store или получаем из профилей пользователя
        let profile = userProfile
        
        if (!profile) {
          // Получаем профили пользователя как fallback
          let telegramId = 123456789 // Fallback для тестирования
          
          if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
            telegramId = (window as any).Telegram.WebApp.initDataUnsafe.user.id
          }
          
          const profiles = profileManager.getUserProfiles(telegramId)
          
          if (profiles.length > 0) {
            profile = profiles[0].profile // Берем первый профиль
          }
        }
        
        if (profile) {
          
          // Рассчитываем нумерологию
          const numerologyData = calculateNumerology(
            profile.name,
            profile.birthDate
          )
          
          // Рассчитываем Human Design
          const birthDate = new Date(profile.birthDate)
          const birthTime = new Date(`1970-01-01T${profile.birthTime}`)
          
          const humanDesignData = calculateHumanDesign({
            year: birthDate.getFullYear(),
            month: birthDate.getMonth() + 1,
            day: birthDate.getDate(),
            hour: birthTime.getHours(),
            minute: birthTime.getMinutes(),
            latitude: profile.coordinates?.lat || 55.7558,
            longitude: profile.coordinates?.lng || 37.6176
          })
          
          // Получаем астрологические данные (упрощенно)
          const astrologyData = {
            sunSign: getSunSign(new Date(profile.birthDate)),
            moonSign: getMoonSign(new Date(profile.birthDate)),
            risingSign: getRisingSign(new Date(profile.birthDate), profile.coordinates?.lat || 55.7558)
          }
          
          setUserData({
            numerology: numerologyData,
            humanDesign: humanDesignData,
            astrology: astrologyData
          })
        } else {
          // Используем тестовые данные если нет профиля
          setUserData({
            numerology: { lifePath: 5, expression: 3, soulUrge: 2, personality: 1 },
            humanDesign: { type: 'Reflector', strategy: 'Wait for the Lunar Cycle', authority: 'Environmental', profile: '1/3', definition: 'No Definition' },
            astrology: { sunSign: 'Близнецы', moonSign: 'Лев', risingSign: 'Скорпион' }
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        // Fallback к тестовым данным
        setUserData({
          numerology: { lifePath: 5, expression: 3, soulUrge: 2, personality: 1 },
          humanDesign: { type: 'Reflector', strategy: 'Wait for the Lunar Cycle', authority: 'Environmental', profile: '1/3', definition: 'No Definition' },
          astrology: { sunSign: 'Близнецы', moonSign: 'Лев', risingSign: 'Скорпион' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [userProfile, profileUpdateTrigger])

  // Вспомогательные функции для определения знаков зодиака
  const getSunSign = (birthDate: Date) => {
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы'
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы'
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион'
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец'
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог'
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей'
    return 'Рыбы'
  }

  const getMoonSign = (birthDate: Date) => {
    // Упрощенный расчет знака Луны
    const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
    const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    return signs[dayOfYear % 12]
  }

  const getRisingSign = (birthDate: Date, latitude: number) => {
    // Упрощенный расчет восходящего знака
    const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
    const hour = birthDate.getHours()
    const signIndex = Math.floor((hour + latitude / 10) % 12)
    return signs[signIndex]
  }

  const handleManageProfiles = () => {
    // Кнопка "Управление профилями" должна открывать экран профиля
    console.log('👤 Managing profiles - going to profile screen')
    router.push('/profile')
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative z-10">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cosmic-500 to-cosmic-700 rounded-full flex items-center justify-center">
                <Star className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-cosmic-400 border-dashed rounded-full"
              />
            </div>
          </div>
          
          <h1 className="cosmic-title text-4xl mb-4">
            Космический Бодиграф
          </h1>
          <p className="cosmic-text text-lg">
            Откройте тайны вашей космической сущности через нумерологию, Human Design и астрологию
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {isLoading ? (
            <div className="col-span-3 cosmic-card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-space-700 rounded mb-2"></div>
                <div className="h-4 bg-space-700 rounded mb-4"></div>
                <div className="h-8 bg-space-700 rounded"></div>
              </div>
              <p className="text-cosmic-500 text-sm mt-2">Загрузка ежедневных метрик...</p>
            </div>
          ) : (
            <>
              <div className="cosmic-card">
                <ModernNumerologyWidget
                  lifePathNumber={userData?.numerology?.lifePath || 5}
                  expressionNumber={userData?.numerology?.expression || 3}
                  soulUrgeNumber={userData?.numerology?.soulUrge || 2}
                  personalityNumber={userData?.numerology?.personality || 1}
                  language="ru"
                />
              </div>
              
              <div className="cosmic-card">
                <ModernHumanDesignWidget
                  type={userData?.humanDesign?.type || "Reflector"}
                  strategy={userData?.humanDesign?.strategy || "Wait for the Lunar Cycle"}
                  authority={userData?.humanDesign?.authority || "Environmental"}
                  profile={userData?.humanDesign?.profile || "1/3"}
                  definition={userData?.humanDesign?.definition || "No Definition"}
                  language="ru"
                />
              </div>
              
              <div className="cosmic-card">
                <ModernAstrologyWidget
                  sunSign={userData?.astrology?.sunSign || "Близнецы"}
                  moonSign={userData?.astrology?.moonSign || "Лев"}
                  risingSign={userData?.astrology?.risingSign || "Скорпион"}
                  language="ru"
                />
              </div>
            </>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <a 
            href="/modules"
            className="cosmic-button bg-cosmic-500 hover:bg-cosmic-600 text-white text-xl px-8 py-4 w-full rounded-xl transition-colors cursor-pointer inline-block text-center"
          >
            Начать путешествие
          </a>

          <motion.button
            onClick={handleManageProfiles}
            className="cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-lg px-6 py-3 w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <User className="w-5 h-5" />
            Управление профилями
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}