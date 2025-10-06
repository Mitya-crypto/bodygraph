'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { ArrowLeft, Crown, Star, Zap } from 'lucide-react'

export function SubscriptionScreen() {
  const { language } = useAppStore()

  const features = [
    {
      icon: Star,
      title: language === 'ru' ? 'Полные отчеты' : 'Full Reports',
      description: language === 'ru' 
        ? 'Детальные интерпретации всех модулей' 
        : 'Detailed interpretations of all modules'
    },
    {
      icon: Zap,
      title: language === 'ru' ? 'AI Ассистент' : 'AI Assistant',
      description: language === 'ru' 
        ? 'Персональные рекомендации и прогнозы' 
        : 'Personal recommendations and forecasts'
    },
    {
      icon: Crown,
      title: language === 'ru' ? 'PDF Экспорт' : 'PDF Export',
      description: language === 'ru' 
        ? 'Скачивание отчетов в PDF формате' 
        : 'Download reports in PDF format'
    }
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cosmic-500 to-cosmic-700 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="cosmic-title text-3xl mb-4">
            {language === 'ru' ? 'Премиум подписка' : 'Premium Subscription'}
          </h1>
          <p className="cosmic-text">
            {language === 'ru' 
              ? 'Откройте все возможности космического анализа' 
              : 'Unlock all cosmic analysis features'
            }
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="cosmic-card text-center"
            >
              <feature.icon className="w-12 h-12 text-cosmic-400 mx-auto mb-4" />
              <h3 className="cosmic-subtitle text-xl mb-3">
                {feature.title}
              </h3>
              <p className="cosmic-text">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cosmic-card text-center mb-8"
        >
          <h2 className="cosmic-subtitle text-2xl mb-4">
            {language === 'ru' ? 'Тарифы' : 'Pricing'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cosmic-card bg-space-800/50">
              <h3 className="cosmic-subtitle text-xl mb-2">
                {language === 'ru' ? 'Бесплатно' : 'Free'}
              </h3>
              <p className="text-3xl font-bold text-cosmic-400 mb-4">$0</p>
              <ul className="cosmic-text text-sm space-y-2">
                <li>• {language === 'ru' ? 'Базовые расчеты' : 'Basic calculations'}</li>
                <li>• {language === 'ru' ? 'Краткие результаты' : 'Brief results'}</li>
                <li>• {language === 'ru' ? 'Ограниченные функции' : 'Limited features'}</li>
              </ul>
            </div>
            
            <div className="cosmic-card bg-gradient-to-br from-cosmic-500/20 to-cosmic-700/20 border-cosmic-500">
              <h3 className="cosmic-subtitle text-xl mb-2">
                {language === 'ru' ? 'Премиум' : 'Premium'}
              </h3>
              <p className="text-3xl font-bold text-cosmic-400 mb-4">$9.99</p>
              <ul className="cosmic-text text-sm space-y-2">
                <li>• {language === 'ru' ? 'Полные отчеты' : 'Full reports'}</li>
                <li>• {language === 'ru' ? 'AI Ассистент' : 'AI Assistant'}</li>
                <li>• {language === 'ru' ? 'PDF Экспорт' : 'PDF Export'}</li>
                <li>• {language === 'ru' ? 'Все модули' : 'All modules'}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <motion.button
            className="cosmic-button bg-cosmic-500 hover:bg-cosmic-600 text-white px-8 py-4 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === 'ru' ? 'Оформить подписку' : 'Subscribe Now'}
          </motion.button>
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => window.location.href = '/modules'}
          className="cosmic-button bg-space-700 hover:bg-space-600 flex items-center justify-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'ru' ? 'Назад' : 'Back'}
        </motion.button>
      </div>
    </div>
  )
}