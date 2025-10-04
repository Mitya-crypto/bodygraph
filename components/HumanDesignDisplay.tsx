// components/HumanDesignDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Zap, Target, Heart, Brain, Shield, Star, Users } from 'lucide-react'
import { UserProfile } from '@/store/appStore'
import { fetchHumanDesignData, formatProfileForHumanDesign } from '@/lib/humanDesignApi'
import { useRouter } from 'next/navigation'

interface HumanDesignDisplayProps {
  userProfile: UserProfile
  language: 'en' | 'ru'
}

interface HumanDesignData {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  innerAuthority: string
  incarnationCross: string
  channels: Array<{
    number: string
    name: string
    description: string
  }>
  gates: Array<{
    number: string
    name: string
    description: string
  }>
  centers: {
    defined: string[]
    undefined: string[]
  }
}

export function HumanDesignDisplay({ userProfile, language }: HumanDesignDisplayProps) {
  const [humanDesignData, setHumanDesignData] = useState<HumanDesignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  console.log('🔍 HumanDesignDisplay received userProfile:', userProfile)

  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.birthDate) {
      fetchHumanDesignDataFromApi()
    }
  }, [userProfile])

  const fetchHumanDesignDataFromApi = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Форматируем данные профиля для API
      const apiRequest = formatProfileForHumanDesign(userProfile)
      
      if (!apiRequest) {
        throw new Error('Invalid profile data for Human Design')
      }

      console.log('🔄 Fetching Human Design data:', apiRequest)

      // Получаем данные через API
      const apiData = await fetchHumanDesignData(apiRequest)
      
      // Адаптируем данные под наш интерфейс
      const adaptedData: HumanDesignData = {
        ...apiData,
        channels: apiData.channels.map(channel => ({
          ...channel,
          description: language === 'ru' 
            ? translateChannelDescription(channel.description)
            : channel.description
        })),
        gates: apiData.gates.map(gate => ({
          ...gate,
          description: language === 'ru' 
            ? translateGateDescription(gate.description)
            : gate.description
        }))
      }
      
      setHumanDesignData(adaptedData)
      console.log('✅ Human Design data loaded:', adaptedData)

    } catch (error) {
      console.error('❌ Error fetching Human Design data:', error)
      setError(language === 'ru' ? 'Ошибка загрузки данных Human Design' : 'Error loading Human Design data')
    } finally {
      setIsLoading(false)
    }
  }

  // Функции для перевода описаний
  const translateChannelDescription = (description: string) => {
    const translations: { [key: string]: string } = {
      'Channel of inspiration and creativity': 'Канал вдохновения и творчества',
      'Channel of awakening and awareness': 'Канал пробуждения и осознанности',
      'Channel of charisma and transformation': 'Канал харизмы и трансформации'
    }
    return translations[description] || description
  }

  const translateGateDescription = (description: string) => {
    const translations: { [key: string]: string } = {
      'Gate of self-expression and creativity': 'Ворота самовыражения и творчества',
      'Gate of contribution and leadership': 'Ворота вклада и лидерства',
      'Gate of self-love and behavior': 'Ворота самолюбия и поведения',
      'Gate of contemplation and awareness': 'Ворота созерцания и осознанности',
      'Gate of power and transformation': 'Ворота силы и трансформации'
    }
    return translations[description] || description
  }

  const getTypeDescription = (type: string) => {
    const descriptions = {
      ru: {
        Generator: 'Генератор - создатель и строитель мира',
        'Manifesting Generator': 'Манифестирующий Генератор - создатель и инициатор',
        Manifestor: 'Манифестор - инициатор и лидер',
        Projector: 'Проектор - гид и стратег',
        Reflector: 'Рефлектор - мудрец и зеркало'
      },
      en: {
        Generator: 'Generator - creator and builder of the world',
        'Manifesting Generator': 'Manifesting Generator - creator and initiator',
        Manifestor: 'Manifestor - initiator and leader',
        Projector: 'Projector - guide and strategist',
        Reflector: 'Reflector - sage and mirror'
      }
    }
    return descriptions[language][type as keyof typeof descriptions[typeof language]] || type
  }

  const getStrategyDescription = (strategy: string) => {
    const descriptions = {
      ru: {
        Respond: 'Отвечайте на жизненные запросы',
        Initiate: 'Инициируйте и действуйте',
        Wait: 'Ждите приглашения',
        'Wait for lunar cycle': 'Ждите лунный цикл'
      },
      en: {
        Respond: 'Respond to life\'s requests',
        Initiate: 'Initiate and act',
        Wait: 'Wait for invitation',
        'Wait for lunar cycle': 'Wait for lunar cycle'
      }
    }
    return descriptions[language][strategy as keyof typeof descriptions[typeof language]] || strategy
  }

  const getCenterNameRu = (centerName: string) => {
    const centerTranslations = {
      'Head': 'Голова',
      'Ajna': 'Аджана',
      'Throat': 'Горло',
      'G-Center': 'G-Центр',
      'Heart': 'Сердце',
      'Solar Plexus': 'Солнечное сплетение',
      'Sacral': 'Сакральный',
      'Root': 'Корень',
      'Spleen': 'Селезенка'
    }
    return centerTranslations[centerName as keyof typeof centerTranslations] || centerName
  }

  const getStrategyNameRu = (strategyName: string) => {
    const strategyTranslations = {
      'Respond': 'Отвечать',
      'Initiate': 'Инициировать',
      'Wait for the Invitation': 'Ждать приглашения',
      'Wait for the Lunar Cycle': 'Ждать лунный цикл',
      'Respond, then Inform': 'Отвечать, затем информировать'
    }
    return strategyTranslations[strategyName as keyof typeof strategyTranslations] || strategyName
  }

  const getAuthorityNameRu = (authorityName: string) => {
    const authorityTranslations = {
      'Emotional': 'Эмоциональный',
      'Sacral': 'Сакральный',
      'Splenic': 'Спленальный',
      'Ego': 'Эго',
      'Self-Projected': 'Само-проектируемый',
      'Environmental': 'Окружающий',
      'Lunar': 'Лунный'
    }
    return authorityTranslations[authorityName as keyof typeof authorityTranslations] || authorityName
  }

  const getDefinitionNameRu = (definitionName: string) => {
    // Парсим определение типа "Reflector with Environmental authority"
    const parts = definitionName.split(' with ')
    if (parts.length === 2) {
      const type = parts[0]
      const authority = parts[1].replace(' authority', '')
      
      const typeRu = getTypeNameRu(type)
      const authorityRu = getAuthorityNameRu(authority)
      
      return `${typeRu} с ${authorityRu} авторитетом`
    }
    return definitionName
  }

  const getTypeNameRu = (typeName: string) => {
    const typeTranslations = {
      'Generator': 'Генератор',
      'Manifesting Generator': 'Манифестирующий Генератор',
      'Projector': 'Проектор',
      'Manifestor': 'Манифестор',
      'Reflector': 'Рефлектор'
    }
    return typeTranslations[typeName as keyof typeof typeTranslations] || typeName
  }

  const getIncarnationCrossNameRu = (crossName: string) => {
    const crossTranslations = {
      'Right Angle Cross of the Sphinx': 'Правый Угловой Крест Сфинкса',
      'Left Angle Cross of the Sphinx': 'Левый Угловой Крест Сфинкса',
      'Juxtaposition Cross of the Sphinx': 'Крест Противопоставления Сфинкса',
      'Right Angle Cross of the Vessel': 'Правый Угловой Крест Сосуда',
      'Left Angle Cross of the Vessel': 'Левый Угловой Крест Сосуда',
      'Juxtaposition Cross of the Vessel': 'Крест Противопоставления Сосуда',
      'Right Angle Cross of the Sleeping Phoenix': 'Правый Угловой Крест Спящего Феникса',
      'Left Angle Cross of the Sleeping Phoenix': 'Левый Угловой Крест Спящего Феникса',
      'Juxtaposition Cross of the Sleeping Phoenix': 'Крест Противопоставления Спящего Феникса'
    }
    return crossTranslations[crossName as keyof typeof crossTranslations] || crossName
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-card text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="cosmic-subtitle text-xl mb-2">
            {language === 'ru' ? 'Анализ Human Design' : 'Human Design Analysis'}
          </h2>
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Расчет вашего энергетического типа...' : 'Calculating your energy type...'}
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
            onClick={fetchHumanDesignDataFromApi}
            className="cosmic-button bg-cosmic-500 hover:bg-cosmic-600"
          >
            {language === 'ru' ? 'Попробовать снова' : 'Try Again'}
          </button>
        </motion.div>
      </div>
    )
  }

  if (!humanDesignData) {
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
      {/* Статус API */}
      {/* HumanDesignApiStatus removed */}

      {/* Основная информация */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
        onClick={() => {
          router.push('/human-design/type')
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="cosmic-subtitle text-2xl mb-2">
          {language === 'ru' ? 'Энергетический тип' : 'Energy Type'}
        </h2>
        <div className="text-3xl font-bold text-cosmic-400 mb-2">
          {language === 'ru' ? getTypeNameRu(humanDesignData.type) : humanDesignData.type}
        </div>
        <p className="text-cosmic-300">
          {getTypeDescription(humanDesignData.type)}
        </p>
      </motion.div>

      {/* Стратегия и Авторитет */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
          onClick={() => {
          const typeToSlug: Record<string, string> = {
            'Generator': 'generator',
            'Manifesting Generator': 'manifesting-generator',
            'Manifestor': 'manifestor',
            'Projector': 'projector',
            'Reflector': 'reflector'
          }
          const slug = typeToSlug[humanDesignData.type] || 'generator'
          router.push(`/human-design/strategy/${slug}`)
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Стратегия' : 'Strategy'}
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {language === 'ru' ? getStrategyNameRu(humanDesignData.strategy) : humanDesignData.strategy}
          </div>
          <p className="text-sm text-cosmic-300">
            {getStrategyDescription(humanDesignData.strategy)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
          onClick={() => {
            router.push('/human-design/authority')
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Авторитет' : 'Authority'}
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {language === 'ru' ? getAuthorityNameRu(humanDesignData.authority) : humanDesignData.authority}
          </div>
          <p className="text-sm text-cosmic-300">
            {language === 'ru' ? 'Ваш внутренний авторитет' : 'Your inner authority'}
          </p>
        </motion.div>
      </div>

      {/* Профиль и Определение */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
          onClick={() => {
            router.push('/human-design/profile')
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Профиль' : 'Profile'}
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {humanDesignData.profile}
          </div>
          <p className="text-sm text-cosmic-300">
            {language === 'ru' ? 'Ваш жизненный профиль' : 'Your life profile'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
          onClick={() => {
            router.push('/human-design/definition')
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Определение' : 'Definition'}
          </h3>
          <div className="text-xl font-bold text-cosmic-400 mb-2">
            {language === 'ru' ? getDefinitionNameRu(humanDesignData.definition) : humanDesignData.definition}
          </div>
          <p className="text-sm text-cosmic-300">
            {language === 'ru' ? 'Тип вашего определения' : 'Type of your definition'}
          </p>
        </motion.div>
      </div>

      {/* Инкарнационный крест */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cosmic-card text-center cursor-pointer hover:bg-space-700/30 transition-colors"
        onClick={() => {
          router.push('/human-design/incarnation-cross')
        }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="cosmic-subtitle text-lg mb-2">
          {language === 'ru' ? 'Инкарнационный крест' : 'Incarnation Cross'}
        </h3>
        <div className="text-lg font-bold text-cosmic-400 mb-2">
          {language === 'ru' ? getIncarnationCrossNameRu(humanDesignData.incarnationCross) : humanDesignData.incarnationCross}
        </div>
        <p className="text-sm text-cosmic-300">
          {language === 'ru' ? 'Ваша жизненная миссия' : 'Your life mission'}
        </p>
      </motion.div>

      {/* Каналы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cosmic-card cursor-pointer hover:bg-space-700/30 transition-colors"
        onClick={() => {
          router.push('/human-design/channels')
        }}
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cosmic-400" />
          {language === 'ru' ? 'Активированные каналы' : 'Activated Channels'}
        </h3>
        <div className="space-y-3">
          {humanDesignData.channels && humanDesignData.channels.length > 0 ? (
            humanDesignData.channels.map((channel, index) => (
              <div key={index} className="p-3 bg-space-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-cosmic-300">
                    {channel.number}
                  </div>
                  <div className="text-cosmic-400 font-medium">
                    {channel.name}
                  </div>
                </div>
                <p className="text-sm text-cosmic-500">
                  {channel.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 bg-space-800/50 rounded-lg text-center">
              <p className="text-cosmic-500">
                {language === 'ru' ? 'Нет активированных каналов' : 'No activated channels'}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Центры */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="cosmic-card cursor-pointer hover:bg-space-700/30 transition-colors"
        onClick={() => {
          router.push('/human-design/centers')
        }}
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cosmic-400" />
          {language === 'ru' ? 'Центры' : 'Centers'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-cosmic-300 font-medium mb-2">
              {language === 'ru' ? 'Определенные' : 'Defined'}
            </h4>
            <div className="space-y-1">
              {humanDesignData.centers.defined.map((center, index) => (
                <div key={index} className="text-sm text-cosmic-400 bg-green-900/20 px-2 py-1 rounded">
                  {language === 'ru' ? getCenterNameRu(center) : center}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-cosmic-300 font-medium mb-2">
              {language === 'ru' ? 'Неопределенные' : 'Undefined'}
            </h4>
            <div className="space-y-1">
              {humanDesignData.centers.undefined.map((center, index) => (
                <div key={index} className="text-sm text-cosmic-400 bg-blue-900/20 px-2 py-1 rounded">
                  {language === 'ru' ? getCenterNameRu(center) : center}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}