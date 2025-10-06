'use client'

import { use as usePromise } from 'react'
import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: Promise<{ authority: string }>
}

export default function HumanDesignAuthorityPage({ params }: PageProps) {
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
  const slug = decodeURIComponent(resolvedParams?.authority || '').toLowerCase()

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

  const slugToAuthority: Record<string, string> = {
    'emotional': 'Emotional',
    'sacral': 'Sacral',
    'splenic': 'Splenic',
    'ego': 'Ego',
    'self-projected': 'Self-Projected',
    'environmental': 'Environmental',
    'lunar': 'Lunar'
  }

  const currentAuthority = slugToAuthority[slug] || humanDesignData.authority

  const getAuthorityDescription = (authority: string) => {
    const descriptions = {
      ru: {
        'Emotional': {
          title: 'Эмоциональный Авторитет',
          subtitle: 'Решения через эмоциональные волны',
          description: 'Примите, что ясность приходит со временем. Не принимайте решений на пике эмоций. Дождитесь эмоциональной нейтральности — тогда вы увидите истину.',
          howTo: ['Переспите с решением', 'Отслеживайте свои волны', 'Не спешите при сильных эмоциях', 'Доверяйте ясности после спада']
        },
        'Sacral': {
          title: 'Сакральный Авторитет',
          subtitle: 'Мгновенный отклик тела',
          description: 'Ваше тело отвечает быстро и честно — через «угу/не‑угу». Учитесь слышать звуки и ощущения в животе. Доверяйте первому отклику.',
          howTo: ['Отвечайте на вопросы «Да/Нет»', 'Замедляйтесь, чтобы услышать отклик', 'Не логикой, а телом', 'Действуйте сразу после «угу»']
        },
        'Splenic': {
          title: 'Селезёночный Авторитет',
          subtitle: 'Тихая интуиция момента',
          description: 'Интуиция звучит тихо и однократно — это мгновенное знание. Она о безопасности и благополучии здесь и сейчас. Слушайте тонкие сигналы тела.',
          howTo: ['Будьте в настоящем моменте', 'Отслеживайте тихие импульсы', 'Не переигрывайте прошлое', 'Доверяйте первому ощущению']
        },
        'Ego': {
          title: 'Эго Авторитет (Сердечный)',
          subtitle: 'Сила воли и обещания',
          description: 'Решения исходят из вашего центра воли. Спрашивайте: «Я правда хочу это и готов ли я это потянуть?» Честность с собой — ключ.',
          howTo: ['Задавайте вопрос о желании', 'Оценивайте ресурс воли', 'Не обещайте сверх меры', 'Действуйте, когда есть желание и ресурс']
        },
        'Self-Projected': {
          title: 'Самопроецируемый Авторитет',
          subtitle: 'Истина звучит в вашем голосе',
          description: 'Говорите вслух с доверенным человеком — в голосе проявится ваша истинность. Слушайте, как звучит ваша идентичность.',
          howTo: ['Проговаривайте решения вслух', 'Выбирайте безопасных слушателей', 'Слушайте тембр и уверенность', 'Не принимайте решения в изоляции']
        },
        'Environmental': {
          title: 'Окружающая среда (Ментальный Проектор)',
          subtitle: 'Решения через правильные места и людей',
          description: 'Ясность рождается в беседе с правильными людьми в правильных местах. Вы отражаете среду — выбирайте её осознанно.',
          howTo: ['Меняйте контекст и наблюдайте себя', 'Обсуждайте с несколькими людьми', 'Ищите ясность, а не советы', 'Доверяйте телесному комфорту в месте']
        },
        'Lunar': {
          title: 'Лунный Авторитет (Рефлектор)',
          subtitle: '28 дней на важные решения',
          description: 'Дождитесь полного лунного цикла. Вы чувствуете мир всеми центрами — дайте времени проявить истину через опыт разных фаз.',
          howTo: ['Переждите 28 дней', 'Ведите дневник состояний', 'Смотрите на повторяющиеся темы', 'Решайте, когда появится спокойная ясность']
        }
      },
      en: {
        'Emotional': {
          title: 'Emotional Authority',
          subtitle: 'Decisions through emotional waves',
          description: 'Clarity comes with time. Avoid deciding at emotional peaks. Wait for neutrality; truth appears after the wave passes.',
          howTo: ['Sleep on it', 'Track your waves', 'Avoid haste in strong emotions', 'Trust clarity after the dip']
        },
        'Sacral': {
          title: 'Sacral Authority',
          subtitle: 'Instant bodily response',
          description: 'Your body responds quickly and honestly — via yes/no gut sounds. Train to hear them and trust the first response.',
          howTo: ['Answer Yes/No prompts', 'Slow down to hear it', 'Decide by body, not logic', 'Act right after the yes']
        },
        'Splenic': {
          title: 'Splenic Authority',
          subtitle: 'Quiet intuition of the moment',
          description: 'Intuition is a one-time quiet knowing about safety in the now. Listen to subtle bodily cues.',
          howTo: ['Stay present', 'Notice subtle impulses', 'Don’t replay the past', 'Trust the first sensation']
        },
        'Ego': {
          title: 'Ego Authority (Heart)',
          subtitle: 'Willpower and commitments',
          description: 'Decisions come from will. Ask: “Do I truly want this and can I carry it?” Radical honesty is key.',
          howTo: ['Ask about desire', 'Check will resource', 'Avoid overpromising', 'Act when desire and capacity align']
        },
        'Self-Projected': {
          title: 'Self-Projected Authority',
          subtitle: 'Truth in your voice',
          description: 'Speak out with a trusted person — your identity emerges through your voice. Listen to tone and certainty.',
          howTo: ['Say it out loud', 'Choose safe listeners', 'Listen to tone and confidence', 'Avoid isolated decisions']
        },
        'Environmental': {
          title: 'Environmental (Mental Projector)',
          subtitle: 'Decisions via correct places and people',
          description: 'Clarity arises by discussing in the right places with the right people. You mirror the environment — choose it wisely.',
          howTo: ['Change context and observe', 'Discuss with several people', 'Seek clarity, not advice', 'Trust bodily comfort in place']
        },
        'Lunar': {
          title: 'Lunar Authority (Reflector)',
          subtitle: '28 days for major decisions',
          description: 'Wait a full lunar cycle. You sense the world with all centers — time allows truth to reveal across phases.',
          howTo: ['Wait 28 days', 'Journal your states', 'Look for recurring themes', 'Decide when calm clarity appears']
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[authority] || {
      title: authority,
      subtitle: '',
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      howTo: []
    }
  }

  const current = getAuthorityDescription(currentAuthority)

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="cosmic-card">
          <h3 className="cosmic-subtitle text-xl mb-4">{language === 'ru' ? 'Как применять' : 'How to Apply'}</h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {current.howTo.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

