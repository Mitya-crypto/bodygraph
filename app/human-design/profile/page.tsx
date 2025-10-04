'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HumanDesignProfilePage() {
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

    // Маппинг профилей на слаги
    const profileToSlug: Record<string, string> = {
      '1/3': '1-3',
      '1/4': '1-4',
      '2/4': '2-4',
      '2/5': '2-5',
      '3/5': '3-5',
      '3/6': '3-6',
      '4/6': '4-6',
      '4/1': '4-1',
      '5/1': '5-1',
      '5/2': '5-2',
      '6/2': '6-2',
      '6/3': '6-3'
    }

    const slug = profileToSlug[humanDesignData.profile] || humanDesignData.profile.replace('/', '-')
    router.replace(`/human-design/profile/${slug}`)
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
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="cosmic-subtitle text-xl mb-2">
          {language === 'ru' ? 'Загрузка профиля...' : 'Loading profile...'}
        </h2>
        <p className="text-cosmic-300">
          {language === 'ru' ? 'Перенаправление на вашу страницу профиля' : 'Redirecting to your profile page'}
        </p>
      </div>
    </div>
  )
}
