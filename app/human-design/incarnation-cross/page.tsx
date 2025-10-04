'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HumanDesignIncarnationCrossPage() {
  const { userProfile, language } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!userProfile) return

    // Парсим дату и время из строк
    const birthDate = new Date(userProfile.birthDate)
    const birthTime = new Date(`2000-01-01T${userProfile.birthTime}`)

    // Вычисляем Human Design данные
    const humanDesignData = calculateHumanDesign({
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: birthTime.getHours(),
      minute: birthTime.getMinutes(),
      latitude: userProfile.coordinates?.lat || 0,
      longitude: userProfile.coordinates?.lng || 0
    })

    // Создаем slug из названия инкарнационного креста
    const slug = humanDesignData.incarnationCross
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    
    router.replace(`/human-design/incarnation-cross/${slug}`)
  }, [userProfile, router])

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="cosmic-card text-center">
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Профиль пользователя не найден.' : 'User profile not found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center">
      <div className="cosmic-card text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="cosmic-subtitle text-xl mb-2">
          {language === 'ru' ? 'Загрузка инкарнационного креста...' : 'Loading incarnation cross...'}
        </h2>
        <p className="text-cosmic-300">
          {language === 'ru' ? 'Перенаправление на вашу страницу креста' : 'Redirecting to your cross page'}
        </p>
      </div>
    </div>
  )
}
