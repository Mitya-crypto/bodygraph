'use client'

import { use as usePromise } from 'react'
import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: Promise<{ definition: string }>
}

export default function HumanDesignDefinitionPage({ params }: PageProps) {
  const { userProfile, language, setCurrentScreen, setSelectedModule } = useAppStore()
  const router = useRouter()

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="cosmic-card text-center">
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Профиль пользователя не найден.' : 'User profile not found.'}
          </p>
        </div>
      </div>
    )
  }

  const resolvedParams = usePromise(params)
  const slug = decodeURIComponent(resolvedParams?.definition || '').toLowerCase()

  const birthDate = new Date(userProfile.birthDate)
  const birthTime = new Date(`2000-01-01T${userProfile.birthTime}`)

  const humanDesignData = calculateHumanDesign({
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: birthTime.getHours(),
    minute: birthTime.getMinutes(),
    latitude: userProfile.coordinates?.lat || 0,
    longitude: userProfile.coordinates?.lng || 0
  })

  const slugToDefinition: Record<string, string> = {
    'single': 'Single Definition',
    'split': 'Split Definition',
    'triple-split': 'Triple Split Definition',
    'quadruple-split': 'Quadruple Split Definition',
    'no-definition': 'No Definition',
    'reflector-with-environmental-authority': 'No Definition',
    'reflector': 'No Definition'
  }

  // Определяем текущее определение
  let currentDefinition = slugToDefinition[slug]
  
  // Если не найдено в маппинге, используем данные из Human Design
  if (!currentDefinition) {
    // Проверяем, содержит ли определение "Reflector" или "No Definition"
    if (humanDesignData.definition.includes('Reflector') || humanDesignData.definition.includes('No Definition')) {
      currentDefinition = 'No Definition'
    } else {
      currentDefinition = humanDesignData.definition
    }
  }

  const getDefinitionDescription = (definition: string) => {
    const descriptions = {
      ru: {
        'Single Definition': {
          title: 'Единое Определение',
          subtitle: 'Стабильная и последовательная энергия',
          description: 'У вас есть единая, стабильная энергетическая конфигурация. Это означает, что ваша энергия течет последовательно и предсказуемо. Вы можете полагаться на свою внутреннюю стабильность и последовательность в принятии решений.',
          characteristics: [
            'Стабильная и последовательная энергия',
            'Предсказуемые паттерны поведения',
            'Способность к глубокой фокусировке',
            'Надежность и постоянство'
          ],
          strengths: [
            'Глубокая концентрация на задачах',
            'Стабильные отношения',
            'Последовательное развитие',
            'Надежность для других'
          ],
          challenges: [
            'Может быть слишком предсказуемым',
            'Сопротивление изменениям',
            'Потребность в стабильности',
            'Сложности с адаптацией'
          ],
          advice: [
            'Используйте свою стабильность как силу',
            'Развивайте гибкость постепенно',
            'Доверяйте своей последовательности',
            'Создавайте стабильную среду'
          ]
        },
        'Split Definition': {
          title: 'Разделенное Определение',
          subtitle: 'Двойственная природа и поиск целостности',
          description: 'Ваша энергия разделена на две части, которые ищут соединения. Это создает внутреннее напряжение и потребность в отношениях или деятельности, которые помогают объединить эти части.',
          characteristics: [
            'Двойственная природа',
            'Потребность в соединении',
            'Внутреннее напряжение',
            'Поиск целостности'
          ],
          strengths: [
            'Богатство внутреннего мира',
            'Способность к глубокому пониманию',
            'Потребность в осмысленных связях',
            'Творческий потенциал'
          ],
          challenges: [
            'Внутреннее напряжение',
            'Потребность в правильных отношениях',
            'Сложности с принятием решений',
            'Чувство неполноты'
          ],
          advice: [
            'Ищите правильные отношения',
            'Развивайте внутреннюю целостность',
            'Используйте напряжение как мотивацию',
            'Будьте терпеливы с собой'
          ]
        },
        'Triple Split Definition': {
          title: 'Тройное Разделенное Определение',
          subtitle: 'Сложная внутренняя структура',
          description: 'Ваша энергия разделена на три части, создавая сложную внутреннюю динамику. Это требует особого внимания к балансу и поиску способов интеграции всех частей.',
          characteristics: [
            'Трехчастная структура',
            'Сложная внутренняя динамика',
            'Потребность в балансе',
            'Множественные аспекты личности'
          ],
          strengths: [
            'Богатство внутреннего мира',
            'Множественные таланты',
            'Способность к сложному мышлению',
            'Гибкость в подходах'
          ],
          challenges: [
            'Сложности с интеграцией',
            'Внутренние конфликты',
            'Потребность в правильной среде',
            'Сложности с фокусировкой'
          ],
          advice: [
            'Работайте над внутренней интеграцией',
            'Создавайте поддерживающую среду',
            'Развивайте терпение к себе',
            'Ищите способы объединения частей'
          ]
        },
        'Quadruple Split Definition': {
          title: 'Четверное Разделенное Определение',
          subtitle: 'Максимальная сложность внутренней структуры',
          description: 'Ваша энергия разделена на четыре части, что создает максимально сложную внутреннюю динамику. Это требует особого внимания к балансу и поиску способов интеграции всех частей.',
          characteristics: [
            'Четырехчастная структура',
            'Максимальная сложность',
            'Потребность в особом балансе',
            'Множественные аспекты личности'
          ],
          strengths: [
            'Невероятное богатство внутреннего мира',
            'Множественные таланты и способности',
            'Способность к очень сложному мышлению',
            'Максимальная гибкость'
          ],
          challenges: [
            'Очень сложная интеграция',
            'Множественные внутренние конфликты',
            'Потребность в особой среде',
            'Сложности с фокусировкой'
          ],
          advice: [
            'Будьте особенно терпеливы с собой',
            'Создавайте максимально поддерживающую среду',
            'Работайте над интеграцией постепенно',
            'Ищите способы объединения всех частей'
          ]
        },
        'No Definition': {
          title: 'Без Определения (Рефлектор)',
          subtitle: 'Чистое отражение и чувствительность',
          description: 'У вас нет определенных центров, что делает вас чистым отражением окружающей среды. Вы чрезвычайно чувствительны к энергии других людей и мест, и ваша роль — быть зеркалом для общества.',
          characteristics: [
            'Отсутствие определенных центров',
            'Чрезвычайная чувствительность',
            'Роль зеркала для общества',
            'Зависимость от окружающей среды'
          ],
          strengths: [
            'Чистое восприятие',
            'Способность отражать истину',
            'Уникальная перспектива',
            'Чувствительность к энергии'
          ],
          challenges: [
            'Зависимость от окружающей среды',
            'Сложности с принятием решений',
            'Потребность в правильной среде',
            'Чувствительность к негативной энергии'
          ],
          advice: [
            'Выбирайте среду очень тщательно',
            'Ждите лунный цикл для решений',
            'Используйте свою чувствительность как дар',
            'Создавайте защитные практики'
          ]
        }
      },
      en: {
        'Single Definition': {
          title: 'Single Definition',
          subtitle: 'Stable and consistent energy',
          description: 'You have a single, stable energetic configuration. This means your energy flows consistently and predictably. You can rely on your inner stability and consistency in decision-making.',
          characteristics: [
            'Stable and consistent energy',
            'Predictable behavior patterns',
            'Ability for deep focus',
            'Reliability and constancy'
          ],
          strengths: [
            'Deep concentration on tasks',
            'Stable relationships',
            'Consistent development',
            'Reliability for others'
          ],
          challenges: [
            'May be too predictable',
            'Resistance to change',
            'Need for stability',
            'Difficulties with adaptation'
          ],
          advice: [
            'Use your stability as strength',
            'Develop flexibility gradually',
            'Trust your consistency',
            'Create a stable environment'
          ]
        },
        'Split Definition': {
          title: 'Split Definition',
          subtitle: 'Dual nature and search for wholeness',
          description: 'Your energy is split into two parts that seek connection. This creates internal tension and a need for relationships or activities that help unite these parts.',
          characteristics: [
            'Dual nature',
            'Need for connection',
            'Internal tension',
            'Search for wholeness'
          ],
          strengths: [
            'Rich inner world',
            'Ability for deep understanding',
            'Need for meaningful connections',
            'Creative potential'
          ],
          challenges: [
            'Internal tension',
            'Need for right relationships',
            'Difficulties with decision-making',
            'Feeling of incompleteness'
          ],
          advice: [
            'Seek right relationships',
            'Develop inner wholeness',
            'Use tension as motivation',
            'Be patient with yourself'
          ]
        },
        'Triple Split Definition': {
          title: 'Triple Split Definition',
          subtitle: 'Complex internal structure',
          description: 'Your energy is split into three parts, creating complex internal dynamics. This requires special attention to balance and finding ways to integrate all parts.',
          characteristics: [
            'Three-part structure',
            'Complex internal dynamics',
            'Need for balance',
            'Multiple aspects of personality'
          ],
          strengths: [
            'Rich inner world',
            'Multiple talents',
            'Ability for complex thinking',
            'Flexibility in approaches'
          ],
          challenges: [
            'Difficulties with integration',
            'Internal conflicts',
            'Need for right environment',
            'Difficulties with focus'
          ],
          advice: [
            'Work on internal integration',
            'Create a supportive environment',
            'Develop patience with yourself',
            'Seek ways to unite parts'
          ]
        },
        'Quadruple Split Definition': {
          title: 'Quadruple Split Definition',
          subtitle: 'Maximum complexity of internal structure',
          description: 'Your energy is split into four parts, creating maximally complex internal dynamics. This requires special attention to balance and finding ways to integrate all parts.',
          characteristics: [
            'Four-part structure',
            'Maximum complexity',
            'Need for special balance',
            'Multiple aspects of personality'
          ],
          strengths: [
            'Incredible richness of inner world',
            'Multiple talents and abilities',
            'Ability for very complex thinking',
            'Maximum flexibility'
          ],
          challenges: [
            'Very complex integration',
            'Multiple internal conflicts',
            'Need for special environment',
            'Difficulties with focus'
          ],
          advice: [
            'Be especially patient with yourself',
            'Create maximally supportive environment',
            'Work on integration gradually',
            'Seek ways to unite all parts'
          ]
        },
        'No Definition': {
          title: 'No Definition (Reflector)',
          subtitle: 'Pure reflection and sensitivity',
          description: 'You have no defined centers, making you a pure reflection of your environment. You are extremely sensitive to the energy of other people and places, and your role is to be a mirror for society.',
          characteristics: [
            'No defined centers',
            'Extreme sensitivity',
            'Role as mirror for society',
            'Dependence on environment'
          ],
          strengths: [
            'Pure perception',
            'Ability to reflect truth',
            'Unique perspective',
            'Sensitivity to energy'
          ],
          challenges: [
            'Dependence on environment',
            'Difficulties with decision-making',
            'Need for right environment',
            'Sensitivity to negative energy'
          ],
          advice: [
            'Choose environment very carefully',
            'Wait lunar cycle for decisions',
            'Use your sensitivity as a gift',
            'Create protective practices'
          ]
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[definition] || {
      title: definition,
      subtitle: '',
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      characteristics: [],
      strengths: [],
      challenges: [],
      advice: []
    }
  }

  const current = getDefinitionDescription(currentDefinition)

  return (
    <div className="min-h-screen bg-space-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => {
              setSelectedModule('human-design')
              setCurrentScreen('results')
              router.push('/results?module=human-design')
            }}
            className="inline-flex items-center gap-2 text-cosmic-400 hover:text-cosmic-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ru' ? 'Назад к результатам' : 'Back to results'}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cosmic-100 mb-2">{current.title}</h1>
          <p className="text-cosmic-300 text-xl">{current.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cosmic-card mb-6">
          <h2 className="cosmic-subtitle text-2xl mb-4">{language === 'ru' ? 'Описание' : 'Description'}</h2>
          <p className="text-cosmic-300 leading-relaxed">{current.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="cosmic-card mb-6">
          <h3 className="cosmic-subtitle text-xl mb-4">{language === 'ru' ? 'Характеристики' : 'Characteristics'}</h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {current.characteristics.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="cosmic-card">
            <h3 className="cosmic-subtitle text-xl mb-4 text-green-400">{language === 'ru' ? 'Сильные стороны' : 'Strengths'}</h3>
            <ul className="list-disc list-inside text-cosmic-300 space-y-2">
              {current.strengths.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="cosmic-card">
            <h3 className="cosmic-subtitle text-xl mb-4 text-orange-400">{language === 'ru' ? 'Вызовы' : 'Challenges'}</h3>
            <ul className="list-disc list-inside text-cosmic-300 space-y-2">
              {current.challenges.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="cosmic-card">
          <h3 className="cosmic-subtitle text-xl mb-4">{language === 'ru' ? 'Советы' : 'Advice'}</h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {current.advice.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
