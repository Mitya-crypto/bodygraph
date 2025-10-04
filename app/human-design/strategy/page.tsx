'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumanDesignStrategyPage() {
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

  // Парсим дату и время из строк
  const birthDate = new Date(userProfile.birthDate)
  const birthTime = new Date(`2000-01-01T${userProfile.birthTime}`)

  // Вычисляем Human Design данные
  const humanDesignData = calculateHumanDesign({
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: birthTime.getHours(),
    minute: birthTime.getMinutes(),
    latitude: userProfile.coordinates?.lat || 0,
    longitude: userProfile.coordinates?.lng || 0
  })

  const getStrategyDescription = (strategy: string) => {
    const descriptions = {
      ru: {
        'Respond': {
          title: 'Отвечайте на жизненные запросы',
          subtitle: 'Стратегия Генератора',
          description: 'Генераторы должны ждать, пока жизнь предложит им что-то, на что можно откликнуться. Не инициируйте — реагируйте. Ваш Сакральный центр знает, что правильно для вас. Когда что-то зажигает вас изнутри, это ваш отклик. Слушайте звуки «угу» и «не-угу» из вашего тела.',
          howTo: [
            'Остановитесь и прислушайтесь к своему телу',
            'Задайте себе вопрос: «Это зажигает меня?»',
            'Ждите отклика от Сакрального центра',
            'Действуйте только после получения отклика'
          ],
          examples: [
            'Новая работа — чувствуете ли вы возбуждение?',
            'Отношения — есть ли внутренний отклик?',
            'Проекты — зажигают ли они вас?'
          ],
          benefits: ['Глубокое удовлетворение', 'Правильные решения', 'Энергия для завершения', 'Мастерство через практику']
        },
        'Respond, then Inform': {
          title: 'Отвечайте, затем информируйте',
          subtitle: 'Стратегия Манифестирующего Генератора',
          description: 'Манифестирующие Генераторы сначала получают отклик, а затем информируют окружающих о своих действиях. Это помогает избежать сопротивления и создает гармоничное взаимодействие. Ваша скорость и многозадачность — это дар, но используйте их мудро.',
          howTo: [
            'Сначала получите отклик от Сакрального центра',
            'Информируйте окружающих о своих намерениях',
            'Действуйте быстро, но осознанно',
            'Завершайте начатое перед новыми проектами'
          ],
          examples: [
            'Новый проект — отклик + информирование команды',
            'Путешествие — отклик + сообщение близким',
            'Покупка — отклик + обсуждение с партнером'
          ],
          benefits: ['Быстрая реализация', 'Меньше сопротивления', 'Эффективность', 'Гармоничные отношения']
        },
        'Inform': {
          title: 'Информируйте перед действием',
          subtitle: 'Стратегия Манифестора',
          description: 'Манифесторы должны информировать окружающих о своих намерениях перед тем, как действовать. Это помогает избежать сопротивления и создает более гармоничное взаимодействие. Ваша способность инициировать — это дар, но используйте его мудро.',
          howTo: [
            'Четко сформулируйте свои намерения',
            'Информируйте всех заинтересованных сторон',
            'Дайте время на реакцию и вопросы',
            'Действуйте после информирования'
          ],
          examples: [
            'Новый бизнес — информирование семьи и партнеров',
            'Переезд — сообщение всем заинтересованным',
            'Изменения в отношениях — честный разговор'
          ],
          benefits: ['Меньше сопротивления', 'Поддержка окружения', 'Спокойствие', 'Успешная реализация']
        },
        'Wait for the Invitation': {
          title: 'Ждите приглашения',
          subtitle: 'Стратегия Проектора',
          description: 'Проекторы должны ждать приглашения для реализации своих способностей. Не предлагайте свою мудрость — ждите, пока вас попросят. Ваша ценность в том, чтобы видеть и направлять других, но только когда вас об этом просят.',
          howTo: [
            'Не предлагайте помощь первыми',
            'Ждите, пока вас попросят о совете',
            'Окружайте себя людьми, которые ценят вас',
            'Сохраняйте энергию для правильных моментов'
          ],
          examples: [
            'Работа — ждите приглашения на собеседование',
            'Отношения — ждите приглашения на свидание',
            'Проекты — ждите приглашения участвовать'
          ],
          benefits: ['Признание', 'Правильное использование энергии', 'Успех', 'Глубокое понимание других']
        },
        'Wait for the Lunar Cycle': {
          title: 'Ждите лунный цикл',
          subtitle: 'Стратегия Рефлектора',
          description: 'Рефлекторы должны ждать полный лунный цикл (28 дней) перед принятием важных решений. Это позволяет им получить полную картину ситуации и принять правильное решение. Ваша чувствительность — это дар, но требует времени для обработки информации.',
          howTo: [
            'Отложите важные решения на 28 дней',
            'Наблюдайте за изменениями в течение цикла',
            'Ведите дневник ощущений',
            'Принимайте решения только после полного цикла'
          ],
          examples: [
            'Смена работы — месяц наблюдений',
            'Переезд — полный цикл размышлений',
            'Новые отношения — время для понимания'
          ],
          benefits: ['Мудрые решения', 'Объективность', 'Глубокое понимание', 'Удивление от правильного выбора']
        }
      },
      en: {
        'Respond': {
          title: 'Respond to life\'s requests',
          subtitle: 'Generator Strategy',
          description: 'Generators must wait for life to offer them something to respond to. Don\'t initiate — respond. Your Sacral center knows what\'s right for you. When something lights you up from within, that\'s your response. Listen for the "uh-huh" and "uh-uh" sounds from your body.',
          howTo: [
            'Stop and listen to your body',
            'Ask yourself: "Does this light me up?"',
            'Wait for response from Sacral center',
            'Act only after receiving response'
          ],
          examples: [
            'New job — do you feel excitement?',
            'Relationships — is there inner response?',
            'Projects — do they light you up?'
          ],
          benefits: ['Deep satisfaction', 'Right decisions', 'Energy to complete', 'Mastery through practice']
        },
        'Respond, then Inform': {
          title: 'Respond, then inform',
          subtitle: 'Manifesting Generator Strategy',
          description: 'Manifesting Generators first get a response, then inform others about their actions. This helps avoid resistance and creates harmonious interaction. Your speed and multitasking are gifts, but use them wisely.',
          howTo: [
            'First get response from Sacral center',
            'Inform others about your intentions',
            'Act quickly but consciously',
            'Complete what you start before new projects'
          ],
          examples: [
            'New project — response + informing team',
            'Travel — response + telling loved ones',
            'Purchase — response + discussing with partner'
          ],
          benefits: ['Quick implementation', 'Less resistance', 'Efficiency', 'Harmonious relationships']
        },
        'Inform': {
          title: 'Inform before acting',
          subtitle: 'Manifestor Strategy',
          description: 'Manifestors must inform others about their intentions before acting. This helps avoid resistance and creates more harmonious interaction. Your ability to initiate is a gift, but use it wisely.',
          howTo: [
            'Clearly formulate your intentions',
            'Inform all interested parties',
            'Give time for reaction and questions',
            'Act after informing'
          ],
          examples: [
            'New business — informing family and partners',
            'Moving — telling all interested parties',
            'Relationship changes — honest conversation'
          ],
          benefits: ['Less resistance', 'Environmental support', 'Peace', 'Successful implementation']
        },
        'Wait for the Invitation': {
          title: 'Wait for the invitation',
          subtitle: 'Projector Strategy',
          description: 'Projectors must wait for an invitation to realize their abilities. Don\'t offer your wisdom — wait to be asked. Your value is in seeing and guiding others, but only when asked.',
          howTo: [
            'Don\'t offer help first',
            'Wait to be asked for advice',
            'Surround yourself with people who value you',
            'Save energy for the right moments'
          ],
          examples: [
            'Work — wait for interview invitation',
            'Relationships — wait for date invitation',
            'Projects — wait for participation invitation'
          ],
          benefits: ['Recognition', 'Right energy use', 'Success', 'Deep understanding of others']
        },
        'Wait for the Lunar Cycle': {
          title: 'Wait for the lunar cycle',
          subtitle: 'Reflector Strategy',
          description: 'Reflectors must wait a full lunar cycle (28 days) before making important decisions. This allows them to get the full picture of the situation and make the right decision. Your sensitivity is a gift, but requires time to process information.',
          howTo: [
            'Postpone important decisions for 28 days',
            'Observe changes throughout the cycle',
            'Keep a journal of sensations',
            'Make decisions only after full cycle'
          ],
          examples: [
            'Job change — month of observations',
            'Moving — full cycle of reflection',
            'New relationships — time for understanding'
          ],
          benefits: ['Wise decisions', 'Objectivity', 'Deep understanding', 'Surprise from right choice']
        }
      }
    }
    return descriptions[language][strategy as keyof typeof descriptions[typeof language]] || {
      title: strategy,
      subtitle: '',
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      howTo: [],
      examples: [],
      benefits: []
    }
  }

  const currentStrategyDescription = getStrategyDescription(humanDesignData.strategy)

  return (
    <div className="min-h-screen bg-space-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Если запрошена общая страница, перенаправляем на страницу типа */}
        {/* Это обеспечит соответствие выбранному типу при изменении профиля */}
        {(() => {
          const typeToSlug: Record<string, string> = {
            'Generator': 'generator',
            'Manifesting Generator': 'manifesting-generator',
            'Manifestor': 'manifestor',
            'Projector': 'projector',
            'Reflector': 'reflector'
          }
          const slug = typeToSlug[humanDesignData.type] || 'generator'
          // Безопасный клиентский редирект
          if (typeof window !== 'undefined') {
            router.replace(`/human-design/strategy/${slug}`)
          }
          return null
        })()}
        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => {
              setSelectedModule('human-design')
              setCurrentScreen('results')
              router.push('/')
            }}
            className="inline-flex items-center gap-2 text-cosmic-400 hover:text-cosmic-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ru' ? 'Назад к результатам' : 'Back to results'}
          </button>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-cosmic-100 mb-2">
            {currentStrategyDescription.title}
          </h1>
          <p className="text-cosmic-300 text-xl">
            {currentStrategyDescription.subtitle}
          </p>
        </motion.div>

        {/* Основное описание */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card mb-6"
        >
          <h2 className="cosmic-subtitle text-2xl mb-4">
            {language === 'ru' ? 'Описание' : 'Description'}
          </h2>
          <p className="text-cosmic-300 leading-relaxed">
            {currentStrategyDescription.description}
          </p>
        </motion.div>

        {/* Как применять */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cosmic-card mb-6"
        >
          <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cosmic-400" />
            {language === 'ru' ? 'Как применять' : 'How to Apply'}
          </h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {currentStrategyDescription.howTo.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Примеры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card mb-6"
        >
          <h3 className="cosmic-subtitle text-xl mb-4">
            {language === 'ru' ? 'Примеры применения' : 'Examples'}
          </h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {currentStrategyDescription.examples.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Преимущества */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cosmic-card"
        >
          <h3 className="cosmic-subtitle text-xl mb-4">
            {language === 'ru' ? 'Преимущества' : 'Benefits'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentStrategyDescription.benefits.map((benefit, index) => (
              <div key={index} className="bg-space-700 text-cosmic-400 text-sm px-3 py-2 rounded-lg">
                {benefit}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
