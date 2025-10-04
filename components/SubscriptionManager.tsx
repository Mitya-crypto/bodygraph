'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  getAllPlans, 
  getUserSubscription, 
  createFreeSubscription, 
  upgradeToPremium,
  isSubscriptionActive,
  type SubscriptionPlan,
  type UserSubscription 
} from '@/lib/subscriptionManager'
import YooKassaAPI from '@/lib/yookassaApi'
import PaymentModal from './PaymentModal'

interface SubscriptionManagerProps {
  userId: string
  onSubscriptionChange?: (subscription: UserSubscription) => void
}

export default function SubscriptionManager({ userId, onSubscriptionChange }: SubscriptionManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  useEffect(() => {
    const plansList = getAllPlans()
    setPlans(plansList)

    // Получаем текущую подписку
    const subscription = getUserSubscription(userId)
    if (!subscription) {
      // Создаем бесплатную подписку если её нет
      const freeSub = createFreeSubscription(userId)
      setCurrentSubscription(freeSub)
      onSubscriptionChange?.(freeSub)
    } else {
      setCurrentSubscription(subscription)
    }
  }, [userId, onSubscriptionChange])

  const handleUpgrade = async (planId: string) => {
    try {
      setIsLoading(true)
      setSelectedPlanId(planId)

      const response = await fetch('/api/yookassa/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId,
          returnUrl: `${window.location.origin}/payment/success?plan=${planId}`
        })
      })

      const data = await response.json()

      if (data.success && data.payment?.confirmationUrl) {
        // Прямой переход на страницу оплаты YooKassa
        window.location.href = data.payment.confirmationUrl
        return
      }

      // Если по какой-то причине прямой редирект не получился — откроем модалку
      setPaymentModalOpen(true)
    } catch (e) {
      console.error('❌ Ошибка создания платежа:', e)
      // Фоллбек: откроем модалку с кнопкой оплаты
      setPaymentModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false)
    // Обновляем подписку после успешной оплаты
    const updatedSubscription = getUserSubscription(userId)
    if (updatedSubscription) {
      setCurrentSubscription(updatedSubscription)
      onSubscriptionChange?.(updatedSubscription)
    }
  }

  const isActive = currentSubscription ? isSubscriptionActive(userId) : false
  const currentPlan = plans.find(plan => plan.id === currentSubscription?.planId)

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-cosmic-100">
              Текущая подписка
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive && currentPlan?.type === 'premium'
                ? 'bg-green-900/50 text-green-400 border border-green-700'
                : isActive
                ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                : 'bg-red-900/50 text-red-400 border border-red-700'
            }`}>
              {isActive && currentPlan?.type === 'premium' ? 'Премиум активен' : 
               isActive ? 'Бесплатный план' : 'Неактивна'}
            </div>
          </div>

          {currentPlan && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {currentPlan.type === 'premium' ? '👑' : '🆓'}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-cosmic-100">
                    {currentPlan.name}
                  </h4>
                  <p className="text-cosmic-400">
                    {currentPlan.price === 0 ? 'Бесплатно' : `${currentPlan.price} ${currentPlan.currency}/месяц`}
                  </p>
                </div>
              </div>

              <div className="bg-space-800/50 p-4 rounded-lg">
                <div className="text-sm text-cosmic-300 mb-2">Доступные функции:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPlan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-cosmic-400">
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {currentPlan.features.length > 6 && (
                  <div className="text-sm text-cosmic-500 mt-2">
                    +{currentPlan.features.length - 6} дополнительных функций
                  </div>
                )}
              </div>

              {currentSubscription.endDate && (
                <div className="text-sm text-cosmic-400">
                  Действует до: {new Date(currentSubscription.endDate).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              currentPlan?.id === plan.id
                ? 'border-cosmic-500 bg-cosmic-900/30'
                : plan.type === 'premium'
                ? 'border-cosmic-600 bg-space-900/50 hover:border-cosmic-500'
                : 'border-cosmic-700 bg-space-900/30'
            }`}
          >
            {currentPlan?.id === plan.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-cosmic-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">
                {plan.type === 'premium' ? '👑' : '🆓'}
              </div>
              <h3 className="text-2xl font-bold text-cosmic-100 mb-2">
                {plan.name}
              </h3>
              <div className="text-3xl font-bold text-cosmic-200 mb-2">
                {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽`}
              </div>
              {plan.price > 0 && (
                <div className="text-sm text-cosmic-400">
                  за {plan.duration === 'monthly' ? 'месяц' : 'год'}
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm font-medium text-cosmic-300 mb-3">
                Что включено:
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-cosmic-400">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.limitations.length > 0 && (
              <div className="space-y-2 mb-6">
                <div className="text-sm font-medium text-cosmic-300">
                  Ограничения:
                </div>
                <ul className="space-y-1">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-cosmic-500">
                      <span className="text-red-400 mt-0.5">✗</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-cosmic-700">
              {currentPlan?.id === plan.id ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg font-medium bg-cosmic-800 text-cosmic-400 cursor-not-allowed"
                >
                  Текущий план
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    plan.type === 'premium'
                      ? 'bg-cosmic-600 text-white hover:bg-cosmic-700'
                      : 'bg-cosmic-800 text-cosmic-300 hover:bg-cosmic-700'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Обработка...</span>
                    </div>
                  ) : (
                    plan.price === 0 ? 'Активен' : 'Обновить план'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cosmic-card p-6"
      >
        <h3 className="text-xl font-bold text-cosmic-100 mb-4">
          Сравнение возможностей
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cosmic-700">
                <th className="text-left py-3 text-cosmic-300">Функция</th>
                <th className="text-center py-3 text-cosmic-300">Бесплатно</th>
                <th className="text-center py-3 text-cosmic-300">Премиум</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Основная нумерология</td>
                <td className="text-center py-3 text-green-400">✓</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Расширенная нумерология</td>
                <td className="text-center py-3 text-red-400">✗</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Базовый Human Design</td>
                <td className="text-center py-3 text-green-400">✓</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Детальный Human Design</td>
                <td className="text-center py-3 text-red-400">✗</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Ключевые планеты</td>
                <td className="text-center py-3 text-green-400">✓</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">Полная натальная карта</td>
                <td className="text-center py-3 text-red-400">✗</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">AI ассистент (базовый)</td>
                <td className="text-center py-3 text-green-400">✓</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr className="border-b border-cosmic-800">
                <td className="py-3 text-cosmic-200">ChatGPT-5 ассистент</td>
                <td className="text-center py-3 text-red-400">✗</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
              <tr>
                <td className="py-3 text-cosmic-200">Экспорт в PDF</td>
                <td className="text-center py-3 text-red-400">✗</td>
                <td className="text-center py-3 text-green-400">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        planId={selectedPlanId}
        userId={userId}
      />
    </div>
  )
}