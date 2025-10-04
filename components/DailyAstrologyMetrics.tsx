'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Moon, Zap, Calendar, Clock, TrendingUp, Sun } from 'lucide-react'

interface DailyAstrologyMetricsProps {
  sunSign: string
  moonSign: string
  risingSign: string
  language: 'en' | 'ru'
}

export default function DailyAstrologyMetrics({
  sunSign,
  moonSign,
  risingSign,
  language
}: DailyAstrologyMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    console.log('♈ DailyAstrologyMetrics: Setting metrics for signs:', { sunSign, moonSign, risingSign })
    
    const today = new Date()
    const dayOfMonth = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    
    // Рассчитываем астрологические метрики
    const moonInSign = getMoonInSign(dayOfMonth, month)
    const activeTransits = getActiveTransits(dayOfMonth, month)
    const bestTimes = getBestTimes(sunSign, moonSign, dayOfMonth)
    const lunarPhase = getLunarPhase(dayOfMonth, month, year)
    const retrogradePlanets = getRetrogradePlanets(dayOfMonth, month)
    const dailyAspects = getDailyAspects(dayOfMonth, month)
    const favorableDay = calculateFavorableDay(sunSign, moonSign, dayOfMonth)
    const planetActivity = generatePlanetActivity(dayOfMonth, month)
    const transitCalendar = generateTransitCalendar(dayOfMonth, month)
    
    setMetrics({
      moonInSign,
      activeTransits,
      bestTimes,
      lunarPhase,
      retrogradePlanets,
      dailyAspects,
      favorableDay,
      planetActivity,
      transitCalendar,
      dayOfMonth,
      month,
      year
    })
  }, [sunSign, moonSign, risingSign])

  const getMoonInSign = (day: number, month: number) => {
    const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
    const signIndex = (day + month * 2) % 12
    const sign = signs[signIndex]
    
    const emotionalAtmosphere = {
      'Овен': { mood: 'Энергичный', advice: 'Время для новых начинаний', color: 'red' },
      'Телец': { mood: 'Стабильный', advice: 'Фокус на практических делах', color: 'green' },
      'Близнецы': { mood: 'Общительный', advice: 'Время для коммуникации', color: 'yellow' },
      'Рак': { mood: 'Чувствительный', advice: 'Обратите внимание на эмоции', color: 'blue' },
      'Лев': { mood: 'Творческий', advice: 'Проявите себя', color: 'orange' },
      'Дева': { mood: 'Аналитический', advice: 'Время для планирования', color: 'brown' },
      'Весы': { mood: 'Гармоничный', advice: 'Фокус на отношениях', color: 'pink' },
      'Скорпион': { mood: 'Интенсивный', advice: 'Глубокие трансформации', color: 'purple' },
      'Стрелец': { mood: 'Оптимистичный', advice: 'Время для расширения горизонтов', color: 'indigo' },
      'Козерог': { mood: 'Целеустремленный', advice: 'Фокус на долгосрочных целях', color: 'gray' },
      'Водолей': { mood: 'Инновационный', advice: 'Время для оригинальных идей', color: 'cyan' },
      'Рыбы': { mood: 'Интуитивный', advice: 'Доверьтесь внутреннему голосу', color: 'teal' }
    }
    
    return {
      sign,
      ...emotionalAtmosphere[sign as keyof typeof emotionalAtmosphere]
    }
  }

  const getActiveTransits = (day: number, month: number) => {
    const planets = ['Солнце', 'Луна', 'Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун', 'Плутон']
    const aspects = ['Соединение', 'Секстиль', 'Квадрат', 'Трин', 'Оппозиция']
    
    return planets.slice(0, 3).map(planet => ({
      planet,
      aspect: aspects[Math.floor(Math.random() * aspects.length)],
      influence: Math.random() > 0.5 ? 'Благоприятное' : 'Нейтральное',
      intensity: Math.floor(Math.random() * 5) + 1
    }))
  }

  const getBestTimes = (sunSign: string, moonSign: string, day: number) => {
    const times = {
      work: { start: '09:00', end: '12:00', description: 'Пик продуктивности' },
      relationships: { start: '18:00', end: '21:00', description: 'Лучшее время для общения' },
      creativity: { start: '14:00', end: '17:00', description: 'Вдохновение и инновации' },
      rest: { start: '22:00', end: '06:00', description: 'Время для восстановления' }
    }
    
    return times
  }

  const getLunarPhase = (day: number, month: number, year: number) => {
    const lunarCycle = 29.5
    const daysSinceNewMoon = (day + month * 30 + year * 365) % lunarCycle
    
    if (daysSinceNewMoon < 7.4) return { phase: 'Новолуние', energy: 'Низкая', advice: 'Время для планирования' }
    if (daysSinceNewMoon < 14.7) return { phase: 'Первая четверть', energy: 'Растущая', advice: 'Время для действий' }
    if (daysSinceNewMoon < 22.1) return { phase: 'Полнолуние', energy: 'Высокая', advice: 'Время для завершения' }
    return { phase: 'Последняя четверть', energy: 'Убывающая', advice: 'Время для очищения' }
  }

  const getRetrogradePlanets = (day: number, month: number) => {
    const planets = ['Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун', 'Плутон']
    const retrograde = []
    
    // Меркурий ретрограден каждые 3-4 месяца
    if ((day + month) % 90 < 20) retrograde.push({ planet: 'Меркурий', effect: 'Замедление коммуникации' })
    
    // Венера ретроградна каждые 18 месяцев
    if ((day + month * 30) % 540 < 40) retrograde.push({ planet: 'Венера', effect: 'Пересмотр отношений' })
    
    // Марс ретрограден каждые 2 года
    if ((day + month * 30) % 730 < 60) retrograde.push({ planet: 'Марс', effect: 'Замедление действий' })
    
    return retrograde
  }

  const getDailyAspects = (day: number, month: number) => {
    const aspects = [
      { name: 'Солнце-Луна', type: 'Гармоничный', influence: 'Эмоциональная стабильность' },
      { name: 'Меркурий-Венера', type: 'Напряженный', influence: 'Сложности в общении' },
      { name: 'Марс-Юпитер', type: 'Гармоничный', influence: 'Энергия и оптимизм' }
    ]
    
    return aspects.slice(0, 2)
  }

  const calculateFavorableDay = (sunSign: string, moonSign: string, day: number) => {
    let score = 5
    
    // Базовый скор по дню месяца
    score += (day % 9) - 4
    
    // Бонус за совместимость знаков
    if (sunSign === moonSign) score += 2
    
    // Случайная вариация
    score += Math.floor(Math.random() * 3) - 1
    
    return Math.max(1, Math.min(10, score))
  }

  const generatePlanetActivity = (day: number, month: number) => {
    const planets = ['Солнце', 'Луна', 'Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун', 'Плутон']
    
    return planets.map(planet => ({
      planet,
      activity: Math.floor(Math.random() * 10) + 1,
      influence: Math.random() > 0.5 ? 'Позитивное' : 'Нейтральное'
    }))
  }

  const generateTransitCalendar = (day: number, month: number) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push({
        date: date.getDate(),
        day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()],
        favorable: Math.random() > 0.3,
        intensity: Math.floor(Math.random() * 5) + 1
      })
    }
    return days
  }

  if (!metrics) {
    return (
      <div className="cosmic-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-space-700 rounded mb-2"></div>
          <div className="h-4 bg-space-700 rounded mb-4"></div>
          <div className="h-8 bg-space-700 rounded"></div>
        </div>
        <p className="text-cosmic-500 text-sm mt-2">Загрузка ежедневных метрик астрологии...</p>
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">♈ Астрология</h3>
          <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="space-y-4">
        {/* Луна в знаке */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-cosmic-400" />
            <h4 className="font-semibold text-cosmic-300">Луна в {metrics.moonInSign.sign}</h4>
          </div>
          <p className="text-cosmic-200 text-sm mb-1">{metrics.moonInSign.mood}</p>
          <p className="text-cosmic-400 text-xs">{metrics.moonInSign.advice}</p>
        </div>

        {/* Активные транзиты */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cosmic-400" />
            <h4 className="font-semibold text-cosmic-300">Активные транзиты</h4>
          </div>
          <div className="space-y-2">
            {metrics.activeTransits.map((transit: any, index: number) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-cosmic-300">{transit.planet}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  transit.influence === 'Благоприятное' ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300'
                }`}>
                  {transit.aspect}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Благоприятный день */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cosmic-300 font-medium">Благоприятный день</span>
            <span className="text-cosmic-400 text-sm">{metrics.favorableDay}/10</span>
          </div>
          <div className="w-full bg-space-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.favorableDay * 10}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                metrics.favorableDay >= 8 ? 'bg-green-500' :
                metrics.favorableDay >= 6 ? 'bg-yellow-500' :
                metrics.favorableDay >= 4 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Лунные фазы */}
        <div className="bg-space-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-cosmic-400" />
            <h4 className="font-semibold text-cosmic-300">Лунная фаза</h4>
          </div>
          <p className="text-cosmic-200 text-sm mb-1">{metrics.lunarPhase.phase}</p>
          <p className="text-cosmic-400 text-xs">{metrics.lunarPhase.advice}</p>
        </div>

        {/* Ретроградные планеты */}
        {metrics.retrogradePlanets.length > 0 && (
          <div className="bg-space-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cosmic-400" />
              <h4 className="font-semibold text-cosmic-300">Ретроградные планеты</h4>
            </div>
            {metrics.retrogradePlanets.map((planet: any, index: number) => (
              <div key={index} className="text-cosmic-200 text-sm mb-1">
                <span className="text-red-400">{planet.planet}</span> - {planet.effect}
              </div>
            ))}
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
            {/* Лучшее время для дел */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-3">Лучшее время для дел</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(metrics.bestTimes).map(([key, time]: [string, any]) => (
                  <div key={key} className="text-center">
                    <div className="text-cosmic-400 text-xs mb-1 capitalize">{key}</div>
                    <div className="text-cosmic-200 text-sm font-medium">{time.start}-{time.end}</div>
                    <div className="text-cosmic-500 text-xs">{time.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Аспекты дня */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-3">Аспекты дня</h4>
              <div className="space-y-2">
                {metrics.dailyAspects.map((aspect: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-cosmic-300 text-sm">{aspect.name}</span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        aspect.type === 'Гармоничный' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                      }`}>
                        {aspect.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* График активности планет */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-3">Активность планет</h4>
              <div className="grid grid-cols-5 gap-2">
                {metrics.planetActivity.slice(0, 5).map((planet: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-cosmic-400 text-xs mb-1">{planet.planet}</div>
                    <div className="w-full bg-space-700 rounded h-8 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${planet.activity * 10}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`w-full rounded ${
                          planet.influence === 'Позитивное' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Календарь транзитов */}
            <div className="bg-space-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-cosmic-300 mb-3">Календарь транзитов</h4>
              <div className="grid grid-cols-7 gap-1">
                {metrics.transitCalendar.map((day: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-cosmic-500 text-xs mb-1">{day.day}</div>
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                      day.favorable ? 'bg-green-900/30 text-green-300' : 'bg-space-700 text-cosmic-400'
                    }`}>
                      {day.date}
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
