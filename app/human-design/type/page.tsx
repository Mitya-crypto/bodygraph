'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Heart, Brain, Star, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HumanDesignTypePage() {
  const { userProfile, language, setCurrentScreen, setSelectedModule } = useAppStore()
  const router = useRouter()

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="cosmic-card text-center">
          <p className="text-cosmic-300">
            {language === 'ru' ? 'Профиль пользователя не найден' : 'User profile not found'}
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

  const getTypeDescription = (type: string) => {
    const descriptions = {
      ru: {
        Generator: {
          title: 'Генератор',
          subtitle: 'Создатель и строитель мира',
          description: 'Генераторы составляют самую большую группу (~38% населения) и обладают устойчивым доступом к жизненной энергии через определённый Сакральный центр. Их естественный ритм — отвечать на жизнь, а не инициировать. Когда Генератор идёт за откликом, энергия течёт легко и приносит глубокое чувство удовлетворения. В противном случае возникает фрустрация. Аура Генератора открыта и притягательная — она буквально «примагничивает» к себе людей, задачи и возможности, на которые можно откликнуться. Сильные стороны: выносливость, мастерство через практику, надёжность. Сложности: нетерпение, попытка «толкать» процесс, согласие на то, что не зажигает.',
          keywords: ['Энергия', 'Отклик', 'Удовлетворение', 'Выносливость', 'Мастерство'],
          advice: 'Замедляйтесь и слушайте сакральный отклик «угу/не-угу». Сначала отклик — потом действие. Выбирайте деятельность, которая действительно зажигает: через постоянство придёт мастерство и глубокое удовлетворение.'
        },
        'Manifesting Generator': {
          title: 'Манифестирующий Генератор',
          subtitle: 'Быстрый создатель и реализатор',
          description: 'Манифестирующие Генераторы (~32% населения) — это подтип Генераторов с уникальной способностью быстро переходить от идеи к действию. Они имеют определённый Сакральный центр + определённый Горловой центр, соединённый с мотором. Их стратегия: сначала отклик, затем информирование. Они могут быстро инициировать после получения отклика, что делает их невероятно эффективными. Подпись: удовлетворение; тема «не-я»: фрустрация и гнев. Сильные стороны: скорость, многозадачность, адаптивность. Сложности: нетерпение, попытка делать всё сразу, не слушая отклик.',
          keywords: ['Скорость', 'Многозадачность', 'Адаптивность', 'Отклик', 'Информирование'],
          advice: 'Сначала отклик, затем информируйте о своих действиях. Не пытайтесь делать всё одновременно — выбирайте 2-3 важных дела и завершайте их. Слушайте сакральный отклик даже в быстром темпе.'
        },
        Manifestor: {
          title: 'Манифестор',
          subtitle: 'Инициатор и лидер',
          description: 'Манифесторы — двигатели перемен. Их Горловой центр связан с мотором, поэтому им естественно начинать процессы без внешнего запроса. Аура — закрытая и отталкивающая — создаёт ощущение автономности. Ключ к гармонии — информирование: когда Манифестор заранее сообщает о своих намерениях, сопротивления меньше. Подпись — состояние покоя; тема «не-я» — гнев. Сильные стороны: стремительность, независимость, влияние. Сложности: реакции окружения, трудности с доверием и делегированием.',
          keywords: ['Инициация', 'Покой', 'Влияние', 'Независимость', 'Информирование'],
          advice: 'Перед стартом информируйте значимых людей — не за разрешением, а ради прозрачности. Планируйте короткие автономные рывки и оставляйте пространство для восстановления после импульсных запусков.'
        },
        Projector: {
          title: 'Проектор',
          subtitle: 'Гид и стратег',
          description: 'Проекторы созданы для видения людей и систем в глубину. У них нет устойчивого доступа к сакральной энергии, зато есть тонкая способность направлять энергию других. Их аура фокусированная и «считывающая». Корректная стратегия — ждать признания и приглашения, тогда проявляется подпись — успех; тема «не-я» — горечь. Сильные стороны: стратегическое видение, наставничество, оптимизация. Сложности: сравнение с энергетическими типами, переутомление, если пытаться «тянуть» самой(ому).',
          keywords: ['Приглашение', 'Признание', 'Успех', 'Наставничество', 'Стратегия'],
          advice: 'Инвестируйте в мастерство и видимость. Выбирайте правильную среду и людей, которые ценят ваше видение. Берегите энергию: ритм «качественно — а не много».'
        },
        Reflector: {
          title: 'Рефлектор',
          subtitle: 'Мудрец и зеркало',
          description: 'Рефлекторы — редкие (≈1%) и чрезвычайно чувствительные к среде люди: все центры у них открыты. Они отражают состояние людей и мест, становясь индикатором здоровья сообщества. Их опыт меняется в такт лунному циклу; ясность по важным вопросам приходит за 28 дней. Подпись — удивление; тема «не-я» — разочарование. Сильные стороны: объективность, интуитивное считывание атмосферы, мудрость наблюдателя. Сложности: нестабильность самоощущения в «тяжёлых» средах, спешка в решениях.',
          keywords: ['Зеркало', 'Луна', 'Удивление', 'Среда', 'Наблюдение'],
          advice: 'Выбирайте среду и людей предельно бережно — вы становитесь тем, что вокруг. Важные решения проживайте полный лунный цикл, фиксируя ощущения в разных фазах. Создавайте ритуалы заземления и гибкий режим отдыха.'
        }
      },
      en: {
        Generator: {
          title: 'Generator',
          subtitle: 'Creator and builder of the world',
          description: 'Generators (~38% of population) have consistent access to life force through a defined Sacral. Their natural rhythm is to respond first and act second. When aligned, they experience deep satisfaction; when not, frustration. Open and enveloping aura attracts the right work and people. Strengths: stamina, mastery through repetition. Challenges: impatience, pushing without response.',
          keywords: ['Energy', 'Response', 'Satisfaction', 'Stamina', 'Mastery'],
          advice: 'Slow down and listen for the sacral "uh‑huh/uh‑uh". Choose work that lights you up; mastery and satisfaction follow consistent response-led action.'
        },
        'Manifesting Generator': {
          title: 'Manifesting Generator',
          subtitle: 'Fast creator and implementer',
          description: 'Manifesting Generators (~32% of population) are a Generator subtype with unique ability to quickly move from idea to action. They have defined Sacral + defined Throat connected to motor. Strategy: respond first, then inform. They can quickly initiate after getting response, making them incredibly efficient. Signature: satisfaction; not-self theme: frustration and anger. Strengths: speed, multitasking, adaptability. Challenges: impatience, trying to do everything at once without listening to response.',
          keywords: ['Speed', 'Multitasking', 'Adaptability', 'Response', 'Informing'],
          advice: 'First response, then inform about your actions. Don\'t try to do everything simultaneously — choose 2-3 important things and complete them. Listen to sacral response even at fast pace.'
        },
        Manifestor: {
          title: 'Manifestor',
          subtitle: 'Initiator and leader',
          description: 'Manifestors are designed to initiate and move things into motion. A closed, repelling aura grants autonomy; harmony hinges on informing before action. Signature is peace; not‑self theme is anger. Strengths: impact, independence. Challenges: resistance from others, over-isolation.',
          keywords: ['Initiation', 'Peace', 'Impact', 'Independence', 'Informing'],
          advice: 'Inform key people before you act to lower resistance. Work in powerful bursts and allow decompression afterwards.'
        },
        Projector: {
          title: 'Projector',
          subtitle: 'Guide and strategist',
          description: 'Projectors see people and systems deeply. Without consistent sacral energy, they thrive when recognized and invited. Signature is success; not‑self theme is bitterness. Strengths: guidance, optimization. Challenges: overworking to prove worth.',
          keywords: ['Invitation', 'Recognition', 'Success', 'Guidance', 'Strategy'],
          advice: 'Invest in mastery and visibility. Curate environments and relationships that recognize your value. Protect your energy; quality over quantity.'
        },
        Reflector: {
          title: 'Reflector',
          subtitle: 'Sage and mirror',
          description: 'Reflectors are rare and highly sensitive to environment; all centers are open. They mirror the health of their community and gain clarity over a 28‑day lunar cycle. Signature is surprise; not‑self theme is disappointment. Strengths: objectivity, reading atmospheres. Challenges: unstable self‑sense in unhealthy settings.',
          keywords: ['Mirror', 'Moon', 'Surprise', 'Environment', 'Observation'],
          advice: 'Choose people and places with care. For major decisions, track your feelings through a full lunar cycle. Build grounding rituals and flexible rest.'
        }
      }
    }
    return descriptions[language][type as keyof typeof descriptions[typeof language]] || descriptions[language]['Generator']
  }

  const typeInfo = getTypeDescription(humanDesignData.type)

  return (
    <div className="min-h-screen bg-space-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
          className="cosmic-card text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="cosmic-title text-4xl mb-4">{typeInfo.title}</h1>
          <p className="cosmic-subtitle text-xl text-cosmic-300 mb-4">{typeInfo.subtitle}</p>
          <div className="text-2xl font-bold text-cosmic-400">
            {humanDesignData.type}
          </div>
        </motion.div>

        {/* Основное описание */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card mb-8"
        >
          <h2 className="cosmic-subtitle text-2xl mb-4">
            {language === 'ru' ? 'Описание' : 'Description'}
          </h2>
          <p className="text-cosmic-300 leading-relaxed text-lg">
            {typeInfo.description}
          </p>
        </motion.div>

        {/* Ключевые слова */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cosmic-card mb-8"
        >
          <h3 className="cosmic-subtitle text-xl mb-4">
            {language === 'ru' ? 'Ключевые слова' : 'Keywords'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {typeInfo.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-cosmic-600/20 text-cosmic-300 rounded-full border border-cosmic-500/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Совет */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="cosmic-subtitle text-xl mb-3">
                {language === 'ru' ? 'Совет' : 'Advice'}
              </h3>
              <p className="text-cosmic-300 leading-relaxed">
                {typeInfo.advice}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
