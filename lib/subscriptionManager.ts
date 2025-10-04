// lib/subscriptionManager.ts

export interface SubscriptionPlan {
  id: string
  name: string
  type: 'free' | 'premium'
  price: number
  currency: string
  features: string[]
  limitations: string[]
  duration: 'monthly' | 'yearly' | 'lifetime'
}

export interface UserSubscription {
  userId: string
  planId: string
  isActive: boolean
  startDate: string
  endDate?: string
  autoRenew: boolean
  paymentMethod?: string
}

export interface FeatureAccess {
  numerology: {
    basic: boolean
    advanced: boolean
    psychomatrix: boolean
    biorhythms: boolean
    compatibility: boolean
    pdfExport: boolean
  }
  humanDesign: {
    basic: boolean
    detailed: boolean
    channels: boolean
    gates: boolean
    centers: boolean
    incarnationCross: boolean
    variables: boolean
    compatibility: boolean
    imageGeneration: boolean
    pdfExport: boolean
  }
  astrology: {
    basic: boolean
    full: boolean
    allPlanets: boolean
    houses: boolean
    aspects: boolean
    transits: boolean
    progressions: boolean
    synastry: boolean
    pdfExport: boolean
  }
  aiAssistant: {
    basic: boolean
    advanced: boolean
    personalized: boolean
    dailyGuidance: boolean
    meditationScripts: boolean
    affirmationGeneration: boolean
    qaSupport: boolean
  }
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Бесплатный план',
    type: 'free',
    price: 0,
    currency: 'RUB',
    duration: 'lifetime',
    features: [
      'Основные числа нумерологии (Life Path, Expression, Soul Urge, Personality)',
      'Базовый Human Design (тип, стратегия, авторитет, профайл)',
      'Ключевые планеты в натальной карте',
      'Краткие интерпретации (3-4 абзаца)',
      '3 практических совета',
      'Базовый AI ассистент'
    ],
    limitations: [
      'Ограниченный доступ к детальным интерпретациям',
      'Нет экспорта в PDF',
      'Нет расширенной совместимости',
      'Нет персонализированных медитаций'
    ]
  },
  {
    id: 'premium',
    name: 'Премиум план',
    type: 'premium',
    price: 999,
    currency: 'RUB',
    duration: 'monthly',
    features: [
      'Все возможности бесплатного плана',
      'Расширенные отчеты (до 8 страниц)',
      'Полная психоматрица и биоритмы',
      'Детальный Human Design (каналы, ворота, центры)',
      'Полная натальная карта (все планеты, дома, аспекты)',
      'Транзиты и прогрессии',
      'Синастрия пар',
      'Экспорт в PDF',
      'Персонализированные медитации',
      'Расширенная совместимость',
      'AI ассистент ChatGPT-5',
      'Ежедневные персональные советы',
      'Генерация аффирмаций',
      'Неограниченные вопросы к AI'
    ],
    limitations: []
  }
]

export const FEATURE_ACCESS: Record<string, FeatureAccess> = {
  free: {
    numerology: {
      basic: true,
      advanced: false,
      psychomatrix: false,
      biorhythms: false,
      compatibility: false,
      pdfExport: false
    },
    humanDesign: {
      basic: true,
      detailed: false,
      channels: false,
      gates: false,
      centers: false,
      incarnationCross: false,
      variables: false,
      compatibility: false,
      imageGeneration: false,
      pdfExport: false
    },
    astrology: {
      basic: true,
      full: false,
      allPlanets: false,
      houses: false,
      aspects: false,
      transits: false,
      progressions: false,
      synastry: false,
      pdfExport: false
    },
    aiAssistant: {
      basic: true,
      advanced: false,
      personalized: false,
      dailyGuidance: false,
      meditationScripts: false,
      affirmationGeneration: false,
      qaSupport: false
    }
  },
  premium: {
    numerology: {
      basic: true,
      advanced: true,
      psychomatrix: true,
      biorhythms: true,
      compatibility: true,
      pdfExport: true
    },
    humanDesign: {
      basic: true,
      detailed: true,
      channels: true,
      gates: true,
      centers: true,
      incarnationCross: true,
      variables: true,
      compatibility: true,
      imageGeneration: true,
      pdfExport: true
    },
    astrology: {
      basic: true,
      full: true,
      allPlanets: true,
      houses: true,
      aspects: true,
      transits: true,
      progressions: true,
      synastry: true,
      pdfExport: true
    },
    aiAssistant: {
      basic: true,
      advanced: true,
      personalized: true,
      dailyGuidance: true,
      meditationScripts: true,
      affirmationGeneration: true,
      qaSupport: true
    }
  }
}

// Получение плана подписки пользователя
export function getUserSubscription(userId: string): UserSubscription | null {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions') || '{}')
    return subscriptions[userId] || null
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

// Установка плана подписки пользователя
export function setUserSubscription(userId: string, subscription: UserSubscription): void {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions') || '{}')
    subscriptions[userId] = subscription
    localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions))
  } catch (error) {
    console.error('Error setting user subscription:', error)
  }
}

// Проверка активной подписки
export function isSubscriptionActive(userId: string): boolean {
  const subscription = getUserSubscription(userId)
  if (!subscription) return false
  
  if (subscription.endDate) {
    return new Date(subscription.endDate) > new Date()
  }
  
  return subscription.isActive
}

// Получение доступа к функциям
export function getUserFeatureAccess(userId: string): FeatureAccess {
  const subscription = getUserSubscription(userId)
  
  if (!subscription || !isSubscriptionActive(userId)) {
    return FEATURE_ACCESS.free
  }
  
  return FEATURE_ACCESS[subscription.planId] || FEATURE_ACCESS.free
}

// Проверка доступа к конкретной функции
export function hasFeatureAccess(
  userId: string, 
  module: keyof FeatureAccess, 
  feature: keyof FeatureAccess[keyof FeatureAccess]
): boolean {
  const access = getUserFeatureAccess(userId)
  return access[module][feature] as boolean
}

// Создание бесплатной подписки
export function createFreeSubscription(userId: string): UserSubscription {
  const freeSubscription: UserSubscription = {
    userId,
    planId: 'free',
    isActive: true,
    startDate: new Date().toISOString(),
    autoRenew: false
  }
  
  setUserSubscription(userId, freeSubscription)
  return freeSubscription
}

// Обновление на премиум план
export function upgradeToPremium(userId: string, duration: 'monthly' | 'yearly' = 'monthly'): UserSubscription {
  const endDate = new Date()
  if (duration === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1)
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1)
  }
  
  const premiumSubscription: UserSubscription = {
    userId,
    planId: 'premium',
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: endDate.toISOString(),
    autoRenew: true
  }
  
  setUserSubscription(userId, premiumSubscription)
  return premiumSubscription
}

// Получение информации о плане
export function getPlanInfo(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null
}

// Получение всех доступных планов
export function getAllPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS
}



