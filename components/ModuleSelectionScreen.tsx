'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Calculator, Zap, Star, ArrowLeft } from 'lucide-react'

export function ModuleSelectionScreen() {
  const { language } = useAppStore()
  
  console.log('🎯 ModuleSelectionScreen rendered!')

  const modules = [
    {
      id: 'numerology',
      title: language === 'ru' ? 'Нумерология' : 'Numerology',
      description: language === 'ru' 
        ? 'Числа вашей судьбы и жизненного пути' 
        : 'Numbers of your destiny and life path',
      icon: Calculator,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'human-design',
      title: language === 'ru' ? 'Human Design' : 'Human Design',
      description: language === 'ru' 
        ? 'Ваш энергетический тип и стратегия' 
        : 'Your energy type and strategy',
      icon: Zap,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'astrology',
      title: language === 'ru' ? 'Астрология' : 'Astrology',
      description: language === 'ru' 
        ? 'Натальная карта, планеты и транзиты' 
        : 'Natal chart, planets and transits',
      icon: Star,
      color: 'from-pink-500 to-pink-700'
    }
  ]

  const handleModuleSelect = (moduleId: string) => {
    console.log('Module selected:', moduleId)
    window.location.href = `/results?module=${moduleId}`
  }

  console.log('🎯 ModuleSelectionScreen: About to render')
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="cosmic-title text-3xl mb-4">
            {language === 'ru' ? 'Выберите модуль' : 'Choose Module'}
          </h1>
          <p className="cosmic-text">
            {language === 'ru' 
              ? 'Выберите направление для анализа' 
              : 'Choose a direction for analysis'
            }
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Clicking module:', module.id)
                handleModuleSelect(module.id)
              }}
              className="cosmic-card cursor-pointer group hover:bg-space-700/50 transition-colors select-none relative z-10"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="cosmic-subtitle text-xl mb-3 text-center">
                {module.title}
              </h3>
              
              <p className="cosmic-text text-center mb-4">
                {module.description}
              </p>
              
              <div className="text-center">
                <span className="cosmic-text text-sm">
                  {language === 'ru' ? 'Нажмите для анализа' : 'Click to analyze'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => window.location.href = '/welcome'}
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