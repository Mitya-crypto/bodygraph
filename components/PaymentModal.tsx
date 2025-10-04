// components/PaymentModal.tsx

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import YooKassaAPI from '@/lib/yookassaApi'
import { useAppStore } from '@/store/appStore'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  userId: string
}

export function PaymentModal({ isOpen, onClose, planId, userId }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const { userProfile } = useAppStore()

  const plan = YooKassaAPI.getPlanById(planId)

  const handlePayment = async () => {
    if (!plan) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 Initiating payment for plan:', planId)

      const response = await fetch('/api/yookassa/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          returnUrl: `${window.location.origin}/payment/success?plan=${planId}`
        }),
      })

      const data = await response.json()

      if (data.success && data.payment?.confirmationUrl) {
        console.log('✅ Payment created, redirecting to:', data.payment.confirmationUrl)
        setPaymentUrl(data.payment.confirmationUrl)
        
        // Перенаправляем на страницу оплаты YooKassa
        window.open(data.payment.confirmationUrl, '_blank')
      } else {
        throw new Error(data.error || 'Failed to create payment')
      }

    } catch (err) {
      console.error('❌ Payment error:', err)
      setError(err instanceof Error ? err.message : 'Ошибка при создании платежа')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2) + ' ₽'
  }

  if (!plan) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="cosmic-card w-full max-w-md mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cosmic-600/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-cosmic-400" />
                </div>
                <h2 className="text-xl font-bold text-cosmic-100">
                  Оплата подписки
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cosmic-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-cosmic-400" />
              </button>
            </div>

            {/* Plan Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cosmic-100 mb-2">
                {plan.name}
              </h3>
              <p className="text-cosmic-300 text-sm mb-4">
                {plan.description}
              </p>
              
              <div className="bg-cosmic-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cosmic-300">Стоимость:</span>
                  <span className="text-2xl font-bold text-cosmic-100">
                    {formatPrice(plan.price)}
                  </span>
                </div>
                
                {plan.period === 'monthly' && (
                  <div className="text-xs text-cosmic-400">
                    Автоматическое продление каждый месяц
                  </div>
                )}
                {plan.period === 'yearly' && (
                  <div className="text-xs text-cosmic-400">
                    Автоматическое продление каждый год
                  </div>
                )}
                {plan.period === 'one_time' && (
                  <div className="text-xs text-cosmic-400">
                    Разовый платеж, доступ навсегда
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-cosmic-200 mb-2">
                  Что включено:
                </h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-cosmic-500 flex-shrink-0" />
                    <span className="text-sm text-cosmic-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-700 hover:to-cosmic-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Создание платежа...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Оплатить {formatPrice(plan.price)}</span>
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="flex items-center justify-center space-x-2 text-xs text-cosmic-400">
                <Shield className="w-4 h-4" />
                <span>Безопасная оплата через YooKassa</span>
              </div>
            </div>

            {/* User Info */}
            {userProfile && (
              <div className="mt-4 pt-4 border-t border-cosmic-800">
                <div className="text-xs text-cosmic-400">
                  Оплата для: <span className="text-cosmic-300">{userProfile.name}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal



