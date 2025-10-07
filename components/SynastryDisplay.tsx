'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Heart, 
  Users, 
  Star, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Download,
  ArrowLeft,
  Plus,
  User,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { calculateSynastry } from '@/lib/synastryEngine'

interface SynastryAspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  harmony: number // -1 to 1, where -1 is very tense, 1 is very harmonious
  description: string
}

interface SynastryHouse {
  planet: string
  house: number
  houseName: string
  influence: string
  description: string
}

interface SynastryResult {
  overallCompatibility: number
  romanticCompatibility: number
  friendshipCompatibility: number
  aspects: SynastryAspect[]
  houses: SynastryHouse[]
  keyPoints: {
    strengths: string[]
    challenges: string[]
    growth: string[]
  }
  summary: string
}

export function SynastryDisplay() {
  const { userProfile, language, savedProfiles } = useAppStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [partnerProfile, setPartnerProfile] = useState<any>(null)
  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'aspects' | 'houses' | 'analysis'>('overview')

  // Mock data for demonstration
  const mockSynastryResult: SynastryResult = {
    overallCompatibility: 78,
    romanticCompatibility: 85,
    friendshipCompatibility: 72,
    aspects: [
      {
        planet1: 'Солнце',
        planet2: 'Луна',
        aspect: 'Трин',
        orb: 2.3,
        harmony: 0.8,
        description: 'Гармоничное взаимодействие между сознанием и эмоциями. Вы интуитивно понимаете друг друга.'
      },
      {
        planet1: 'Венера',
        planet2: 'Марс',
        aspect: 'Соединение',
        orb: 1.5,
        harmony: 0.6,
        description: 'Сильное притяжение и страсть. Эмоциональная и физическая совместимость.'
      },
      {
        planet1: 'Меркурий',
        planet2: 'Меркурий',
        aspect: 'Квадрат',
        orb: 3.1,
        harmony: -0.4,
        description: 'Разное мышление может приводить к недопониманию, но также создает интеллектуальный вызов.'
      }
    ],
    houses: [
      {
        planet: 'Солнце',
        house: 7,
        houseName: 'Дом партнерства',
        influence: 'Очень сильное',
        description: 'Партнер воспринимается как идеальная вторая половинка.'
      },
      {
        planet: 'Луна',
        house: 4,
        houseName: 'Дом семьи',
        influence: 'Положительное',
        description: 'Эмоциональная близость и семейные ценности.'
      },
      {
        planet: 'Марс',
        house: 8,
        houseName: 'Дом трансформации',
        influence: 'Интенсивное',
        description: 'Глубокие страсти и трансформационные процессы.'
      }
    ],
    keyPoints: {
      strengths: [
        'Гармоничное взаимодействие Солнца и Луны',
        'Сильное физическое притяжение',
        'Общие ценности и цели'
      ],
      challenges: [
        'Разные способы мышления и общения',
        'Возможные конфликты в повседневных делах',
        'Необходимость компромиссов'
      ],
      growth: [
        'Развитие терпимости к различиям',
        'Углубление эмоциональной связи',
        'Совместное творчество'
      ]
    },
    summary: 'Ваша совместимость основана на глубокой эмоциональной связи и сильном физическом притяжении. Основные вызовы связаны с различиями в общении, но они же могут стать источником роста и развития для обоих партнеров.'
  }

  useEffect(() => {
    // Проверяем URL параметры для выбора партнера
    const partnerId = searchParams.get('partnerId')
    if (partnerId && savedProfiles.length > 0) {
      const partner = savedProfiles.find(p => p.id === partnerId)
      if (partner && partner.id !== userProfile?.id) {
        setPartnerProfile(partner)
      }
    }
  }, [searchParams, savedProfiles, userProfile])

  useEffect(() => {
    if (userProfile && partnerProfile) {
      calculateSynastryData()
    }
  }, [userProfile, partnerProfile])

  const calculateSynastryData = async () => {
    if (!userProfile || !partnerProfile) return

    setIsLoading(true)
    setError(null)

    try {
      // В реальном приложении здесь был бы вызов API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSynastryResult(mockSynastryResult)
    } catch (err) {
      setError('Ошибка при расчете совместимости')
      console.error('Synastry calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePartnerSelect = (profile: any) => {
    setPartnerProfile(profile)
    // Обновляем URL с ID партнера
    const url = new URL(window.location.href)
    url.searchParams.set('partnerId', profile.id)
    window.history.replaceState({}, '', url.toString())
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getCompatibilityBg = (score: number) => {
    if (score >= 80) return 'bg-green-900/20 border-green-500/30'
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-500/30'
    return 'bg-red-900/20 border-red-500/30'
  }

  const getHarmonyColor = (harmony: number) => {
    if (harmony >= 0.5) return 'text-green-400'
    if (harmony >= 0) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHarmonyIcon = (harmony: number) => {
    if (harmony >= 0.5) return CheckCircle
    if (harmony >= 0) return Info
    return AlertCircle
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-cosmic-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-cosmic-300 mb-2">
            Нет активного профиля
          </h3>
          <p className="text-cosmic-400 mb-6">
            Сначала создайте или выберите свой профиль
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-400" />
            <h1 className="cosmic-title text-3xl">Синастрия</h1>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <p className="cosmic-text max-w-2xl mx-auto">
            Глубокий анализ совместимости по натальным картам. 
            Не просто сравнение знаков, а изучение взаимодействия планет двух людей.
          </p>
        </motion.div>

        {/* Partner Selection */}
        {!partnerProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-card p-6 mb-8"
          >
            <div className="text-center">
              <Users className="w-16 h-16 text-cosmic-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cosmic-300 mb-2">
                Выберите партнера для анализа
              </h3>
              <p className="text-cosmic-400 mb-6">
                Синастрия требует данные двух людей для анализа их совместимости
              </p>
              <button
                type="button"
                onClick={() => {
                  console.log('Выбираем партнера...')
                  // Переходим к странице управления профилями с параметром from=synastry
                  router.push('/profile-management?from=synastry')
                }}
                className="px-6 py-3 bg-cosmic-600 hover:bg-cosmic-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Выбрать партнера
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-16 h-16 text-cosmic-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-cosmic-300 mb-2">
              Анализируем совместимость...
            </h3>
            <p className="text-cosmic-400">
              Изучаем взаимодействие планет и домов
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-card p-6 mb-8 border border-red-500/30 bg-red-900/20"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">
                  Ошибка анализа
                </h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {synastryResult && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Compatibility Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`cosmic-card p-6 ${getCompatibilityBg(synastryResult.overallCompatibility)}`}>
                <div className="text-center">
                  <Star className="w-8 h-8 text-cosmic-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-cosmic-300 mb-2">
                    Общая совместимость
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${getCompatibilityColor(synastryResult.overallCompatibility)}`}>
                    {synastryResult.overallCompatibility}%
                  </div>
                  <p className="text-sm text-cosmic-400">
                    Общая гармония отношений
                  </p>
                </div>
              </div>

              <div className={`cosmic-card p-6 ${getCompatibilityBg(synastryResult.romanticCompatibility)}`}>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-cosmic-300 mb-2">
                    Романтическая
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${getCompatibilityColor(synastryResult.romanticCompatibility)}`}>
                    {synastryResult.romanticCompatibility}%
                  </div>
                  <p className="text-sm text-cosmic-400">
                    Любовь и страсть
                  </p>
                </div>
              </div>

              <div className={`cosmic-card p-6 ${getCompatibilityBg(synastryResult.friendshipCompatibility)}`}>
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-cosmic-300 mb-2">
                    Дружеская
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${getCompatibilityColor(synastryResult.friendshipCompatibility)}`}>
                    {synastryResult.friendshipCompatibility}%
                  </div>
                  <p className="text-sm text-cosmic-400">
                    Дружба и понимание
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="cosmic-card p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: 'overview', label: 'Обзор', icon: Info },
                  { id: 'aspects', label: 'Аспекты', icon: Zap },
                  { id: 'houses', label: 'Дома', icon: Star },
                  { id: 'analysis', label: 'Анализ', icon: CheckCircle }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-cosmic-600 text-cosmic-100'
                          : 'text-cosmic-400 hover:text-cosmic-300 hover:bg-space-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-cosmic-300 mb-4">
                          Резюме совместимости
                        </h3>
                        <p className="text-cosmic-300 leading-relaxed">
                          {synastryResult.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Сильные стороны
                          </h4>
                          <ul className="space-y-2">
                            {synastryResult.keyPoints.strengths.map((strength, index) => (
                              <li key={index} className="text-cosmic-300 text-sm flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Вызовы
                          </h4>
                          <ul className="space-y-2">
                            {synastryResult.keyPoints.challenges.map((challenge, index) => (
                              <li key={index} className="text-cosmic-300 text-sm flex items-start gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Рост
                          </h4>
                          <ul className="space-y-2">
                            {synastryResult.keyPoints.growth.map((growth, index) => (
                              <li key={index} className="text-cosmic-300 text-sm flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                {growth}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'aspects' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-cosmic-300 mb-4">
                        Аспекты между планетами
                      </h3>
                      <div className="space-y-4">
                        {synastryResult.aspects.map((aspect, index) => {
                          const Icon = getHarmonyIcon(aspect.harmony)
                          return (
                            <div key={index} className="cosmic-card p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-lg font-semibold text-cosmic-300">
                                    {aspect.planet1} {aspect.aspect} {aspect.planet2}
                                  </h4>
                                  <p className="text-sm text-cosmic-400">
                                    Орб: {aspect.orb.toFixed(1)}°
                                  </p>
                                </div>
                                <div className={`flex items-center gap-2 ${getHarmonyColor(aspect.harmony)}`}>
                                  <Icon className="w-5 h-5" />
                                  <span className="text-sm font-medium">
                                    {aspect.harmony >= 0.5 ? 'Гармоничный' : 
                                     aspect.harmony >= 0 ? 'Нейтральный' : 'Напряженный'}
                                  </span>
                                </div>
                              </div>
                              <p className="text-cosmic-300 text-sm">
                                {aspect.description}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'houses' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-cosmic-300 mb-4">
                        Планеты в домах партнера
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {synastryResult.houses.map((house, index) => (
                          <div key={index} className="cosmic-card p-4">
                            <h4 className="text-lg font-semibold text-cosmic-300 mb-2">
                              {house.planet} в {house.houseName}
                            </h4>
                            <p className="text-sm text-cosmic-400 mb-3">
                              Влияние: {house.influence}
                            </p>
                            <p className="text-cosmic-300 text-sm">
                              {house.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'analysis' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-cosmic-300 mb-4">
                        Детальный анализ
                      </h3>
                      
                      <div className="cosmic-card p-6">
                        <h4 className="text-lg font-semibold text-cosmic-300 mb-4">
                          💞 Солнце и Луна - Основа отношений
                        </h4>
                        <p className="text-cosmic-300 mb-4">
                          Взаимодействие между Солнцем (сознание, эго) и Луной (эмоции, подсознание) 
                          определяет базовую совместимость. Гармоничные аспекты между ними создают 
                          ощущение "родной души" и взаимопонимания.
                        </p>
                        <div className="bg-space-700/50 p-4 rounded-lg">
                          <p className="text-cosmic-200 text-sm">
                            <strong>Ваш случай:</strong> Солнце и Луна в трине - отличная основа 
                            для долгосрочных отношений. Вы интуитивно понимаете эмоциональные 
                            потребности друг друга.
                          </p>
                        </div>
                      </div>

                      <div className="cosmic-card p-6">
                        <h4 className="text-lg font-semibold text-cosmic-300 mb-4">
                          ❤️ Венера и Марс - Любовь и страсть
                        </h4>
                        <p className="text-cosmic-300 mb-4">
                          Венера показывает, как мы любим и что нам нравится, Марс - как мы 
                          действуем и проявляем желания. Их взаимодействие определяет романтическую 
                          и сексуальную совместимость.
                        </p>
                        <div className="bg-space-700/50 p-4 rounded-lg">
                          <p className="text-cosmic-200 text-sm">
                            <strong>Ваш случай:</strong> Венера в соединении с Марсом - сильное 
                            физическое притяжение и романтическая химия. Однако возможны 
                            конфликты из-за разного проявления чувств.
                          </p>
                        </div>
                      </div>

                      <div className="cosmic-card p-6">
                        <h4 className="text-lg font-semibold text-cosmic-300 mb-4">
                          🗣️ Меркурий - Общение и мышление
                        </h4>
                        <p className="text-cosmic-300 mb-4">
                          Меркурий отвечает за общение, мышление и интеллектуальную совместимость. 
                          Гармоничные аспекты между Меркуриями облегчают понимание и совместную 
                          деятельность.
                        </p>
                        <div className="bg-space-700/50 p-4 rounded-lg">
                          <p className="text-cosmic-200 text-sm">
                            <strong>Ваш случай:</strong> Меркурии в квадрате - разные способы 
                            мышления могут приводить к недопониманию, но также создают 
                            интеллектуальный вызов и стимулируют развитие.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  // В реальном приложении здесь была бы генерация PDF
                  alert('PDF отчет будет сгенерирован')
                }}
                className="flex items-center gap-2 px-6 py-3 bg-cosmic-600 hover:bg-cosmic-700 rounded-lg text-white font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Скачать PDF отчет
              </button>
              
              <button
                onClick={() => {
                  setPartnerProfile(null)
                  setSynastryResult(null)
                  setActiveTab('overview')
                }}
                className="flex items-center gap-2 px-6 py-3 bg-space-600 hover:bg-space-500 rounded-lg text-white font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Анализ другого партнера
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
