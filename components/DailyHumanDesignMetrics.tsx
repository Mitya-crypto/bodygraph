'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Moon, Target, Brain, Zap, Calendar, Clock } from 'lucide-react'

interface DailyHumanDesignMetricsProps {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  language: 'en' | 'ru'
}

export default function DailyHumanDesignMetrics({
  type,
  strategy,
  authority,
  profile,
  definition,
  language
}: DailyHumanDesignMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    console.log('🧬 DailyHumanDesignMetrics: Setting metrics for type:', type)
    
    const today = new Date()
    const dayOfMonth = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    
    // Рассчитываем метрики на основе типа
    const strategyAdvice = getStrategyAdvice(type, strategy, dayOfMonth)
    const authorityFocus = getAuthorityFocus(authority, dayOfMonth)
    const energyLevel = calculateEnergyLevel(type, dayOfMonth)
    const lunarPhase = getLunarPhase(dayOfMonth, month, year)
    const activeCenters = getActiveCenters(type, dayOfMonth)
    const undefinedCenters = getUndefinedCenters(type, dayOfMonth)
    const hourlyEnergy = generateHourlyEnergy(type, dayOfMonth)
    
    setMetrics({
      strategyAdvice,
      authorityFocus,
      energyLevel,
      lunarPhase,
      activeCenters,
      undefinedCenters,
      hourlyEnergy,
      dayOfMonth,
      month,
      year
    })
  }, [type, strategy, authority, profile, definition])

  const getStrategyAdvice = (type: string, strategy: string, day: number) => {
    const strategies = {
      'Generator': {
        advice: 'Отвечайте на то, что приходит к вам сегодня',
        focus: 'Слушайте сакральный отклик',
        color: 'green'
      },
      'Manifesting Generator': {
        advice: 'Отвечайте, затем информируйте о своих действиях',
        focus: 'Быстрые решения с информированием',
        color: 'orange'
      },
      'Projector': {
        advice: 'Ждите приглашения, особенно сегодня',
        focus: 'Распознавание правильных возможностей',
        color: 'yellow'
      },
      'Manifestor': {
        advice: 'Информируйте перед действием',
        focus: 'Планирование и уведомление',
        color: 'red'
      },
      'Reflector': {
        advice: 'Ждите лунный цикл для принятия решений',
        focus: 'Особое внимание к лунным фазам',
        color: 'purple'
      }
    }
    
    return strategies[type as keyof typeof strategies] || {
      advice: 'Следуйте вашей стратегии',
      focus: 'Внутренний авторитет',
      color: 'blue'
    }
  }

  const getAuthorityFocus = (authority: string, day: number) => {
    const authorities = {
      'Emotional': {
        focus: 'Дождитесь эмоциональной ясности',
        advice: 'Не принимайте решений в эмоциональных волнах',
        timing: 'Лучшее время: вечер'
      },
      'Sacral': {
        focus: 'Слушайте сакральные звуки',
        advice: 'Отвечайте только на то, что вызывает отклик',
        timing: 'Лучшее время: утро-день'
      },
      'Splenic': {
        focus: 'Доверяйте интуитивным ощущениям',
        advice: 'Первая мысль - правильная',
        timing: 'Лучшее время: утро'
      },
      'Ego': {
        focus: 'Проверьте сердечный отклик',
        advice: 'Действуйте от сердца',
        timing: 'Лучшее время: день'
      },
      'Self-Projected': {
        focus: 'Слушайте свой голос',
        advice: 'Говорите вслух для ясности',
        timing: 'Лучшее время: любое'
      },
      'Environmental': {
        focus: 'Обращайте внимание на окружение',
        advice: 'Место и люди влияют на решения',
        timing: 'Лучшее время: в подходящем месте'
      },
      'Lunar': {
        focus: 'Следите за лунными фазами',
        advice: 'Особенно важно для Рефлекторов',
        timing: 'Лучшее время: согласно лунному циклу'
      }
    }
    
    return authorities[authority as keyof typeof authorities] || {
      focus: 'Следуйте внутреннему авторитету',
      advice: 'Доверяйте себе',
      timing: 'Лучшее время: когда чувствуете ясность'
    }
  }

  const calculateEnergyLevel = (type: string, day: number) => {
    const baseEnergy = {
      'Generator': 8,
      'Manifesting Generator': 9,
      'Projector': 6,
      'Manifestor': 7,
      'Reflector': 5
    }
    
    const base = baseEnergy[type as keyof typeof baseEnergy] || 6
    const dayVariation = (day % 9) + 1
    const energy = Math.min(10, Math.max(1, base + (dayVariation - 5) * 0.5))
    
    return Math.round(energy * 10) / 10
  }

  const getLunarPhase = (day: number, month: number, year: number) => {
    // Упрощенный расчет лунной фазы
    const lunarCycle = 29.5
    const daysSinceNewMoon = (day + month * 30 + year * 365) % lunarCycle
    
    if (daysSinceNewMoon < 7.4) return { phase: 'Новолуние', energy: 'Низкая', advice: 'Время для планирования' }
    if (daysSinceNewMoon < 14.7) return { phase: 'Первая четверть', energy: 'Растущая', advice: 'Время для действий' }
    if (daysSinceNewMoon < 22.1) return { phase: 'Полнолуние', energy: 'Высокая', advice: 'Время для завершения' }
    return { phase: 'Последняя четверть', energy: 'Убывающая', advice: 'Время для очищения' }
  }

  const getActiveCenters = (type: string, day: number) => {
    const centers = {
      'Generator': ['Сакральный', 'Корневой', 'Солнечное сплетение'],
      'Manifesting Generator': ['Сакральный', 'Корневой', 'Солнечное сплетение', 'Горловой'],
      'Projector': ['Горловой', 'Солнечное сплетение'],
      'Manifestor': ['Горловой', 'Корневой'],
      'Reflector': []
    }
    
    return centers[type as keyof typeof centers] || []
  }

  const getUndefinedCenters = (type: string, day: number) => {
    const allCenters = ['Корневой', 'Сакральный', 'Солнечное сплетение', 'Сердечный', 'Горловой', 'Аджна', 'Теменной', 'Селезеночный', 'G-центр']
    const active = getActiveCenters(type, day)
    return allCenters.filter(center => !(active as any[]).includes(center))
  }

  const generateHourlyEnergy = (type: string, day: number) => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    return hours.map(hour => {
      let energy = 5
      
      // Базовый уровень по типу
      if (type === 'Generator' || type === 'Manifesting Generator') {
        energy = hour >= 6 && hour <= 18 ? 8 : 4
      } else if (type === 'Projector') {
        energy = hour >= 9 && hour <= 17 ? 7 : 3
      } else if (type === 'Manifestor') {
        energy = hour >= 7 && hour <= 19 ? 6 : 5
      } else if (type === 'Reflector') {
        energy = 4 + Math.sin((hour - 6) * Math.PI / 12) * 2
      }
      
      // Добавляем вариацию по дню
      energy += Math.sin((hour + day) * Math.PI / 12) * 1.5
      
      return {
        hour,
        energy: Math.max(1, Math.min(10, Math.round(energy * 10) / 10))
      }
    })
  }

  if (!metrics) {
    return (
      <div className="cosmic-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-space-700 rounded mb-2"></div>
          <div className="h-4 bg-space-700 rounded mb-4"></div>
          <div className="h-8 bg-space-700 rounded"></div>
        </div>
        <p className="text-cosmic-500 text-sm mt-2">Загрузка ежедневных метрик Human Design...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">🧬 Human Design</h3>
          <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="space-y-4">
        {/* Стратегия дня */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cosmic-400" />
            <h4 className="font-semibold text-cosmic-300">Стратегия дня</h4>
          </div>
          <p className="text-cosmic-200 text-sm mb-2">{metrics.strategyAdvice.advice}</p>
          <p className="text-cosmic-400 text-xs">Фокус: {metrics.strategyAdvice.focus}</p>
        </div>

        {/* Авторитет в действии */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cosmic-400" />
            <h4 className="font-semibold text-cosmic-300">Авторитет в действии</h4>
          </div>
          <p className="text-cosmic-200 text-sm mb-2">{metrics.authorityFocus.focus}</p>
          <p className="text-cosmic-400 text-xs">{metrics.authorityFocus.timing}</p>
        </div>

        {/* Уровень энергии */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cosmic-300 font-medium">Уровень энергии</span>
            <span className="text-cosmic-400 text-sm">{metrics.energyLevel}/10</span>
          </div>
          <div className="w-full bg-space-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.energyLevel * 10}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                metrics.energyLevel >= 8 ? 'bg-green-500' :
                metrics.energyLevel >= 6 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Лунные фазы (особенно для Рефлекторов) */}
        {type === 'Reflector' && (
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Лунная фаза</h4>
            </div>
            <p className="text-cosmic-200 text-sm mb-1">{metrics.lunarPhase.phase}</p>
            <p className="text-cosmic-400 text-xs">{metrics.lunarPhase.advice}</p>
          </div>
        )}

        {/* Кнопка развертывания */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-sm py-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? 'Свернуть детали' : 'Развернуть детали'}
        </motion.button>

        {/* Развернутые детали */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Определенные центры */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-2">Определенные центры</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.activeCenters.map((center: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                    {center}
                  </span>
                ))}
              </div>
            </div>

            {/* Неопределенные центры */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-2">Неопределенные центры</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.undefinedCenters.slice(0, 5).map((center: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-yellow-900/30 text-yellow-300 text-xs rounded">
                    {center}
                  </span>
                ))}
                {metrics.undefinedCenters.length > 5 && (
                  <span className="px-2 py-1 bg-space-700 text-cosmic-400 text-xs rounded">
                    +{metrics.undefinedCenters.length - 5} еще
                  </span>
                )}
              </div>
            </div>

            {/* График энергии по часам */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-3">График энергии по часам</h4>
              <div className="grid grid-cols-12 gap-1">
                {metrics.hourlyEnergy.slice(6, 22).map((hour: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-cosmic-500 mb-1">{hour.hour}:00</div>
                    <div className="w-full bg-space-700 rounded h-8 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${hour.energy * 10}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`w-full rounded ${
                          hour.energy >= 8 ? 'bg-green-500' :
                          hour.energy >= 6 ? 'bg-yellow-500' :
                          hour.energy >= 4 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
