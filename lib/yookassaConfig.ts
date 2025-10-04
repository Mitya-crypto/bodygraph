// lib/yookassaConfig.ts

export const YOOKASSA_CONFIG = {
  // Получите эти данные в личном кабинете YooKassa
  shopId: process.env.YOOKASSA_SHOP_ID || '',
  secretKey: process.env.YOOKASSA_SECRET_KEY || '',
  apiUrl: process.env.YOOKASSA_API_URL || 'https://api.yookassa.ru/v3',
  
  // URL для webhook (будет настроен позже)
  webhookUrl: process.env.YOOKASSA_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/yookassa/webhook`,
  
  // Валюта
  currency: 'RUB',
  
  // Автоматическое принятие платежей
  capture: true,
  
  // Тестовый режим (установите false для продакшена)
  testMode: process.env.NODE_ENV === 'development',
}

export const PAYMENT_PLANS = {
  premium_monthly: {
    id: 'premium_monthly',
    name: 'Премиум подписка (месяц)',
    description: 'Полный доступ ко всем функциям BodyGraph на месяц',
    price: 990, // в копейках (9.90 рублей)
    currency: 'RUB',
    period: 'monthly',
    features: [
      'Расширенные отчеты по нумерологии',
      'Полный Human Design анализ',
      'Детальные натальные карты',
      'AI-ассистент (ChatGPT-4)',
      'PDF отчеты',
      'Персональные медитации'
    ]
  },
  
  premium_yearly: {
    id: 'premium_yearly',
    name: 'Премиум подписка (год)',
    description: 'Полный доступ ко всем функциям BodyGraph на год',
    price: 9900, // в копейках (99.00 рублей)
    currency: 'RUB',
    period: 'yearly',
    features: [
      'Все функции месячной подписки',
      'Скидка 17% при оплате за год',
      'Приоритетная поддержка',
      'Эксклюзивные материалы'
    ]
  },
  
  numerology_premium: {
    id: 'numerology_premium',
    name: 'Премиум нумерология',
    description: 'Расширенный анализ нумерологии',
    price: 490, // в копейках (4.90 рублей)
    currency: 'RUB',
    period: 'one_time',
    features: [
      'Подробный отчет по нумерологии',
      'Совместимость с другими людьми',
      'Биоритмы на месяц',
      'PDF отчет'
    ]
  },
  
  human_design_premium: {
    id: 'human_design_premium',
    name: 'Премиум Human Design',
    description: 'Полный анализ Human Design',
    price: 590, // в копейках (5.90 рублей)
    currency: 'RUB',
    period: 'one_time',
    features: [
      'Детальный бодиграф',
      'Каналы и ворота',
      'Инкарнационный крест',
      'PDF отчет'
    ]
  },
  
  astrology_premium: {
    id: 'astrology_premium',
    name: 'Премиум астрология',
    description: 'Полная натальная карта и анализ',
    price: 690, // в копейках (6.90 рублей)
    currency: 'RUB',
    period: 'one_time',
    features: [
      'Натальная карта высокого качества',
      'Все планеты и аспекты',
      'Транзиты на месяц',
      'PDF отчет'
    ]
  }
}

export const YOOKASSA_ENDPOINTS = {
  payments: '/payments',
  payment: (paymentId: string) => `/payments/${paymentId}`,
  refunds: '/refunds',
  refund: (refundId: string) => `/refunds/${refundId}`,
  webhooks: '/webhooks',
  webhook: (webhookId: string) => `/webhooks/${webhookId}`,
}

export interface YooKassaPaymentRequest {
  amount: {
    value: string
    currency: string
  }
  confirmation: {
    type: 'redirect'
    return_url: string
  }
  capture: boolean
  description: string
  metadata?: Record<string, string>
}

export interface YooKassaPaymentResponse {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  paid: boolean
  amount: {
    value: string
    currency: string
  }
  confirmation: {
    type: 'redirect'
    confirmation_url: string
  }
  created_at: string
  description: string
  metadata?: Record<string, string>
}

export interface YooKassaWebhookEvent {
  type: 'payment.succeeded' | 'payment.canceled' | 'payment.waiting_for_capture'
  event: {
    type: string
    created_at: string
    object: YooKassaPaymentResponse
  }
}

export interface PaymentPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: 'monthly' | 'yearly' | 'one_time'
  features: string[]
}



