'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Palette, TrendingUp, Star, Zap, Sparkles, Activity, Target } from 'lucide-react'

interface ModernNumerologyWidgetProps {
  lifePathNumber: number
  expressionNumber: number
  soulUrgeNumber: number
  personalityNumber: number
  language?: string
}

interface DailyMetrics {
  dayNumber: number
  personalDayNumber: number
  energyLevel: number
  favorableNumbers: number[]
  recommendedColors: string[]
  bestTimes: string[]
  weeklyEnergy: number[]
  todayScore: number
  moodScore: number
  creativityScore: number
  socialScore: number
}

const ModernNumerologyWidget: React.FC<ModernNumerologyWidgetProps> = ({
  lifePathNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  language = 'ru'
}) => {
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Функция для сокращения до одной цифры
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    }
    return num
  }

  // Функция для вычисления числа дня
  const calculateDayNumber = (date: Date): number => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    const sum = day + month + year
    return reduceToSingleDigit(sum)
  }

  // Функция для вычисления персонального числа дня
  const calculatePersonalDayNumber = (date: Date): number => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    const sum = day + month + year + lifePathNumber
    return reduceToSingleDigit(sum)
  }

  // Генерация метрик
  const generateMetrics = (): DailyMetrics => {
    const today = new Date()
    const dayNumber = calculateDayNumber(today)
    const personalDayNumber = calculatePersonalDayNumber(today)
    
    // Генерация случайных, но стабильных данных
    const seed = dayNumber + personalDayNumber
    const energyLevel = 60 + (seed % 40)
    const moodScore = 50 + (seed % 50)
    const creativityScore = 40 + (seed % 60)
    const socialScore = 45 + (seed % 55)
    
    const favorableNumbers = [
      dayNumber,
      personalDayNumber,
      reduceToSingleDigit(dayNumber + personalDayNumber)
    ].filter((num, index, arr) => arr.indexOf(num) === index)

    const colors = ['Зеленый', 'Синий', 'Фиолетовый', 'Золотой', 'Серебряный', 'Красный', 'Оранжевый', 'Желтый']
    const recommendedColors = colors.slice(seed % 3, (seed % 3) + 3)

    const times = ['08:00-10:00', '14:00-16:00', '18:00-20:00', '20:00-22:00']
    const bestTimes = times.slice(seed % 2, (seed % 2) + 2)

    // Генерация недельной энергии
    const weeklyEnergy = Array.from({ length: 7 }, (_, i) => {
      const daySeed = (seed + i) % 100
      return 30 + (daySeed % 70)
    })

    return {
      dayNumber,
      personalDayNumber,
      energyLevel,
      favorableNumbers,
      recommendedColors,
      bestTimes,
      weeklyEnergy,
      todayScore: energyLevel,
      moodScore,
      creativityScore,
      socialScore
    }
  }

  useEffect(() => {
    setMetrics(generateMetrics())
  }, [lifePathNumber, expressionNumber, soulUrgeNumber, personalityNumber])

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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">📊 Нумерология</h3>
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

        {/* Компактные метрики */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div 
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-3 border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-1">{metrics.dayNumber}</div>
              <div className="text-xs text-cosmic-300">Число дня</div>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-1">{metrics.personalDayNumber}</div>
              <div className="text-xs text-cosmic-300">Персональное число</div>
            </div>
          </motion.div>
        </div>

        {/* Круговая диаграмма энергии */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-cosmic-300 font-medium">Энергия дня</span>
            <span className="text-sm text-white font-bold">{metrics.energyLevel}%</span>
          </div>
          <div className="relative w-full h-3 bg-space-700/50 rounded-full overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.energyLevel}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Мини-график недельной энергии */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cosmic-400" />
            <span className="text-sm font-medium text-cosmic-300">Энергия за неделю</span>
          </div>
          <div className="flex items-end gap-1 h-12">
            {metrics.weeklyEnergy.map((energy, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-t from-cosmic-600 to-cosmic-400 rounded-t flex-1"
                initial={{ height: 0 }}
                animate={{ height: `${energy}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-cosmic-500 mt-1">
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
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
            {/* Радарная диаграмма */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Показатели дня</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Настроение</span>
                    <span className="text-xs text-white font-bold">{metrics.moodScore}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.moodScore}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Креативность</span>
                    <span className="text-xs text-white font-bold">{metrics.creativityScore}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.creativityScore}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Социальность</span>
                    <span className="text-xs text-white font-bold">{metrics.socialScore}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.socialScore}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </div>
                <div className="bg-space-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cosmic-300">Активность</span>
                    <span className="text-xs text-white font-bold">{metrics.energyLevel}%</span>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.energyLevel}%` }}
                      transition={{ duration: 1, delay: 1.0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Благоприятные числа */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Благоприятные числа</span>
              </div>
              <div className="flex gap-2">
                {metrics.favorableNumbers.map((num, index) => (
                  <motion.div 
                    key={index} 
                    className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center text-sm font-bold text-cosmic-100"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Рекомендуемые цвета */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Рекомендуемые цвета</span>
              </div>
              <div className="flex gap-2">
                {metrics.recommendedColors.map((color, index) => (
                  <motion.div 
                    key={index} 
                    className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {color}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Лучшее время */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cosmic-400" />
                <span className="text-sm font-medium text-cosmic-300">Лучшее время</span>
              </div>
              <div className="flex gap-2">
                {metrics.bestTimes.map((time, index) => (
                  <motion.div 
                    key={index} 
                    className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {time}
                  </motion.div>
                ))}
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

export default ModernNumerologyWidget
