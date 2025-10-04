'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HumanDesignAuthorityPage() {
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

    // Маппинг авторитетов на слаги
    const authorityToSlug: Record<string, string> = {
      'Emotional': 'emotional',
      'Sacral': 'sacral',
      'Splenic': 'splenic',
      'Ego': 'ego',
      'Self-Projected': 'self-projected',
      'Environmental': 'environmental',
      'Lunar': 'lunar'
    }

    const slug = authorityToSlug[humanDesignData.authority] || humanDesignData.authority.toLowerCase()
    router.replace(`/human-design/authority/${slug}`)
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
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="cosmic-subtitle text-xl mb-2">
          {language === 'ru' ? 'Загрузка авторитета...' : 'Loading authority...'}
        </h2>
        <p className="text-cosmic-300">
          {language === 'ru' ? 'Перенаправление на вашу страницу авторитета' : 'Redirecting to your authority page'}
        </p>
      </div>
    </div>
  )
}
