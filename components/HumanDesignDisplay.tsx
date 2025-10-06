// components/HumanDesignDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Zap, Target, Heart, Brain, Shield, Star, Users, Download } from 'lucide-react'
import { UserProfile } from '@/store/appStore'
import { fetchHumanDesignData, formatProfileForHumanDesign } from '@/lib/humanDesignApi'
import { calculateHumanDesign } from '@/lib/humanDesignEngine'
import { useRouter } from 'next/navigation'
import PDFGenerator from '@/lib/pdfGenerator'

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [lastCalculationHash, setLastCalculationHash] = useState<string>('')
  const router = useRouter()

  console.log('🔍 HumanDesignDisplay received userProfile:', userProfile)

  // Проверяем, есть ли необходимые данные профиля
  if (!userProfile || !userProfile.name || !userProfile.birthDate) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-card text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="cosmic-subtitle text-xl mb-2">
            {language === 'ru' ? 'Необходим профиль' : 'Profile Required'}
          </h2>
          <p className="text-cosmic-300 mb-4">
            {language === 'ru' 
              ? 'Для анализа Human Design необходимо создать профиль с данными о рождении.' 
              : 'A profile with birth data is required for Human Design analysis.'
            }
          </p>
        </motion.div>
      </div>
    )
  }

  // Создаем хеш профиля для отслеживания изменений
  const createProfileHash = (profile: UserProfile): string => {
    return `${profile.birthDate}-${profile.birthTime}-${profile.coordinates?.lat}-${profile.coordinates?.lng}`
  }

  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.birthDate) {
      const currentHash = createProfileHash(userProfile)
      
      // Пересчитываем только если профиль изменился
      if (currentHash !== lastCalculationHash) {
        console.log('🔄 Profile changed, recalculating Human Design...')
        setLastCalculationHash(currentHash)
        fetchHumanDesignDataFromApi()
      }
    }
  }, [userProfile?.birthDate, userProfile?.birthTime, userProfile?.coordinates?.lat, userProfile?.coordinates?.lng, lastCalculationHash])


  const fetchHumanDesignDataFromApi = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 Fetching Human Design data for profile:', userProfile)

      // Сначала пробуем новую библиотеку Human Design Engine
      try {
        const [year, month, day] = userProfile.birthDate.split('-').map(Number)
        const [hour, minute] = userProfile.birthTime.split(':').map(Number)
        
        const birthData = {
          year,
          month,
          day,
          hour: hour || 0,
          minute: minute || 0,
          second: 0,
          latitude: userProfile.coordinates?.lat || 0,
          longitude: userProfile.coordinates?.lng || 0,
          timezone: 0
        }

        console.log('🔄 Calculating with Human Design Engine:', birthData)
        const engineResult = await calculateHumanDesign(birthData)
        console.log('✅ Human Design Engine result:', engineResult)
        
        // Адаптируем результат под наш интерфейс
        const adaptedData: HumanDesignData = {
          type: engineResult.type,
          strategy: engineResult.strategy,
          authority: engineResult.authority,
          profile: engineResult.profile,
          definition: engineResult.definition,
          innerAuthority: engineResult.authority,
          incarnationCross: engineResult.incarnationCross.name,
          channels: engineResult.channels.map(channel => ({
            number: channel.number,
            name: channel.name,
            description: channel.description
          })),
          gates: engineResult.gates.map(gate => ({
            number: gate.number.toString(),
            name: gate.name,
            description: `Ворота ${gate.number}: ${gate.name}`
          })),
          centers: {
            defined: engineResult.centers.filter(c => c.defined).map(c => c.name),
            undefined: engineResult.centers.filter(c => !c.defined).map(c => c.name)
          }
        }
        
        setHumanDesignData(adaptedData)
        return
      } catch (engineError) {
        console.warn('⚠️ Human Design Engine failed, falling back to API:', engineError)
      }

      // Fallback к старому API
      const apiRequest = formatProfileForHumanDesign(userProfile)
      
      if (!apiRequest) {
        throw new Error('Invalid profile data for Human Design')
      }

      console.log('🔄 Fetching Human Design data from API:', apiRequest)

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
        'Wait for invitation': 'Ждите приглашения',
        'Wait for lunar cycle': 'Ждите лунный цикл'
      },
      en: {
        Respond: 'Respond to life\'s requests',
        Initiate: 'Initiate and act',
        Wait: 'Wait for invitation',
        'Wait for invitation': 'Wait for invitation',
        'Wait for lunar cycle': 'Wait for lunar cycle'
      }
    }
    return descriptions[language][strategy as keyof typeof descriptions[typeof language]] || strategy
  }

  const getStrategyNameRu = (strategy: string) => {
    const translations = {
      'Respond': 'Отвечать',
      'Initiate': 'Инициировать',
      'Wait': 'Ждать',
      'Wait for invitation': 'Ждать приглашения',
      'Wait for lunar cycle': 'Ждать лунный цикл'
    }
    return translations[strategy as keyof typeof translations] || strategy
  }

  const getAuthorityNameRu = (authority: string) => {
    const translations = {
      'Sacral': 'Сакральный',
      'Solar Plexus': 'Солнечное сплетение',
      'Spleen': 'Селезенка',
      'Heart': 'Сердце',
      'G-Center': 'G-Центр',
      'Root': 'Корень',
      'Throat': 'Горло',
      'Ajna': 'Аджана',
      'Head': 'Голова',
      'Lunar': 'Лунный',
      'Environmental': 'Окружающая среда',
      'Ego': 'Эго',
      'Self': 'Я'
    }
    return translations[authority as keyof typeof translations] || authority
  }

  const getDefinitionNameRu = (definition: string) => {
    const translations = {
      'Single Definition': 'Единое определение',
      'Split Definition': 'Разделенное определение',
      'Triple Split Definition': 'Тройное разделенное определение',
      'Quadruple Split Definition': 'Четверное разделенное определение',
      'No Definition': 'Без определения'
    }
    return translations[definition as keyof typeof translations] || definition
  }

  const getIncarnationCrossNameRu = (incarnationCross: any) => {
    const translations = {
      'Cross of Planning': 'Крест планирования',
      'Cross of Laws': 'Крест законов',
      'Right Angle Cross of the Sleeping Phoenix': 'Правый угловой крест спящего феникса'
    }
    return translations[incarnationCross.name as keyof typeof translations] || incarnationCross.name
  }

  const getIncarnationCrossDescriptionRu = (incarnationCross: any) => {
    const descriptions = {
      'Cross of Planning': 'Крест планирования представляет способность к стратегическому мышлению и долгосрочному планированию. Люди с этим крестом обладают уникальной способностью видеть будущее и создавать планы для достижения целей.',
      'Cross of Laws': 'Крест законов представляет понимание естественных законов и принципов. Люди с этим крестом обладают глубоким пониманием того, как устроен мир, и могут применять эти знания для создания порядка и гармонии.',
      'Right Angle Cross of the Sleeping Phoenix': 'Правый угловой крест спящего феникса представляет трансформацию через сон и пробуждение. Люди с этим крестом проходят через глубокие внутренние изменения и возрождение, как феникс из пепла.'
    }
    return descriptions[incarnationCross.name as keyof typeof descriptions] || incarnationCross.description
  }

  const getDefinitionDescription = (definition: string) => {
    const descriptions = {
      ru: {
        'Single Definition': 'Единое определение означает, что все ваши определенные центры соединены между собой. Это дает вам последовательность и стабильность в принятии решений.',
        'Split Definition': 'Разделенное определение означает, что ваши определенные центры разделены на две группы. Это создает внутреннее напряжение и потребность в других людях для завершения.',
        'Triple Split Definition': 'Тройное разделенное определение означает, что ваши определенные центры разделены на три группы. Это создает сложную внутреннюю динамику и потребность в разнообразных связях.',
        'Quadruple Split Definition': 'Четверное разделенное определение означает, что ваши определенные центры разделены на четыре группы. Это создает очень сложную внутреннюю динамику.',
        'No Definition': 'Без определения означает, что у вас нет определенных центров. Вы являетесь чистым рефлектором.'
      },
      en: {
        'Single Definition': 'Single definition means all your defined centers are connected. This gives you consistency and stability in decision making.',
        'Split Definition': 'Split definition means your defined centers are divided into two groups. This creates inner tension and need for others to complete.',
        'Triple Split Definition': 'Triple split definition means your defined centers are divided into three groups. This creates complex inner dynamics.',
        'Quadruple Split Definition': 'Quadruple split definition means your defined centers are divided into four groups. This creates very complex inner dynamics.',
        'No Definition': 'No definition means you have no defined centers. You are a pure reflector.'
      }
    }
    return descriptions[language][definition as keyof typeof descriptions[typeof language]] || definition
  }

  const handleDownloadPDF = async () => {
    if (!humanDesignData) return

    setIsGeneratingPDF(true)
    try {
      const blob = await PDFGenerator.generateHumanDesignPDF(userProfile, humanDesignData)
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `human-design-${userProfile.name || 'report'}-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error)
      alert('Произошла ошибка при генерации PDF. Попробуйте еще раз.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getAuthorityDescription = (authority: string) => {
    const descriptions = {
      ru: {
        'Sacral': 'Сакральный авторитет - это ваша внутренняя мудрость, которая знает, что правильно для вас через звуки и ощущения.',
        'Solar Plexus': 'Авторитет солнечного сплетения - это эмоциональная мудрость, которая требует времени для принятия решений.',
        'Spleen': 'Спленный авторитет - это интуитивная мудрость, которая работает мгновенно для вашего выживания.',
        'Heart': 'Сердечный авторитет - это мудрость эго, которая знает ваше истинное направление.',
        'G-Center': 'G-Центр авторитет - это мудрость направления, которая знает, где вам быть.',
        'Root': 'Корневой авторитет - это мудрость давления, которая знает, когда действовать.',
        'Throat': 'Горловой авторитет - это мудрость самовыражения, которая знает, что сказать.',
        'Ajna': 'Аджана авторитет - это мудрость ума, которая анализирует и понимает.',
        'Head': 'Головной авторитет - это мудрость вдохновения, которая получает идеи.',
        'Lunar': 'Лунный авторитет - это мудрость лунного цикла, которая требует 28 дней для принятия решений.',
        'Environmental': 'Авторитет окружающей среды - это мудрость окружения, которая реагирует на среду.',
        'Ego': 'Эго авторитет - это мудрость воли, которая знает вашу силу.',
        'Self': 'Я авторитет - это мудрость направления, которая знает ваш путь.'
      },
      en: {
        'Sacral': 'Sacral authority is your inner wisdom that knows what is right for you through sounds and feelings.',
        'Solar Plexus': 'Solar plexus authority is emotional wisdom that requires time to make decisions.',
        'Spleen': 'Spleen authority is intuitive wisdom that works instantly for your survival.',
        'Heart': 'Heart authority is ego wisdom that knows your true direction.',
        'G-Center': 'G-Center authority is direction wisdom that knows where you should be.',
        'Root': 'Root authority is pressure wisdom that knows when to act.',
        'Throat': 'Throat authority is expression wisdom that knows what to say.',
        'Ajna': 'Ajna authority is mind wisdom that analyzes and understands.',
        'Head': 'Head authority is inspiration wisdom that receives ideas.',
        'Lunar': 'Lunar authority is lunar cycle wisdom that requires 28 days to make decisions.',
        'Environmental': 'Environmental authority is environment wisdom that responds to surroundings.',
        'Ego': 'Ego authority is will wisdom that knows your power.',
        'Self': 'Self authority is direction wisdom that knows your path.'
      }
    }
    return descriptions[language][authority as keyof typeof descriptions[typeof language]] || authority
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
      {/* PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF || !humanDesignData}
          className="flex items-center gap-2 px-4 py-2 bg-cosmic-600 hover:bg-cosmic-700 disabled:bg-space-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          {isGeneratingPDF 
            ? (language === 'ru' ? 'Генерация...' : 'Generating...')
            : (language === 'ru' ? 'Скачать PDF' : 'Download PDF')
          }
        </button>
      </div>

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
            {getAuthorityDescription(humanDesignData.authority)}
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
            {getDefinitionDescription(humanDesignData.definition)}
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
          {language === 'ru' 
            ? getIncarnationCrossNameRu(humanDesignData.incarnationCross) 
            : (typeof humanDesignData.incarnationCross === 'string' 
                ? humanDesignData.incarnationCross 
                : (humanDesignData.incarnationCross as any).name)
          }
        </div>
        <p className="text-sm text-cosmic-300">
          {language === 'ru' 
            ? getIncarnationCrossDescriptionRu(humanDesignData.incarnationCross) 
            : (typeof humanDesignData.incarnationCross === 'string' 
                ? 'Описание инкарнационного креста' 
                : (humanDesignData.incarnationCross as any).description)
          }
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
        
        <div className="space-y-6">
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

          {/* Подробное описание центров */}
          <div className="mt-6">
            <h4 className="text-cosmic-300 font-medium mb-4">
              {language === 'ru' ? 'Описание центров' : 'Centers Description'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">G-центр (Идентичность)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Определяет направление и любовь. Отвечает за самоидентификацию и жизненный путь.'
                      : 'Defines direction and love. Responsible for self-identity and life path.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">S-центр (Сакральный)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Источник жизненной силы и творческой энергии. Отвечает за сексуальность и воспроизводство.'
                      : 'Source of life force and creative energy. Responsible for sexuality and reproduction.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">T-центр (Теменная)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр вдохновения и ментального давления. Связан с духовностью и абстрактным мышлением.'
                      : 'Center of inspiration and mental pressure. Connected to spirituality and abstract thinking.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">H-центр (Сердечная)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр силы воли и эго. Отвечает за амбиции, достижения и материальный успех.'
                      : 'Center of willpower and ego. Responsible for ambitions, achievements and material success.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">E-центр (Эмоциональная)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр эмоциональной системы. Отвечает за чувства, страсти и эмоциональные волны.'
                      : 'Center of emotional system. Responsible for feelings, passions and emotional waves.'
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">A-центр (Адреналовая)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр двигательной системы. Отвечает за физическую активность и действие.'
                      : 'Center of motor system. Responsible for physical activity and action.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">P-центр (Селезеночная)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр инстинктивного осознания. Отвечает за интуицию, здоровье и страх.'
                      : 'Center of instinctive awareness. Responsible for intuition, health and fear.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">L-центр (Лимбическая)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр логического осознания. Отвечает за анализ, понимание и логику.'
                      : 'Center of logical awareness. Responsible for analysis, understanding and logic.'
                    }
                  </p>
                </div>
                <div className="bg-space-800/50 p-3 rounded-lg">
                  <h5 className="text-cosmic-400 font-medium mb-1">R-центр (Корневая)</h5>
                  <p className="text-sm text-cosmic-500">
                    {language === 'ru' 
                      ? 'Центр давления и стресса. Отвечает за выживание, адреналин и трансформацию.'
                      : 'Center of pressure and stress. Responsible for survival, adrenaline and transformation.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}