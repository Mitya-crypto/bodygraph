'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HumanDesignDefinitionPage() {
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

    // Маппинг определений на слаги
    const definitionToSlug: Record<string, string> = {
      'Single Definition': 'single',
      'Split Definition': 'split',
      'Triple Split Definition': 'triple-split',
      'Quadruple Split Definition': 'quadruple-split',
      'No Definition': 'no-definition'
    }

    // Создаем slug на основе определения
    let slug = definitionToSlug[humanDesignData.definition]
    
    // Если определение не найдено в маппинге, создаем slug из полного определения
    if (!slug) {
      slug = humanDesignData.definition.toLowerCase().replace(/\s+/g, '-')
    }
    router.replace(`/human-design/definition/${slug}`)
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
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="cosmic-subtitle text-xl mb-2">
          {language === 'ru' ? 'Загрузка определения...' : 'Loading definition...'}
        </h2>
        <p className="text-cosmic-300">
          {language === 'ru' ? 'Перенаправление на вашу страницу определения' : 'Redirecting to your definition page'}
        </p>
      </div>
    </div>
  )
}
