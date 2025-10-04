'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Zap, Moon, Activity, Heart, Shield, Star } from 'lucide-react'

interface ModernHumanDesignWidgetProps {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  language?: string
}

interface HumanDesignMetrics {
  energyLevel: number
  lunarPhase: string
  activeCenters: string[]
  undefinedCenters: string[]
  hourlyEnergy: number[]
  todayFocus: string
  challenges: string[]
  opportunities: string[]
  emotionalState: number
  mentalState: number
  physicalState: number
}

const ModernHumanDesignWidget: React.FC<ModernHumanDesignWidgetProps> = ({
  type,
  strategy,
  authority,
  profile,
  definition,
  language = 'ru'
}) => {
  const [metrics, setMetrics] = useState<HumanDesignMetrics | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Генерация метрик на основе типа
  const generateMetrics = (): HumanDesignMetrics => {
    const today = new Date()
    const dayOfMonth = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    
    const seed = dayOfMonth + month + year
    
    // Определяем уровень энергии на основе типа
    let baseEnergy = 50
    if (type === 'Generator') baseEnergy = 80
    else if (type === 'Manifesting Generator') baseEnergy = 85
    else if (type === 'Manifestor') baseEnergy = 70
    else if (type === 'Projector') baseEnergy = 60
    else if (type === 'Reflector') baseEnergy = 40
    
    const energyLevel = Math.max(20, Math.min(100, baseEnergy + (seed % 30) - 15))
    
    // Лунные фазы
    const lunarPhases = ['Новолуние', 'Растущая луна', 'Первая четверть', 'Растущая луна', 'Полнолуние', 'Убывающая луна', 'Последняя четверть', 'Убывающая луна']
    const lunarPhase = lunarPhases[seed % lunarPhases.length]
    
    // Активные центры
    const allCenters = ['Head', 'Ajna', 'Throat', 'G-Center', 'Heart', 'Solar Plexus', 'Sacral', 'Root', 'Spleen']
    const activeCenters = allCenters.slice(0, Math.floor(seed % 5) + 2)
    const undefinedCenters = allCenters.filter(center => !activeCenters.includes(center))
    
    // Почасовая энергия
    const hourlyEnergy = Array.from({ length: 24 }, (_, hour) => {
      const hourSeed = (seed + hour) % 100
      return Math.max(10, Math.min(100, baseEnergy + (hourSeed % 40) - 20))
    })
    
    // Фокус дня
    const focuses = [
      'Особое внимание к лунным фазам',
      'Фокус на внутренней работе',
      'Время для действий',
      'Обращайте внимание на окружение',
      'Ждите правильного момента',
      'Используйте свою стратегию'
    ]
    const todayFocus = focuses[seed % focuses.length]
    
    // Вызовы и возможности
    const challenges = [
      'Избегайте импульсивных решений',
      'Не торопитесь с выводами',
      'Слушайте свой внутренний голос',
      'Доверяйте процессу'
    ]
    const opportunities = [
      'Отличное время для планирования',
      'Благоприятный период для общения',
      'Время для творчества',
      'Возможности для роста'
    ]
    
    // Эмоциональное, ментальное и физическое состояние
    const emotionalState = 40 + (seed % 60)
    const mentalState = 35 + (seed % 65)
    const physicalState = 45 + (seed % 55)
    
    return {
      energyLevel,
      lunarPhase,
      activeCenters,
      undefinedCenters,
      hourlyEnergy,
      todayFocus,
      challenges,
      opportunities,
      emotionalState,
      mentalState,
      physicalState
    }
  }

  useEffect(() => {
    setMetrics(generateMetrics())
  }, [type, strategy, authority, profile])

  if (!metrics) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-4 bg-space-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-space-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">🧬 Human Design</h3>
              <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 bg-cosmic-600/30 rounded-lg flex items-center justify-center hover:bg-cosmic-600/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              className={`w-4 h-4 text-cosmic-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>

        {/* Основные показатели */}
        <div className="space-y-4">
          {/* Стратегия дня */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Стратегия дня</h4>
            </div>
            <p className="text-cosmic-200 text-sm mb-2">{strategy}</p>
            <p className="text-cosmic-400 text-xs">{metrics.todayFocus}</p>
          </div>

          {/* Авторитет в действии */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Авторитет в действии</h4>
            </div>
            <p className="text-cosmic-200 text-sm mb-2">{authority}</p>
            <p className="text-cosmic-400 text-xs">Лучшее время: в подходящем месте</p>
          </div>

          {/* Уровень энергии */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cosmic-300 font-medium">Уровень энергии</span>
              <span className="text-cosmic-400 text-sm">{metrics.energyLevel}/100</span>
            </div>
            <div className="w-full bg-space-700 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${
                  metrics.energyLevel > 70 ? 'bg-green-500' : 
                  metrics.energyLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.energyLevel}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Лунная фаза */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Лунная фаза</h4>
            </div>
            <p className="text-cosmic-200 text-sm mb-1">{metrics.lunarPhase}</p>
            <p className="text-cosmic-400 text-xs">Время для действий</p>
          </div>
        </div>

        {/* Расширенные детали */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-4 border-t border-space-700">
            {/* Состояние центров */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Состояние центров</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Эмоции</span>
                    <span className="text-xs text-white font-bold">{metrics.emotionalState}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.emotionalState}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Мышление</span>
                    <span className="text-xs text-white font-bold">{metrics.mentalState}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.mentalState}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Тело</span>
                    <span className="text-xs text-white font-bold">{metrics.physicalState}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.physicalState}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Почасовая энергия */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Энергия по часам</span>
              </div>
              <div className="bg-space-800/50 rounded-lg p-3">
                <div className="flex items-end gap-1 h-16">
                  {metrics.hourlyEnergy.slice(0, 12).map((energy, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t flex-1"
                      initial={{ height: 0 }}
                      animate={{ height: `${energy}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i}>{i * 2}:00</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Вызовы и возможности */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-cosmic-300">Вызовы</span>
                </div>
                <div className="space-y-2">
                  {metrics.challenges.map((challenge, index) => (
                    <motion.div 
                      key={index}
                      className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {challenge}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-cosmic-300">Возможности</span>
                </div>
                <div className="space-y-2">
                  {metrics.opportunities.map((opportunity, index) => (
                    <motion.div 
                      key={index}
                      className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {opportunity}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Кнопка развернуть */}
        <motion.button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-sm py-2 mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? 'Свернуть детали' : 'Развернуть детали'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ModernHumanDesignWidget
