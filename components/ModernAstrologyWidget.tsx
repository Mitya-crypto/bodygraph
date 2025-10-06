'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Moon, Sun, Zap, Activity, Target, TrendingUp, Shield } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface ModernAstrologyWidgetProps {
  sunSign: string
  moonSign: string
  risingSign: string
  language?: string
}

interface AstrologyMetrics {
  lunarPhase: string
  activeTransits: Array<{
    planet: string
    aspect: string
    intensity: number
    color: string
  }>
  favorableDay: number
  retrogrades: string[]
  planetaryHours: Array<{
    hour: number
    planet: string
    energy: number
  }>
  moonSign: string
  moonDescription: string
  todayTheme: string
  recommendations: string[]
  challenges: string[]
}

const ModernAstrologyWidget: React.FC<ModernAstrologyWidgetProps> = ({
  sunSign,
  moonSign,
  risingSign,
  language = 'ru'
}) => {
  const { profileUpdateTrigger } = useAppStore()
  const [metrics, setMetrics] = useState<AstrologyMetrics | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Генерация метрик
  const generateMetrics = (): AstrologyMetrics => {
    const today = new Date()
    const dayOfMonth = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    
    const seed = dayOfMonth + month + year
    
    // Лунные фазы
    const lunarPhases = ['Новолуние', 'Растущая луна', 'Первая четверть', 'Растущая луна', 'Полнолуние', 'Убывающая луна', 'Последняя четверть', 'Убывающая луна']
    const lunarPhase = lunarPhases[seed % lunarPhases.length]
    
    // Активные транзиты
    const planets = ['Солнце', 'Луна', 'Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун', 'Плутон']
    const aspects = ['Соединение', 'Секстиль', 'Квадрат', 'Трин', 'Оппозиция']
    const colors = ['bg-green-900/30 text-green-300', 'bg-yellow-900/30 text-yellow-300', 'bg-red-900/30 text-red-300', 'bg-blue-900/30 text-blue-300', 'bg-purple-900/30 text-purple-300']
    
    const activeTransits = planets.slice(0, 3).map((planet, index) => ({
      planet,
      aspect: aspects[seed % aspects.length],
      intensity: 30 + (seed % 70),
      color: colors[index % colors.length]
    }))
    
    // Благоприятный день
    const favorableDay = 20 + (seed % 80)
    
    // Ретроградные планеты
    const retrogrades = ['Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн'].slice(0, seed % 3)
    
    // Планетарные часы
    const planetaryHours = Array.from({ length: 12 }, (_, hour) => ({
      hour: hour * 2,
      planet: planets[hour % planets.length],
      energy: 20 + (seed + hour) % 80
    }))
    
    // Описание луны
    const moonDescriptions = {
      'Овен': 'Интуитивный и активный',
      'Телец': 'Стабильный и чувственный',
      'Близнецы': 'Коммуникативный и любознательный',
      'Рак': 'Эмоциональный и заботливый',
      'Лев': 'Творческий и гордый',
      'Дева': 'Аналитический и практичный',
      'Весы': 'Гармоничный и дипломатичный',
      'Скорпион': 'Интенсивный и трансформационный',
      'Стрелец': 'Авантюрный и философский',
      'Козерог': 'Амбициозный и дисциплинированный',
      'Водолей': 'Инновационный и независимый',
      'Рыбы': 'Интуитивный и сострадательный'
    }
    
    const moonDescription = moonDescriptions[moonSign as keyof typeof moonDescriptions] || 'Интуитивный'
    
    // Тема дня
    const themes = [
      'Фокус на внутренней работе',
      'Время для общения',
      'Творческий период',
      'Планирование и организация',
      'Отдых и восстановление',
      'Социальные связи'
    ]
    const todayTheme = themes[seed % themes.length]
    
    // Рекомендации
    const recommendations = [
      'Доверьтесь внутреннему голосу',
      'Избегайте важных решений',
      'Фокус на творчестве',
      'Время для планирования',
      'Обратите внимание на здоровье',
      'Развивайте отношения'
    ]
    
    // Вызовы
    const challenges = [
      'Избегайте конфликтов',
      'Не принимайте поспешных решений',
      'Следите за эмоциями',
      'Будьте терпеливы',
      'Не перегружайте себя'
    ]
    
    return {
      lunarPhase,
      activeTransits,
      favorableDay,
      retrogrades,
      planetaryHours,
      moonSign,
      moonDescription,
      todayTheme,
      recommendations: recommendations.slice(0, 3),
      challenges: challenges.slice(0, 2)
    }
  }

  useEffect(() => {
    setMetrics(generateMetrics())
  }, [sunSign, moonSign, risingSign, profileUpdateTrigger])

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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">♈ Астрология</h3>
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
          {/* Луна */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Луна в {metrics.moonSign}</h4>
            </div>
            <p className="text-cosmic-200 text-sm mb-1">{metrics.moonDescription}</p>
            <p className="text-cosmic-400 text-xs">Доверьтесь внутреннему голосу</p>
          </div>

          {/* Активные транзиты */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Активные транзиты</h4>
            </div>
            <div className="space-y-2">
              {metrics.activeTransits.map((transit, index) => (
                <motion.div 
                  key={index}
                  className="flex justify-between text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-cosmic-300">{transit.planet}</span>
                  <span className={`px-2 py-1 rounded text-xs ${transit.color}`}>
                    {transit.aspect}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Благоприятный день */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cosmic-300 font-medium">Благоприятный день</span>
              <span className="text-cosmic-400 text-sm">{metrics.favorableDay}/100</span>
            </div>
            <div className="w-full bg-space-700 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${
                  metrics.favorableDay > 70 ? 'bg-green-500' : 
                  metrics.favorableDay > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.favorableDay}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Лунная фаза */}
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-cosmic-400" />
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
            {/* Планетарные часы */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Планетарные часы</span>
              </div>
              <div className="bg-space-800/50 rounded-lg p-3">
                <div className="flex items-end gap-1 h-16">
                  {metrics.planetaryHours.map((hour, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t flex-1"
                      initial={{ height: 0 }}
                      animate={{ height: `${hour.energy}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                  {metrics.planetaryHours.map((hour, index) => (
                    <span key={index}>{hour.hour}:00</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ретроградные планеты */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Ретроградные планеты</span>
              </div>
              <div className="space-y-2">
                {metrics.retrogrades.map((planet, index) => (
                  <motion.div 
                    key={index}
                    className="text-cosmic-200 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-red-400">{planet}</span> - Замедление коммуникации
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Рекомендации и вызовы */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-cosmic-300">Рекомендации</span>
                </div>
                <div className="space-y-2">
                  {metrics.recommendations.map((rec, index) => (
                    <motion.div 
                      key={index}
                      className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {rec}
                    </motion.div>
                  ))}
                </div>
              </div>
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
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {challenge}
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

export default ModernAstrologyWidget
