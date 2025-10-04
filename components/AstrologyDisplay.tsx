// components/AstrologyDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Sun, Moon, Zap, Target, Heart, Brain, Shield, Users, Globe } from 'lucide-react'
import { UserProfile } from '@/store/appStore'
import { fetchAstrologyData, formatProfileForAstrology } from '@/lib/astrologyApi'
import { NatalChart } from './NatalChart'

interface AstrologyDisplayProps {
  userProfile: UserProfile
  language: 'en' | 'ru'
}

interface AstrologyData {
  sun: {
    sign: string
    degree: number
    house: number
    description: string
  }
  moon: {
    sign: string
    degree: number
    house: number
    description: string
  }
  rising: {
    sign: string
    degree: number
    description: string
  }
  planets: Array<{
    name: string
    sign: string
    degree: number
    house: number
    description: string
  }>
  houses: Array<{
    number: number
    sign: string
    degree: number
    description: string
  }>
  aspects: Array<{
    planet1: string
    planet2: string
    aspect: string
    orb: number
    description: string
  }>
  chartData: {
    ascendant: number
    mc: number
    houses: number[]
    planets: Array<{
      name: string
      longitude: number
      latitude: number
    }>
  }
}

// Функция для перевода названий аспектов
const translateAspectName = (aspectName: string): string => {
  const translations: { [key: string]: string } = {
    'Conjunction': 'Соединение',
    'Opposition': 'Оппозиция',
    'Trine': 'Трин',
    'Square': 'Квадрат',
    'Sextile': 'Секстиль',
    'Quincunx': 'Квинконс',
    'Semisextile': 'Полусекстиль'
  }
  return translations[aspectName] || aspectName
}

// Функция для перевода названий планет
const translatePlanetName = (planetName: string): string => {
  const translations: { [key: string]: string } = {
    'Sun': 'Солнце',
    'Moon': 'Луна',
    'Mercury': 'Меркурий',
    'Venus': 'Венера',
    'Mars': 'Марс',
    'Jupiter': 'Юпитер',
    'Saturn': 'Сатурн',
    'Uranus': 'Уран',
    'Neptune': 'Нептун',
    'Pluto': 'Плутон'
  }
  return translations[planetName] || planetName
}

// Функция для перевода знаков зодиака
const translateZodiacSign = (signName: string): string => {
  const translations: { [key: string]: string } = {
    'Aries': 'Овен',
    'Taurus': 'Телец',
    'Gemini': 'Близнецы',
    'Cancer': 'Рак',
    'Leo': 'Лев',
    'Virgo': 'Дева',
    'Libra': 'Весы',
    'Scorpio': 'Скорпион',
    'Sagittarius': 'Стрелец',
    'Capricorn': 'Козерог',
    'Aquarius': 'Водолей',
    'Pisces': 'Рыбы'
  }
  return translations[signName] || signName
}

// Функция для получения описания дома
const getHouseDescription = (houseNumber: number): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Дом личности и самовыражения. Определяет вашу внешность, характер и подход к жизни.',
    2: 'Дом материальных ценностей и ресурсов. Отвечает за финансы, имущество и самооценку.',
    3: 'Дом коммуникации и обучения. Влияет на общение, ближайшее окружение и краткосрочные поездки.',
    4: 'Дом семьи и корней. Представляет дом, семью, эмоциональную основу и внутренний мир.',
    5: 'Дом творчества и удовольствий. Отвечает за романтику, детей, хобби и самовыражение.',
    6: 'Дом здоровья и служения. Влияет на работу, здоровье, распорядок дня и заботу о других.',
    7: 'Дом партнерства и отношений. Определяет брак, деловые партнерства и открытых врагов.',
    8: 'Дом трансформации и общих ресурсов. Отвечает за наследство, глубокие изменения и интимность.',
    9: 'Дом философии и дальних путешествий. Влияет на высшее образование, веру и расширение горизонтов.',
    10: 'Дом карьеры и общественного статуса. Определяет профессию, репутацию и жизненные цели.',
    11: 'Дом дружбы и надежд. Отвечает за друзей, групповую деятельность и мечты о будущем.',
    12: 'Дом подсознания и уединения. Влияет на тайны, духовность, изоляцию и скрытые враги.'
  }
  return descriptions[houseNumber] || 'Описание дома'
}

export function AstrologyDisplay({ userProfile, language }: AstrologyDisplayProps) {
  const [astrologyData, setAstrologyData] = useState<AstrologyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'natal' | 'transits'>('natal')
  const [transitsData, setTransitsData] = useState<any>(null)
  const [transitsLoading, setTransitsLoading] = useState(false)
  const [transitsError, setTransitsError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  console.log('🔍 AstrologyDisplay received userProfile:', userProfile)
  console.log('🔍 Current activeTab:', activeTab)

  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.birthDate) {
      fetchAstrologyDataFromApi()
    }
  }, [userProfile])

  const fetchAstrologyDataFromApi = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Форматируем данные профиля для API
      const apiRequest = formatProfileForAstrology(userProfile)
      
      if (!apiRequest) {
        throw new Error('Invalid profile data for Astrology')
      }

      console.log('🔄 Fetching Astrology data:', apiRequest)

      // Получаем данные через API
      const apiData = await fetchAstrologyData(apiRequest)
      
      setAstrologyData(apiData)
      console.log('✅ Astrology data loaded:', apiData)

    } catch (error) {
      console.error('❌ Error fetching Astrology data:', error)
      setError(language === 'ru' ? 'Ошибка загрузки данных астрологии' : 'Error loading Astrology data')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTransits = async () => {
    if (!userProfile.birthDate) {
      setTransitsError('Недостаточно данных для расчета транзитов')
      return
    }

    setTransitsLoading(true)
    setTransitsError(null)

    try {
      console.log('🔄 Calculating transits for user:', userProfile.name)
      
      // Используем уже загруженные данные астрологии вместо повторного запроса
      if (!astrologyData) {
        throw new Error('Сначала нужно загрузить натальную карту')
      }
      
      console.log('📊 Using existing astrology data for transits')
      
      // Формируем данные для API транзитов из уже загруженных данных
      const natalChartForTransits = {
        birthData: {
          year: new Date(userProfile.birthDate).getFullYear(),
          month: new Date(userProfile.birthDate).getMonth() + 1,
          day: new Date(userProfile.birthDate).getDate(),
          hours: parseInt(userProfile.birthTime?.split(':')[0] || '12'),
          minutes: parseInt(userProfile.birthTime?.split(':')[1] || '0'),
          latitude: userProfile.coordinates?.lat || 55.7558,
          longitude: userProfile.coordinates?.lng || 37.6176
        },
        planets: astrologyData.chartData.planets,
        houses: astrologyData.chartData.houses.map((house: any) => ({
          ...house,
          cusp: house.longitude || house.cusp || 0
        })),
        ascendant: astrologyData.chartData.ascendant,
        mc: astrologyData.chartData.mc
      }
      
      console.log('📤 Sending transits request with natal chart:', natalChartForTransits)
      
      const transitsResponse = await fetch('/api/transits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natalChart: natalChartForTransits,
          targetDate: new Date(selectedDate).toISOString(),
          includeMinorTransits: false
        }),
      })

      if (!transitsResponse.ok) {
        let errorMessage = `HTTP ${transitsResponse.status}: ${transitsResponse.statusText}`
        try {
          const errorData = await transitsResponse.json()
          console.error('❌ Transits API error response:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('❌ Could not parse error response')
        }
        throw new Error(errorMessage)
      }

      const transitsResult = await transitsResponse.json()
      console.log('📥 Transits response:', transitsResult)
      
      if (transitsResult.success) {
        console.log('✅ Setting transits data:', transitsResult.data)
        setTransitsData(transitsResult.data)
      } else {
        console.error('❌ Transits calculation failed:', transitsResult.error)
        throw new Error(transitsResult.error || 'Failed to calculate transits')
      }
      
    } catch (error) {
      console.error('❌ Error calculating transits:', error)
      setTransitsError(error instanceof Error ? error.message : 'Ошибка расчета транзитов')
    } finally {
      setTransitsLoading(false)
    }
  }

  // Обновляем дату до текущей при переключении на транзиты
  useEffect(() => {
    if (activeTab === 'transits') {
      const today = new Date().toISOString().split('T')[0]
      console.log('📅 Updating selected date to today:', today)
      setSelectedDate(today)
    }
  }, [activeTab])

  // Загружаем транзиты при переключении на таб транзитов
  useEffect(() => {
    console.log('🔄 Transits useEffect triggered:', { activeTab, hasUserProfile: !!userProfile, hasTransitsData: !!transitsData })
    if (activeTab === 'transits' && userProfile && !transitsData) {
      console.log('✅ Calling calculateTransits()')
      calculateTransits()
    }
  }, [activeTab, userProfile])

  const getSignDescription = (sign: string) => {
    const descriptions = {
      ru: {
        Aries: 'Овен - энергичный и импульсивный лидер',
        Taurus: 'Телец - практичный и стабильный созидатель',
        Gemini: 'Близнецы - общительный и любознательный коммуникатор',
        Cancer: 'Рак - эмоциональный и заботливый защитник',
        Leo: 'Лев - творческий и гордый лидер',
        Virgo: 'Дева - аналитичный и совершенствующийся работник',
        Libra: 'Весы - гармоничный и дипломатичный миротворец',
        Scorpio: 'Скорпион - интенсивный и трансформирующийся исследователь',
        Sagittarius: 'Стрелец - философский и свободолюбивый путешественник',
        Capricorn: 'Козерог - амбициозный и дисциплинированный строитель',
        Aquarius: 'Водолей - оригинальный и гуманитарный новатор',
        Pisces: 'Рыбы - интуитивный и сострадательный мечтатель'
      },
      en: {
        Aries: 'Aries - energetic and impulsive leader',
        Taurus: 'Taurus - practical and stable builder',
        Gemini: 'Gemini - sociable and curious communicator',
        Cancer: 'Cancer - emotional and caring protector',
        Leo: 'Leo - creative and proud leader',
        Virgo: 'Virgo - analytical and perfecting worker',
        Libra: 'Libra - harmonious and diplomatic peacemaker',
        Scorpio: 'Scorpio - intense and transforming investigator',
        Sagittarius: 'Sagittarius - philosophical and freedom-loving traveler',
        Capricorn: 'Capricorn - ambitious and disciplined builder',
        Aquarius: 'Aquarius - original and humanitarian innovator',
        Pisces: 'Pisces - intuitive and compassionate dreamer'
      }
    }
    return descriptions[language][sign as keyof typeof descriptions[typeof language]] || sign
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-card text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="cosmic-subtitle text-xl mb-2">
            {language === 'ru' ? 'Анализ натальной карты' : 'Natal Chart Analysis'}
          </h2>
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Расчет положений планет и домов...' : 'Calculating planetary positions and houses...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-card text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="cosmic-subtitle text-xl mb-2 text-red-400">
            {language === 'ru' ? 'Ошибка' : 'Error'}
          </h2>
          <p className="text-cosmic-300 mb-4">{error}</p>
          <button
            onClick={fetchAstrologyDataFromApi}
            className="cosmic-button bg-cosmic-500 hover:bg-cosmic-600"
          >
            {language === 'ru' ? 'Попробовать снова' : 'Try Again'}
          </button>
        </motion.div>
      </div>
    )
  }

  if (!astrologyData) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-card text-center"
        >
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Данные не найдены' : 'No data found'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Табы для переключения между натальной картой и транзитами */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cosmic-card"
      >
        <div className="flex space-x-1 bg-space-800 rounded-lg p-1 mb-6" style={{ position: 'relative', zIndex: 10 }}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔘 Натальная карта button clicked')
              setActiveTab('natal')
              console.log('🔘 ActiveTab set to: natal')
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'natal'
                ? 'bg-pink-600 text-white'
                : 'text-cosmic-300 hover:text-white hover:bg-space-700'
            }`}
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
          >
            {language === 'ru' ? 'Натальная карта' : 'Natal Chart'}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔘 Транзиты button clicked')
              setActiveTab('transits')
              console.log('🔘 ActiveTab set to: transits')
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'transits'
                ? 'bg-pink-600 text-white'
                : 'text-cosmic-300 hover:text-white hover:bg-space-700'
            }`}
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
          >
            {language === 'ru' ? 'Транзиты' : 'Transits'}
          </button>
        </div>

        {activeTab === 'natal' && (
          <div className="space-y-6">
            {/* Графическая натальная карта */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <NatalChart 
                chartData={astrologyData.chartData}
              />
            </motion.div>

            {/* Основные элементы - Солнце, Луна, Асцендент */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            Солнце
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {translateZodiacSign(astrologyData.sun.sign)}
          </div>
          <div className="text-sm text-cosmic-300 mb-2">
            Дом {astrologyData.sun.house}
          </div>
          <p className="text-xs text-cosmic-500 mb-2">
            {getSignDescription(astrologyData.sun.sign)}
          </p>
          <p className="text-xs text-cosmic-400 italic border-t border-cosmic-700 pt-2">
            {getHouseDescription(astrologyData.sun.house)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cosmic-card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            Луна
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {translateZodiacSign(astrologyData.moon.sign)}
          </div>
          <div className="text-sm text-cosmic-300 mb-2">
            Дом {astrologyData.moon.house}
          </div>
          <p className="text-xs text-cosmic-500 mb-2">
            {getSignDescription(astrologyData.moon.sign)}
          </p>
          <p className="text-xs text-cosmic-400 italic border-t border-cosmic-700 pt-2">
            {getHouseDescription(astrologyData.moon.house)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            Асцендент
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {translateZodiacSign(astrologyData.rising.sign)}
          </div>
          <div className="text-sm text-cosmic-300 mb-2">
            {astrologyData.rising.degree.toFixed(1)}°
          </div>
          <p className="text-xs text-cosmic-500">
            {getSignDescription(astrologyData.rising.sign)}
          </p>
          <p className="text-xs text-cosmic-400 italic border-t border-cosmic-700 pt-2 mt-2">
            {getHouseDescription(1)}
          </p>
        </motion.div>
      </div>

      {/* Планеты */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cosmic-card"
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cosmic-400" />
          {language === 'ru' ? 'Планеты' : 'Planets'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {astrologyData.planets.map((planet, index) => (
            <div key={index} className="p-3 bg-space-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-cosmic-300">
                  {translatePlanetName(planet.name)}
                </div>
                <div className="text-cosmic-400 font-medium">
                  {translateZodiacSign(planet.sign)}
                </div>
              </div>
              <div className="text-sm text-cosmic-500 mb-1">
                Дом {planet.house}
              </div>
              <div className="text-xs text-cosmic-600">
                {planet.degree.toFixed(1)}°
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Аспекты */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cosmic-card"
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cosmic-400" />
          {language === 'ru' ? 'Основные аспекты' : 'Major Aspects'}
        </h3>
        <div className="space-y-3">
          {astrologyData.aspects.slice(0, 6).map((aspect, index) => (
            <div key={index} className="p-3 bg-space-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-cosmic-300">
                  {translatePlanetName(aspect.planet1)} {translateAspectName(aspect.aspect)} {translatePlanetName(aspect.planet2)}
                </div>
                <div className="text-cosmic-400 text-sm">
                  {aspect.orb.toFixed(1)}°
                </div>
              </div>
              <p className="text-sm text-cosmic-500">
                {translateAspectName(aspect.aspect)} между {translatePlanetName(aspect.planet1)} и {translatePlanetName(aspect.planet2)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Дома */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cosmic-card"
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cosmic-400" />
          {language === 'ru' ? 'Дома' : 'Houses'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {astrologyData.houses.slice(0, 12).map((house, index) => (
            <div key={index} className="p-3 bg-space-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-cosmic-300">
                  Дом {house.number}
                </div>
                <div className="text-cosmic-400 font-medium">
                  {translateZodiacSign(house.sign)}
                </div>
              </div>
              <div className="text-xs text-cosmic-600 mb-1">
                {house.degree.toFixed(1)}°
              </div>
              <p className="text-xs text-cosmic-500">
                {house.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
          </div>
        )}

        {activeTab === 'transits' && (
          <div className="space-y-6">
            {/* Заголовок и выбор даты */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="cosmic-subtitle text-xl mb-2">
                  {language === 'ru' ? 'Астрологические транзиты' : 'Astrological Transits'}
                </h3>
                <p className="text-cosmic-400 text-sm">
                  {language === 'ru' 
                    ? 'Текущее влияние планет на вашу натальную карту' 
                    : 'Current planetary influences on your natal chart'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-cosmic-300 text-sm">
                  {language === 'ru' ? 'Дата:' : 'Date:'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-space-800 border border-space-600 rounded px-3 py-1 text-white text-sm"
                />
                <button
                  onClick={calculateTransits}
                  disabled={transitsLoading}
                  className="bg-pink-600 hover:bg-pink-700 disabled:bg-space-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {transitsLoading ? '...' : (language === 'ru' ? 'Обновить' : 'Update')}
                </button>
              </div>
            </div>

            {/* Состояния загрузки и ошибок */}
            {transitsLoading && (
              <div className="cosmic-card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-cosmic-300">
                  {language === 'ru' ? 'Расчет транзитов...' : 'Calculating transits...'}
                </p>
              </div>
            )}

            {transitsError && (
              <div className="cosmic-card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <p className="text-red-400">
                  {transitsError}
                </p>
                <button
                  onClick={calculateTransits}
                  className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {language === 'ru' ? 'Попробовать снова' : 'Try Again'}
                </button>
              </div>
            )}

            {/* Данные транзитов */}
            {transitsData && (
              <div className="space-y-6">
                {/* Карта текущих позиций планет (транзитная карта) */}
                {transitsData.currentChart && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full"
                  >
                    <div className="cosmic-card mb-4">
                      <h4 className="cosmic-subtitle text-lg mb-2">
                        {language === 'ru' ? 'Карта транзитов' : 'Transit Chart'}
                      </h4>
                      <p className="text-sm text-cosmic-400">
                        {language === 'ru' 
                          ? 'Текущие позиции планет на выбранную дату' 
                          : 'Current planetary positions for selected date'}
                      </p>
                    </div>
                    <NatalChart 
                      chartData={transitsData.currentChart}
                    />
                  </motion.div>
                )}

                {/* Общая информация */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="cosmic-card"
                >
                  <h4 className="cosmic-subtitle text-lg mb-4">
                    {language === 'ru' ? 'Общий обзор' : 'Overview'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cosmic-200">
                        {transitsData.totalTransits}
                      </div>
                      <div className="text-sm text-cosmic-400">
                        {language === 'ru' ? 'Всего транзитов' : 'Total Transits'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {transitsData.summary.majorTransits}
                      </div>
                      <div className="text-sm text-cosmic-400">
                        {language === 'ru' ? 'Важных транзитов' : 'Major Transits'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        transitsData.summary.overallInfluence === 'favorable' || transitsData.summary.overallInfluence === 'positive' || transitsData.summary.overallInfluence === 'very_positive'
                          ? 'text-green-400' 
                          : transitsData.summary.overallInfluence === 'challenging' || transitsData.summary.overallInfluence === 'very_challenging'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}>
                        {language === 'ru' 
                          ? (transitsData.summary.overallInfluence === 'favorable' || transitsData.summary.overallInfluence === 'positive' || transitsData.summary.overallInfluence === 'very_positive' ? 'Благоприятный' 
                             : transitsData.summary.overallInfluence === 'challenging' || transitsData.summary.overallInfluence === 'very_challenging' ? 'Сложный' 
                             : 'Нейтральный')
                          : (typeof transitsData.summary.overallInfluence === 'string' ? transitsData.summary.overallInfluence : 'neutral')
                        }
                      </div>
                      <div className="text-sm text-cosmic-400">
                        {language === 'ru' ? 'Общее влияние' : 'Overall Influence'}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Ключевые темы */}
                {transitsData.summary.keyThemes && transitsData.summary.keyThemes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="cosmic-card"
                  >
                    <h4 className="cosmic-subtitle text-lg mb-4">
                      {language === 'ru' ? 'Ключевые темы' : 'Key Themes'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {transitsData.summary.keyThemes.map((theme: string, index: number) => (
                        <span
                          key={index}
                          className="bg-pink-600/20 text-pink-300 px-3 py-1 rounded-full text-sm"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Рекомендации */}
                {transitsData.summary.recommendations && transitsData.summary.recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="cosmic-card"
                  >
                    <h4 className="cosmic-subtitle text-lg mb-4">
                      {language === 'ru' ? 'Рекомендации' : 'Recommendations'}
                    </h4>
                    <ul className="space-y-2">
                      {transitsData.summary.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-cosmic-300">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Список транзитов */}
                {transitsData.transits && transitsData.transits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="cosmic-card"
                  >
                    <h4 className="cosmic-subtitle text-lg mb-4">
                      {language === 'ru' ? 'Активные транзиты' : 'Active Transits'}
                    </h4>
                    <div className="space-y-3">
                      {transitsData.transits.slice(0, 10).map((transit: any, index: number) => {
                        // Извлекаем информацию о транзите
                        const transitPlanet = transit.planet || ''
                        const aspectType = transit.aspect?.type || ''
                        const targetName = transit.description?.split(' с ')[1]?.split('.')[0] || ''
                        
                        // Определяем цель транзита (планета или дом)
                        let targetDisplay = ''
                        if (targetName.includes('Дом')) {
                          const houseNumber = targetName.match(/\d+/)?.[0]
                          targetDisplay = houseNumber ? `${houseNumber}-й дом` : targetName
                        } else {
                          targetDisplay = translatePlanetName(targetName)
                        }
                        
                        // Переводим название аспекта для отображения
                        const aspectDisplayName = translateAspectName(aspectType)
                        
                        return (
                        <div key={index} className="p-4 bg-space-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-cosmic-200">
                              {translatePlanetName(transitPlanet)} {aspectDisplayName} {targetDisplay}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              aspectType === 'conjunction' ? 'bg-yellow-600/20 text-yellow-300' :
                              aspectType === 'opposition' ? 'bg-red-600/20 text-red-300' :
                              aspectType === 'trine' ? 'bg-green-600/20 text-green-300' :
                              aspectType === 'square' ? 'bg-orange-600/20 text-orange-300' :
                              'bg-blue-600/20 text-blue-300'
                            }`}>
                              {aspectDisplayName}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {transit.influence?.areas && Array.isArray(transit.influence.areas) && (
                              <p className="text-sm text-cosmic-400">
                                <span className="font-medium">Области влияния:</span> {transit.influence.areas.join(', ')}
                              </p>
                            )}
                            {transit.influence?.advice && typeof transit.influence.advice === 'string' && (
                              <p className="text-sm text-cosmic-300">
                                {transit.influence.advice}
                              </p>
                            )}
                            {transit.influence?.duration && typeof transit.influence.duration === 'string' && (
                              <p className="text-xs text-cosmic-500">
                                Длительность: {transit.influence.duration}
                              </p>
                            )}
                          </div>
                        </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}