import { calculateNumerology } from './numerology'
import { calculateHumanDesign } from './humanDesignCalculator'

export interface UserProfile {
  id: string
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  coordinates: {
    lat: number
    lng: number
  }
  telegramId?: number
}

export interface CollectedAssistantData {
  user: {
    profile: UserProfile
  }
  numerology: {
    lifePathNumber: number
    expressionNumber: number
    soulUrgeNumber: number
    personalityNumber: number
    dailyMetrics: {
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
  }
  humanDesign: {
    type: string
    strategy: string
    authority: string
    profile: string
    definition: string
    centers: Array<{
      name: string
      defined: boolean
      color: string
    }>
    channels: Array<{
      number: string
      name: string
      gates: string[]
    }>
    gates: Array<{
      number: string
      name: string
      center: string
    }>
    incarnationCross: {
      name: string
      description: string
    }
  }
  astrology: {
    sunSign: string
    moonSign: string
    risingSign: string
    natalChart: {
      planets: Array<{
        name: string
        longitude: number
        latitude: number
      }>
      houses: Array<{
        cusp: number
      }>
      ascendant: number
      mc: number
    }
    transits: {
      totalTransits: number
      majorTransits: number
      overallInfluence: string
      keyThemes: string[]
      recommendations: string[]
      activeTransits: Array<{
        planet: string
        aspect: string
        influence: string
      }>
    }
  }
  timestamp: string
  sessionId: string
}

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
  return reduceToSingleDigit(day + month + year)
}

// Функция для вычисления персонального числа дня
const calculatePersonalDayNumber = (birthDate: string, currentDate: Date): number => {
  const birth = new Date(birthDate)
  const birthDay = birth.getDate()
  const birthMonth = birth.getMonth() + 1
  
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  
  const sum = birthDay + birthMonth + currentDay + currentMonth + currentYear
  return reduceToSingleDigit(sum)
}

// Функция для генерации случайных метрик (в реальном приложении это должно быть более сложной логикой)
const generateDailyMetrics = (lifePathNumber: number, currentDate: Date, birthDate: string) => {
  const dayNumber = calculateDayNumber(currentDate)
  const personalDayNumber = calculatePersonalDayNumber(birthDate, currentDate)
  
  // Базовые цвета для разных чисел
  const colorMap: { [key: number]: string[] } = {
    1: ['Красный', 'Золотой', 'Белый'],
    2: ['Серебряный', 'Белый', 'Голубой'],
    3: ['Желтый', 'Оранжевый', 'Розовый'],
    4: ['Зеленый', 'Коричневый', 'Темно-синий'],
    5: ['Синий', 'Серый', 'Бирюзовый'],
    6: ['Розовый', 'Голубой', 'Белый'],
    7: ['Фиолетовый', 'Серебряный', 'Белый'],
    8: ['Черный', 'Коричневый', 'Темно-красный'],
    9: ['Золотой', 'Белый', 'Прозрачный']
  }
  
  // Базовые времена для разных чисел
  const timeMap: { [key: number]: string[] } = {
    1: ['08:00-10:00', '16:00-18:00'],
    2: ['09:00-11:00', '19:00-21:00'],
    3: ['10:00-12:00', '14:00-16:00'],
    4: ['07:00-09:00', '15:00-17:00'],
    5: ['11:00-13:00', '17:00-19:00'],
    6: ['12:00-14:00', '18:00-20:00'],
    7: ['06:00-08:00', '20:00-22:00'],
    8: ['13:00-15:00', '21:00-23:00'],
    9: ['14:00-16:00', '22:00-24:00']
  }
  
  return {
    dayNumber,
    personalDayNumber,
    energyLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
    favorableNumbers: [lifePathNumber, dayNumber, personalDayNumber].slice(0, 3),
    recommendedColors: colorMap[lifePathNumber] || ['Синий', 'Зеленый', 'Белый'],
    bestTimes: timeMap[lifePathNumber] || ['08:00-10:00', '16:00-18:00'],
    weeklyEnergy: Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 60),
    todayScore: Math.floor(Math.random() * 40) + 60,
    moodScore: Math.floor(Math.random() * 40) + 60,
    creativityScore: Math.floor(Math.random() * 40) + 60,
    socialScore: Math.floor(Math.random() * 40) + 60
  }
}

export async function collectAllAssistantData(profile: UserProfile): Promise<CollectedAssistantData> {
  console.log('🔍 Collecting all assistant data for:', profile.name)
  
  // Получаем Telegram ID если доступен
  let telegramId = profile.telegramId
  if (!telegramId && typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
    telegramId = (window as any).Telegram.WebApp.initDataUnsafe.user.id
    console.log('📱 Telegram ID detected:', telegramId)
  }
  
  const currentDate = new Date()
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 1. Собираем данные нумерологии
    console.log('📊 Collecting numerology data...')
    const numerologyData = calculateNumerology(profile.name, profile.birthDate)
    const dailyMetrics = generateDailyMetrics(numerologyData.lifePath, currentDate, profile.birthDate)
    
    // 2. Собираем данные Human Design
    console.log('🧬 Collecting Human Design data...')
    const birthDate = new Date(profile.birthDate)
    const birthTime = new Date(`1970-01-01T${profile.birthTime}`)
    
    const humanDesignData = calculateHumanDesign({
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: birthTime.getHours(),
      minute: birthTime.getMinutes(),
      latitude: profile.coordinates?.lat || 55.7558,
      longitude: profile.coordinates?.lng || 37.6176
    })
    
    // 3. Собираем данные астрологии (пока что мокированные)
    console.log('♈ Collecting astrology data...')
    const astrologyData = {
      sunSign: 'Близнецы',
      moonSign: 'Лев',
      risingSign: 'Скорпион',
      natalChart: {
        planets: [
          { name: 'Sun', longitude: 191.32, latitude: 0 },
          { name: 'Moon', longitude: 145.67, latitude: 0 },
          { name: 'Mercury', longitude: 178.45, latitude: 0 },
          { name: 'Venus', longitude: 203.89, latitude: 0 },
          { name: 'Mars', longitude: 156.78, latitude: 0 },
          { name: 'Jupiter', longitude: 234.56, latitude: 0 },
          { name: 'Saturn', longitude: 267.89, latitude: 0 },
          { name: 'Uranus', longitude: 298.12, latitude: 0 },
          { name: 'Neptune', longitude: 312.45, latitude: 0 },
          { name: 'Pluto', longitude: 289.67, latitude: 0 }
        ],
        houses: Array.from({ length: 12 }, (_, i) => ({ cusp: i * 30 })),
        ascendant: 151.67,
        mc: 117.80
      },
      transits: {
        totalTransits: 9,
        majorTransits: 3,
        overallInfluence: 'moderate',
        keyThemes: ['творчество', 'коммуникация', 'интуиция'],
        recommendations: [
          'Благоприятное время для новых начинаний',
          'Фокус на коммуникации и самовыражении',
          'Доверьтесь интуиции при принятии решений'
        ],
        activeTransits: [
          { planet: 'Солнце', aspect: 'Трин', influence: 'Позитивная' },
          { planet: 'Луна', aspect: 'Секстиль', influence: 'Нейтральная' },
          { planet: 'Меркурий', aspect: 'Квадрат', influence: 'Сложная' }
        ]
      }
    }
    
    const collectedData: CollectedAssistantData = {
      user: {
        profile: {
          ...profile,
          telegramId: telegramId
        }
      },
      numerology: {
        lifePathNumber: numerologyData.lifePath,
        expressionNumber: numerologyData.expression,
        soulUrgeNumber: numerologyData.soulUrge,
        personalityNumber: numerologyData.personality,
        dailyMetrics
      },
      humanDesign: humanDesignData as any,
      astrology: astrologyData,
      timestamp: currentDate.toISOString(),
      sessionId
    }
    
    console.log('✅ All assistant data collected successfully')
    return collectedData
    
  } catch (error) {
    console.error('❌ Error collecting assistant data:', error)
    throw new Error(`Failed to collect assistant data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Функция для отправки данных ассистенту
export async function sendDataToAssistant(data: CollectedAssistantData): Promise<any> {
  console.log('📤 Sending data to assistant...')
  
  try {
    const response = await fetch('/api/assistant/send-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ Data sent to assistant successfully:', result)
    return result
    
  } catch (error) {
    console.error('❌ Error sending data to assistant:', error)
    throw error
  }
}
