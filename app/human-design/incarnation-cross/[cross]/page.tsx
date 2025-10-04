'use client'

import { use as usePromise } from 'react'
import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: Promise<{ cross: string }>
}

export default function HumanDesignIncarnationCrossPage({ params }: PageProps) {
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
  const slug = decodeURIComponent(resolvedParams?.cross || '').toLowerCase()

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

  const currentCross = humanDesignData.incarnationCross

  const getCrossDescription = (cross: string) => {
    const descriptions = {
      ru: {
        'Right Angle Cross of the Sphinx': {
          title: 'Правый Угловой Крест Сфинкса',
          subtitle: 'Загадка и мудрость',
          description: 'Ваш инкарнационный крест связан с загадкой, мудростью и глубоким пониманием жизни. Вы пришли в этот мир, чтобы раскрывать тайны и делиться мудростью с другими.',
          characteristics: [
            'Глубокая мудрость и понимание',
            'Способность к разгадыванию загадок',
            'Интуитивное знание',
            'Стремление к истине'
          ],
          mission: [
            'Раскрывать тайны жизни',
            'Делиться мудростью с другими',
            'Помогать людям находить ответы',
            'Быть проводником к истине'
          ],
          strengths: [
            'Глубокая интуиция',
            'Способность к анализу',
            'Мудрость в принятии решений',
            'Умение видеть суть вещей'
          ],
          challenges: [
            'Может быть слишком загадочным',
            'Сложности с простыми объяснениями',
            'Потребность в глубоком понимании',
            'Изоляция от поверхностности'
          ],
          advice: [
            'Доверяйте своей интуиции',
            'Делитесь мудростью доступно',
            'Ищите единомышленников',
            'Развивайте терпение к другим'
          ]
        },
        'Left Angle Cross of the Sphinx': {
          title: 'Левый Угловой Крест Сфинкса',
          subtitle: 'Загадка и трансформация',
          description: 'Ваш инкарнационный крест связан с трансформацией через загадки и тайны. Вы пришли, чтобы помочь другим проходить через изменения и находить новые решения.',
          characteristics: [
            'Способность к трансформации',
            'Понимание циклов изменений',
            'Глубокое проникновение в суть',
            'Стремление к эволюции'
          ],
          mission: [
            'Помогать в трансформации',
            'Раскрывать новые возможности',
            'Быть проводником изменений',
            'Показывать путь к росту'
          ],
          strengths: [
            'Гибкость в изменениях',
            'Способность к адаптации',
            'Глубокое понимание процессов',
            'Умение видеть потенциал'
          ],
          challenges: [
            'Сопротивление стабильности',
            'Сложности с рутиной',
            'Потребность в постоянных изменениях',
            'Изоляция от консервативности'
          ],
          advice: [
            'Принимайте изменения как естественный процесс',
            'Помогайте другим адаптироваться',
            'Ищите баланс между стабильностью и ростом',
            'Доверяйте процессу трансформации'
          ]
        },
        'Juxtaposition Cross of the Sphinx': {
          title: 'Крест Противопоставления Сфинкса',
          subtitle: 'Парадокс и баланс',
          description: 'Ваш инкарнационный крест связан с пониманием парадоксов и поиском баланса между противоположностями. Вы пришли, чтобы показать, как объединить кажущиеся противоречия.',
          characteristics: [
            'Понимание парадоксов',
            'Способность к синтезу',
            'Баланс противоположностей',
            'Глубокое понимание двойственности'
          ],
          mission: [
            'Объединять противоположности',
            'Показывать единство в различиях',
            'Создавать гармонию из хаоса',
            'Быть мостом между мирами'
          ],
          strengths: [
            'Способность к синтезу',
            'Понимание сложности',
            'Умение находить общее',
            'Гибкость мышления'
          ],
          challenges: [
            'Сложности с простыми решениями',
            'Потребность в глубоком понимании',
            'Изоляция от поверхностности',
            'Сопротивление упрощениям'
          ],
          advice: [
            'Ищите общее в различиях',
            'Развивайте терпение к сложности',
            'Помогайте другим видеть единство',
            'Доверяйте процессу синтеза'
          ]
        }
      },
      en: {
        'Right Angle Cross of the Sphinx': {
          title: 'Right Angle Cross of the Sphinx',
          subtitle: 'Mystery and wisdom',
          description: 'Your incarnation cross is connected to mystery, wisdom, and deep understanding of life. You came to this world to reveal mysteries and share wisdom with others.',
          characteristics: [
            'Deep wisdom and understanding',
            'Ability to solve mysteries',
            'Intuitive knowledge',
            'Quest for truth'
          ],
          mission: [
            'Reveal life mysteries',
            'Share wisdom with others',
            'Help people find answers',
            'Be a guide to truth'
          ],
          strengths: [
            'Deep intuition',
            'Analytical ability',
            'Wisdom in decision-making',
            'Ability to see the essence'
          ],
          challenges: [
            'May be too mysterious',
            'Difficulties with simple explanations',
            'Need for deep understanding',
            'Isolation from superficiality'
          ],
          advice: [
            'Trust your intuition',
            'Share wisdom accessibly',
            'Seek like-minded people',
            'Develop patience with others'
          ]
        },
        'Left Angle Cross of the Sphinx': {
          title: 'Left Angle Cross of the Sphinx',
          subtitle: 'Mystery and transformation',
          description: 'Your incarnation cross is connected to transformation through mysteries and secrets. You came to help others go through changes and find new solutions.',
          characteristics: [
            'Ability to transform',
            'Understanding of change cycles',
            'Deep penetration into essence',
            'Striving for evolution'
          ],
          mission: [
            'Help in transformation',
            'Reveal new possibilities',
            'Be a guide of changes',
            'Show the path to growth'
          ],
          strengths: [
            'Flexibility in changes',
            'Ability to adapt',
            'Deep understanding of processes',
            'Ability to see potential'
          ],
          challenges: [
            'Resistance to stability',
            'Difficulties with routine',
            'Need for constant changes',
            'Isolation from conservatism'
          ],
          advice: [
            'Accept changes as natural process',
            'Help others adapt',
            'Seek balance between stability and growth',
            'Trust the transformation process'
          ]
        },
        'Juxtaposition Cross of the Sphinx': {
          title: 'Juxtaposition Cross of the Sphinx',
          subtitle: 'Paradox and balance',
          description: 'Your incarnation cross is connected to understanding paradoxes and finding balance between opposites. You came to show how to unite seeming contradictions.',
          characteristics: [
            'Understanding of paradoxes',
            'Ability to synthesize',
            'Balance of opposites',
            'Deep understanding of duality'
          ],
          mission: [
            'Unite opposites',
            'Show unity in differences',
            'Create harmony from chaos',
            'Be a bridge between worlds'
          ],
          strengths: [
            'Ability to synthesize',
            'Understanding of complexity',
            'Ability to find common ground',
            'Flexibility of thinking'
          ],
          challenges: [
            'Difficulties with simple solutions',
            'Need for deep understanding',
            'Isolation from superficiality',
            'Resistance to simplifications'
          ],
          advice: [
            'Seek common ground in differences',
            'Develop patience with complexity',
            'Help others see unity',
            'Trust the synthesis process'
          ]
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[cross] || {
      title: cross,
      subtitle: '',
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      characteristics: [],
      mission: [],
      strengths: [],
      challenges: [],
      advice: []
    }
  }

  const current = getCrossDescription(currentCross)

  return (
    <div className="min-h-screen bg-space-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="cosmic-card mb-6">
          <h3 className="cosmic-subtitle text-xl mb-4 text-purple-400">{language === 'ru' ? 'Жизненная миссия' : 'Life Mission'}</h3>
          <ul className="list-disc list-inside text-cosmic-300 space-y-2">
            {current.mission.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="cosmic-card">
            <h3 className="cosmic-subtitle text-xl mb-4 text-green-400">{language === 'ru' ? 'Сильные стороны' : 'Strengths'}</h3>
            <ul className="list-disc list-inside text-cosmic-300 space-y-2">
              {current.strengths.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="cosmic-card">
            <h3 className="cosmic-subtitle text-xl mb-4 text-orange-400">{language === 'ru' ? 'Вызовы' : 'Challenges'}</h3>
            <ul className="list-disc list-inside text-cosmic-300 space-y-2">
              {current.challenges.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="cosmic-card">
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
