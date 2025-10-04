'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Palette, TrendingUp, Star, Zap, Sparkles } from 'lucide-react'

interface DailyNumerologyMetricsProps {
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
}

const DailyNumerologyMetrics: React.FC<DailyNumerologyMetricsProps> = ({
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
  const calculatePersonalDayNumber = (dayNumber: number, lifePath: number): number => {
    return reduceToSingleDigit(dayNumber + lifePath)
  }

  // Функция для вычисления энергетического уровня
  const calculateEnergyLevel = (personalDayNumber: number, dayNumber: number): number => {
    const baseEnergy = personalDayNumber * 10
    const dayBonus = dayNumber * 2
    return Math.min(100, Math.max(10, baseEnergy + dayBonus))
  }

  // Функция для получения благоприятных чисел
  const getFavorableNumbers = (lifePath: number, expression: number, soulUrge: number): number[] => {
    const numbers = [lifePath, expression, soulUrge]
    const uniqueNumbers = Array.from(new Set(numbers))
    return uniqueNumbers.sort()
  }

  // Функция для получения рекомендуемых цветов
  const getRecommendedColors = (dayNumber: number): string[] => {
    const colorMap: { [key: number]: string[] } = {
      1: ['Красный', 'Оранжевый', 'Золотой'],
      2: ['Серебряный', 'Белый', 'Светло-голубой'],
      3: ['Желтый', 'Оранжевый', 'Ярко-розовый'],
      4: ['Зеленый', 'Коричневый', 'Темно-синий'],
      5: ['Синий', 'Серебряный', 'Серый'],
      6: ['Розовый', 'Лавандовый', 'Мягкий зеленый'],
      7: ['Фиолетовый', 'Темно-синий', 'Серебряный'],
      8: ['Черный', 'Темно-красный', 'Золотой'],
      9: ['Белый', 'Золотой', 'Яркие цвета']
    }
    return colorMap[dayNumber] || ['Синий', 'Зеленый', 'Фиолетовый']
  }

  // Функция для получения лучшего времени
  const getBestTimes = (dayNumber: number): string[] => {
    const timeMap: { [key: number]: string[] } = {
      1: ['06:00-08:00', '14:00-16:00'],
      2: ['09:00-11:00', '19:00-21:00'],
      3: ['10:00-12:00', '15:00-17:00'],
      4: ['08:00-10:00', '16:00-18:00'],
      5: ['11:00-13:00', '17:00-19:00'],
      6: ['07:00-09:00', '18:00-20:00'],
      7: ['06:00-08:00', '20:00-22:00'],
      8: ['08:00-10:00', '14:00-16:00'],
      9: ['09:00-11:00', '15:00-17:00']
    }
    return timeMap[dayNumber] || ['10:00-12:00', '16:00-18:00']
  }

  // Функция для генерации недельных данных
  const generateWeeklyEnergy = (): number[] => {
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - 6 + i)
      const dayNum = calculateDayNumber(date)
      const personalNum = calculatePersonalDayNumber(dayNum, lifePathNumber)
      week.push(calculateEnergyLevel(personalNum, dayNum))
    }
    return week
  }

  useEffect(() => {
    // Проверяем, что все необходимые данные доступны
    if (lifePathNumber === undefined || lifePathNumber === null) {
      console.log('⚠️ DailyNumerologyMetrics: lifePathNumber is not available yet')
      return
    }

    const today = new Date()
    const dayNumber = calculateDayNumber(today)
    const personalDayNumber = calculatePersonalDayNumber(dayNumber, lifePathNumber)
    const energyLevel = calculateEnergyLevel(personalDayNumber, dayNumber)
    
    const weeklyEnergy = generateWeeklyEnergy()
    const todayScore = Math.round(energyLevel)

    const newMetrics: DailyMetrics = {
      dayNumber,
      personalDayNumber,
      energyLevel,
      favorableNumbers: getFavorableNumbers(lifePathNumber, expressionNumber || 0, soulUrgeNumber || 0),
      recommendedColors: getRecommendedColors(dayNumber),
      bestTimes: getBestTimes(dayNumber),
      weeklyEnergy,
      todayScore
    }

    console.log('📊 DailyNumerologyMetrics: Setting metrics:', newMetrics)
    setMetrics(newMetrics)
  }, [lifePathNumber, expressionNumber, soulUrgeNumber])

  if (!metrics) {
    return (
      <div className="cosmic-card p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-space-700 rounded mb-2"></div>
          <div className="h-4 bg-space-700 rounded w-3/4"></div>
        </div>
        <div className="text-xs text-cosmic-500 mt-2">
          Загрузка ежедневных метрик...
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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      {/* Заголовок с кнопкой развернуть */}
      <div 
        className="relative flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {language === 'ru' ? '📊 Нумерология' : '📊 Numerology'}
            </h3>
            <p className="text-cosmic-300 text-xs">
              {language === 'ru' ? 'Ежедневные метрики' : 'Daily Metrics'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 bg-cosmic-600/30 rounded-lg flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-cosmic-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Основные метрики */}
      <div className="relative grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-3 border border-purple-500/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">
              {metrics.dayNumber}
            </div>
            <div className="text-xs text-cosmic-300">
              {language === 'ru' ? 'Число дня' : 'Day Number'}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">
              {metrics.personalDayNumber}
            </div>
            <div className="text-xs text-cosmic-300">
              {language === 'ru' ? 'Персональное число' : 'Personal Number'}
            </div>
          </div>
        </div>
      </div>

      {/* Прогресс-бар энергии */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-cosmic-300 font-medium">
            {language === 'ru' ? 'Энергия дня' : 'Day Energy'}
          </span>
          <span className="text-sm text-white font-bold">
            {metrics.todayScore}%
          </span>
        </div>
        <div className="w-full bg-space-700/50 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${metrics.todayScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Развернутые метрики */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-4 border-t border-space-700">
          {/* Благоприятные числа */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-cosmic-400" />
              <span className="text-sm font-medium text-cosmic-300">
                {language === 'ru' ? 'Благоприятные числа' : 'Favorable Numbers'}
              </span>
            </div>
            <div className="flex gap-2">
              {metrics.favorableNumbers.map((num, index) => (
                <div key={index} className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center text-sm font-bold text-cosmic-100">
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Рекомендуемые цвета */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-cosmic-400" />
              <span className="text-sm font-medium text-cosmic-300">
                {language === 'ru' ? 'Рекомендуемые цвета' : 'Recommended Colors'}
              </span>
            </div>
            <div className="flex gap-2">
              {metrics.recommendedColors.map((color, index) => (
                <div key={index} className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">
                  {color}
                </div>
              ))}
            </div>
          </div>

          {/* Лучшее время */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cosmic-400" />
              <span className="text-sm font-medium text-cosmic-300">
                {language === 'ru' ? 'Лучшее время' : 'Best Times'}
              </span>
            </div>
            <div className="flex gap-2">
              {metrics.bestTimes.map((time, index) => (
                <div key={index} className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* График недельной энергии */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cosmic-400" />
              <span className="text-sm font-medium text-cosmic-300">
                {language === 'ru' ? 'Энергия за неделю' : 'Weekly Energy'}
              </span>
            </div>
            <div className="flex items-end gap-1 h-16">
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
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DailyNumerologyMetrics
