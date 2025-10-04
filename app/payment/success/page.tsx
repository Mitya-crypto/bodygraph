// app/payment/success/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import YooKassaAPI from '@/lib/yookassaApi'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading')
  const [message, setMessage] = useState('')
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const paymentId = searchParams.get('payment_id')
        const plan = searchParams.get('plan')

        if (!paymentId) {
          setStatus('error')
          setMessage('Не найден ID платежа')
          return
        }

        console.log('🔄 Checking payment status:', { paymentId, plan })

        // Проверяем статус платежа
        const response = await fetch('/api/yookassa/check-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        })

        const data = await response.json()

        if (data.success) {
          const payment = data.payment
          setPaymentData(payment)

          if (payment.paid && payment.status === 'succeeded') {
            setStatus('success')
            setMessage('Платеж успешно обработан! Ваша подписка активирована.')
          } else if (payment.status === 'pending') {
            setStatus('pending')
            setMessage('Платеж в обработке. Подписка будет активирована после подтверждения.')
          } else {
            setStatus('error')
            setMessage('Платеж не был завершен или был отклонен.')
          }
        } else {
          throw new Error(data.error || 'Ошибка при проверке статуса платежа')
        }

      } catch (error) {
        console.error('❌ Payment check error:', error)
        setStatus('error')
        setMessage('Ошибка при проверке статуса платежа')
      }
    }

    checkPaymentStatus()
  }, [searchParams])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-cosmic-400 animate-spin" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'pending':
        return <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-500/30 bg-green-900/20'
      case 'pending':
        return 'border-yellow-500/30 bg-yellow-900/20'
      case 'error':
        return 'border-red-500/30 bg-red-900/20'
      default:
        return 'border-cosmic-500/30 bg-cosmic-900/20'
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Проверка платежа...'
      case 'success':
        return 'Платеж успешно обработан!'
      case 'pending':
        return 'Платеж в обработке'
      case 'error':
        return 'Ошибка платежа'
    }
  }

  return (
    <div className="min-h-screen bg-space-950 text-cosmic-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-cosmic-400 hover:text-cosmic-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться в приложение</span>
          </motion.button>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`cosmic-card p-8 text-center border ${getStatusColor()}`}
          >
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>

            {/* Status Title */}
            <h1 className="text-3xl font-bold text-cosmic-100 mb-4">
              {getStatusTitle()}
            </h1>

            {/* Status Message */}
            <p className="text-lg text-cosmic-300 mb-6">
              {message}
            </p>

            {/* Payment Details */}
            {paymentData && (
              <div className="bg-cosmic-900/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-cosmic-200 mb-3">
                  Детали платежа
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">ID платежа:</span>
                    <span className="text-cosmic-300 font-mono">{paymentData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">Сумма:</span>
                    <span className="text-cosmic-300">
                      {paymentData.amount.value} {paymentData.amount.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">Статус:</span>
                    <span className="text-cosmic-300">{paymentData.status}</span>
                  </div>
                  {paymentData.metadata?.plan_name && (
                    <div className="flex justify-between">
                      <span className="text-cosmic-400">План:</span>
                      <span className="text-cosmic-300">{paymentData.metadata.plan_name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'success' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => router.push('/subscription')}
                  className="w-full bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-700 hover:to-cosmic-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Перейти к подписке
                </motion.button>
              )}

              {status === 'error' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => router.push('/subscription')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Попробовать снова
                </motion.button>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => router.push('/')}
                className="w-full bg-cosmic-800 hover:bg-cosmic-700 text-cosmic-200 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Вернуться на главную
              </motion.button>
            </div>
          </motion.div>

          {/* Additional Info */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="cosmic-card p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-cosmic-200 mb-3">
                🎉 Добро пожаловать в премиум!
              </h3>
              <p className="text-cosmic-300 mb-4">
                Ваша подписка активирована. Теперь у вас есть доступ ко всем премиум функциям BodyGraph:
              </p>
              <ul className="space-y-2 text-cosmic-300">
                <li>• Расширенные отчеты по нумерологии</li>
                <li>• Полный Human Design анализ</li>
                <li>• Детальные натальные карты</li>
                <li>• AI-ассистент (ChatGPT-4)</li>
                <li>• PDF отчеты</li>
                <li>• Персональные медитации</li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}



