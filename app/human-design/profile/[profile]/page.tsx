'use client'

import { use as usePromise } from 'react'
import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: Promise<{ profile: string }>
}

export default function HumanDesignProfilePage({ params }: PageProps) {
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
  const slug = decodeURIComponent(resolvedParams?.profile || '').toLowerCase()

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

  const slugToProfile: Record<string, string> = {
    '1-3': '1/3',
    '1-4': '1/4',
    '2-4': '2/4',
    '2-5': '2/5',
    '3-5': '3/5',
    '3-6': '3/6',
    '4-6': '4/6',
    '4-1': '4/1',
    '5-1': '5/1',
    '5-2': '5/2',
    '6-2': '6/2',
    '6-3': '6/3'
  }

  const currentProfile = slugToProfile[slug] || humanDesignData.profile

  const getProfileDescription = (profile: string) => {
    const descriptions = {
      ru: {
        '1/3': {
          title: 'Профиль 1/3',
          subtitle: 'Исследователь-Мученик',
          description: 'Вы здесь, чтобы исследовать жизнь через собственный опыт. Ваша роль — быть первопроходцем, который пробует и учится на ошибках. Через испытания вы обретаете мудрость и становитесь примером для других.',
          characteristics: [
            'Естественная потребность исследовать и экспериментировать',
            'Учитесь через собственные ошибки и опыт',
            'Склонность к самокритике и сомнениям',
            'Способность трансформировать неудачи в мудрость'
          ],
          lifePath: 'Исследование → Ошибки → Мудрость → Наставничество',
          advice: [
            'Не бойтесь ошибаться — это ваш путь обучения',
            'Делитесь своим опытом с другими',
            'Принимайте неудачи как часть процесса',
            'Используйте свою мудрость для помощи другим'
          ]
        },
        '1/4': {
          title: 'Профиль 1/4',
          subtitle: 'Исследователь-Оппортунист',
          description: 'Вы исследуете жизнь через глубокое изучение, а затем делитесь знаниями с близким кругом. Ваша сила в способности находить правильных людей и создавать прочные связи.',
          characteristics: [
            'Глубокое изучение тем перед действием',
            'Создание прочных связей с людьми',
            'Способность находить правильных союзников',
            'Роль моста между знанием и практикой'
          ],
          lifePath: 'Исследование → Связи → Применение → Влияние',
          advice: [
            'Инвестируйте в качественные отношения',
            'Делитесь знаниями с близким кругом',
            'Будьте избирательны в выборе людей',
            'Используйте свои связи для роста'
          ]
        },
        '2/4': {
          title: 'Профиль 2/4',
          subtitle: 'Отшельник-Оппортунист',
          description: 'Вы обладаете естественными талантами, которые проявляются, когда вас приглашают. Ваша роль — быть готовым к приглашениям, сохраняя при этом свою аутентичность.',
          characteristics: [
            'Естественные таланты и способности',
            'Потребность в уединении для развития',
            'Способность к глубокой работе',
            'Важность правильных приглашений'
          ],
          lifePath: 'Уединение → Развитие → Приглашение → Проявление',
          advice: [
            'Не навязывайте свои таланты',
            'Ждите правильных приглашений',
            'Используйте время уединения для развития',
            'Доверяйте своим естественным способностям'
          ]
        },
        '2/5': {
          title: 'Профиль 2/5',
          subtitle: 'Отшельник-Еретик',
          description: 'Вы обладаете уникальными способностями, которые могут трансформировать общество. Ваша роль — развивать таланты в уединении, а затем делиться ими с миром.',
          characteristics: [
            'Уникальные способности и таланты',
            'Потребность в уединении для развития',
            'Способность влиять на массы',
            'Роль трансформатора общества'
          ],
          lifePath: 'Уединение → Развитие → Трансформация → Влияние',
          advice: [
            'Развивайте таланты в уединении',
            'Будьте готовы к критике',
            'Используйте влияние мудро',
            'Доверяйте своему уникальному пути'
          ]
        },
        '3/5': {
          title: 'Профиль 3/5',
          subtitle: 'Мученик-Еретик',
          description: 'Вы учитесь через опыт и ошибки, а затем делитесь мудростью с миром. Ваша роль — быть примером трансформации и вдохновлять других на изменения.',
          characteristics: [
            'Обучение через опыт и ошибки',
            'Способность влиять на массы',
            'Роль примера и вдохновителя',
            'Трансформация неудач в мудрость'
          ],
          lifePath: 'Опыт → Ошибки → Мудрость → Влияние',
          advice: [
            'Принимайте ошибки как часть обучения',
            'Делитесь опытом с другими',
            'Используйте влияние для позитивных изменений',
            'Будьте примером трансформации'
          ]
        },
        '3/6': {
          title: 'Профиль 3/6',
          subtitle: 'Мученик-Роль Модели',
          description: 'Вы проходите через фазы жизни: сначала активное исследование и ошибки, затем роль мудрого наставника. Ваша роль — показать другим, как трансформировать опыт в мудрость.',
          characteristics: [
            'Трехфазная структура жизни',
            'Обучение через опыт в первой фазе',
            'Роль мудрого наставника во второй фазе',
            'Способность видеть общую картину'
          ],
          lifePath: 'Исследование → Ошибки → Мудрость → Наставничество',
          advice: [
            'Принимайте разные фазы жизни',
            'Используйте опыт для мудрости',
            'Делитесь знаниями с другими',
            'Доверяйте процессу трансформации'
          ]
        },
        '4/6': {
          title: 'Профиль 4/6',
          subtitle: 'Оппортунист-Роль Модели',
          description: 'Вы создаете связи и влияете на других через отношения. Ваша роль — быть мостом между людьми и показывать пример правильного поведения.',
          characteristics: [
            'Создание прочных связей',
            'Влияние через отношения',
            'Роль примера для других',
            'Способность объединять людей'
          ],
          lifePath: 'Связи → Влияние → Пример → Объединение',
          advice: [
            'Инвестируйте в качественные отношения',
            'Будьте примером для других',
            'Используйте связи для позитивного влияния',
            'Объединяйте людей вокруг общих целей'
          ]
        },
        '4/1': {
          title: 'Профиль 4/1',
          subtitle: 'Оппортунист-Исследователь',
          description: 'Вы создаете связи и делитесь знаниями с близким кругом. Ваша роль — быть мостом между глубоким знанием и практическим применением.',
          characteristics: [
            'Создание прочных связей',
            'Глубокое изучение тем',
            'Роль моста между знанием и практикой',
            'Влияние через близкие отношения'
          ],
          lifePath: 'Исследование → Связи → Применение → Влияние',
          advice: [
            'Развивайте близкие отношения',
            'Делитесь знаниями с доверенным кругом',
            'Будьте мостом между теорией и практикой',
            'Используйте связи для роста'
          ]
        },
        '5/1': {
          title: 'Профиль 5/1',
          subtitle: 'Еретик-Исследователь',
          description: 'Вы исследуете решения проблем и делитесь ими с миром. Ваша роль — находить практические решения и влиять на массы через свои открытия.',
          characteristics: [
            'Поиск практических решений',
            'Влияние на массы',
            'Роль спасителя и реформатора',
            'Способность трансформировать общество'
          ],
          lifePath: 'Исследование → Решения → Влияние → Трансформация',
          advice: [
            'Фокусируйтесь на практических решениях',
            'Будьте готовы к критике',
            'Используйте влияние для позитивных изменений',
            'Доверяйте своей способности решать проблемы'
          ]
        },
        '5/2': {
          title: 'Профиль 5/2',
          subtitle: 'Еретик-Отшельник',
          description: 'Вы обладаете уникальными способностями, которые проявляются, когда вас приглашают решить проблемы. Ваша роль — быть готовым к приглашениям и использовать таланты для помощи.',
          characteristics: [
            'Уникальные способности',
            'Потребность в приглашениях',
            'Роль спасителя и помощника',
            'Способность влиять на массы'
          ],
          lifePath: 'Уединение → Приглашение → Помощь → Влияние',
          advice: [
            'Ждите правильных приглашений',
            'Не навязывайте свои решения',
            'Используйте таланты для помощи другим',
            'Доверяйте своей способности решать проблемы'
          ]
        },
        '6/2': {
          title: 'Профиль 6/2',
          subtitle: 'Роль Модели-Отшельник',
          description: 'Вы проходите через фазы жизни: сначала роль примера, затем уединение для развития. Ваша роль — показать другим правильный путь через собственный пример.',
          characteristics: [
            'Роль примера для других',
            'Потребность в уединении',
            'Трехфазная структура жизни',
            'Способность видеть общую картину'
          ],
          lifePath: 'Пример → Уединение → Мудрость → Наставничество',
          advice: [
            'Будьте примером для других',
            'Используйте время уединения для развития',
            'Делитесь мудростью с миром',
            'Доверяйте процессу трансформации'
          ]
        },
        '6/3': {
          title: 'Профиль 6/3',
          subtitle: 'Роль Модели-Мученик',
          description: 'Вы проходите через фазы жизни: сначала активное исследование и ошибки, затем роль мудрого наставника. Ваша роль — показать другим, как трансформировать опыт в мудрость.',
          characteristics: [
            'Трехфазная структура жизни',
            'Обучение через опыт',
            'Роль мудрого наставника',
            'Способность влиять на массы'
          ],
          lifePath: 'Исследование → Ошибки → Мудрость → Наставничество',
          advice: [
            'Принимайте разные фазы жизни',
            'Используйте опыт для мудрости',
            'Делитесь знаниями с миром',
            'Будьте примером трансформации'
          ]
        }
      },
      en: {
        '1/3': {
          title: 'Profile 1/3',
          subtitle: 'Investigator-Martyr',
          description: 'You are here to explore life through your own experience. Your role is to be a pioneer who tries and learns from mistakes. Through trials, you gain wisdom and become an example for others.',
          characteristics: [
            'Natural need to explore and experiment',
            'Learn through your own mistakes and experience',
            'Tendency toward self-criticism and doubt',
            'Ability to transform failures into wisdom'
          ],
          lifePath: 'Exploration → Mistakes → Wisdom → Mentoring',
          advice: [
            'Don\'t be afraid to make mistakes — it\'s your learning path',
            'Share your experience with others',
            'Accept failures as part of the process',
            'Use your wisdom to help others'
          ]
        },
        '1/4': {
          title: 'Profile 1/4',
          subtitle: 'Investigator-Opportunist',
          description: 'You explore life through deep study, then share knowledge with your close circle. Your strength is in finding the right people and creating lasting connections.',
          characteristics: [
            'Deep study of topics before action',
            'Creating lasting connections with people',
            'Ability to find the right allies',
            'Role as a bridge between knowledge and practice'
          ],
          lifePath: 'Investigation → Connections → Application → Influence',
          advice: [
            'Invest in quality relationships',
            'Share knowledge with your close circle',
            'Be selective in choosing people',
            'Use your connections for growth'
          ]
        },
        '2/4': {
          title: 'Profile 2/4',
          subtitle: 'Hermit-Opportunist',
          description: 'You have natural talents that manifest when you are invited. Your role is to be ready for invitations while maintaining your authenticity.',
          characteristics: [
            'Natural talents and abilities',
            'Need for solitude for development',
            'Ability for deep work',
            'Importance of right invitations'
          ],
          lifePath: 'Solitude → Development → Invitation → Manifestation',
          advice: [
            'Don\'t impose your talents',
            'Wait for the right invitations',
            'Use solitude time for development',
            'Trust your natural abilities'
          ]
        },
        '2/5': {
          title: 'Profile 2/5',
          subtitle: 'Hermit-Heretic',
          description: 'You have unique abilities that can transform society. Your role is to develop talents in solitude, then share them with the world.',
          characteristics: [
            'Unique abilities and talents',
            'Need for solitude for development',
            'Ability to influence masses',
            'Role as a transformer of society'
          ],
          lifePath: 'Solitude → Development → Transformation → Influence',
          advice: [
            'Develop talents in solitude',
            'Be ready for criticism',
            'Use influence wisely',
            'Trust your unique path'
          ]
        },
        '3/5': {
          title: 'Profile 3/5',
          subtitle: 'Martyr-Heretic',
          description: 'You learn through experience and mistakes, then share wisdom with the world. Your role is to be an example of transformation and inspire others to change.',
          characteristics: [
            'Learning through experience and mistakes',
            'Ability to influence masses',
            'Role as an example and inspirer',
            'Transformation of failures into wisdom'
          ],
          lifePath: 'Experience → Mistakes → Wisdom → Influence',
          advice: [
            'Accept mistakes as part of learning',
            'Share experience with others',
            'Use influence for positive change',
            'Be an example of transformation'
          ]
        },
        '3/6': {
          title: 'Profile 3/6',
          subtitle: 'Martyr-Role Model',
          description: 'You go through life phases: first active exploration and mistakes, then the role of a wise mentor. Your role is to show others how to transform experience into wisdom.',
          characteristics: [
            'Three-phase life structure',
            'Learning through experience in first phase',
            'Role as a wise mentor in second phase',
            'Ability to see the big picture'
          ],
          lifePath: 'Exploration → Mistakes → Wisdom → Mentoring',
          advice: [
            'Accept different life phases',
            'Use experience for wisdom',
            'Share knowledge with others',
            'Trust the transformation process'
          ]
        },
        '4/6': {
          title: 'Profile 4/6',
          subtitle: 'Opportunist-Role Model',
          description: 'You create connections and influence others through relationships. Your role is to be a bridge between people and show an example of right behavior.',
          characteristics: [
            'Creating lasting connections',
            'Influence through relationships',
            'Role as an example for others',
            'Ability to unite people'
          ],
          lifePath: 'Connections → Influence → Example → Unification',
          advice: [
            'Invest in quality relationships',
            'Be an example for others',
            'Use connections for positive influence',
            'Unite people around common goals'
          ]
        },
        '4/1': {
          title: 'Profile 4/1',
          subtitle: 'Opportunist-Investigator',
          description: 'You create connections and share knowledge with your close circle. Your role is to be a bridge between deep knowledge and practical application.',
          characteristics: [
            'Creating lasting connections',
            'Deep study of topics',
            'Role as a bridge between knowledge and practice',
            'Influence through close relationships'
          ],
          lifePath: 'Investigation → Connections → Application → Influence',
          advice: [
            'Develop close relationships',
            'Share knowledge with trusted circle',
            'Be a bridge between theory and practice',
            'Use connections for growth'
          ]
        },
        '5/1': {
          title: 'Profile 5/1',
          subtitle: 'Heretic-Investigator',
          description: 'You investigate solutions to problems and share them with the world. Your role is to find practical solutions and influence masses through your discoveries.',
          characteristics: [
            'Search for practical solutions',
            'Influence on masses',
            'Role as a savior and reformer',
            'Ability to transform society'
          ],
          lifePath: 'Investigation → Solutions → Influence → Transformation',
          advice: [
            'Focus on practical solutions',
            'Be ready for criticism',
            'Use influence for positive change',
            'Trust your ability to solve problems'
          ]
        },
        '5/2': {
          title: 'Profile 5/2',
          subtitle: 'Heretic-Hermit',
          description: 'You have unique abilities that manifest when you are invited to solve problems. Your role is to be ready for invitations and use talents to help.',
          characteristics: [
            'Unique abilities',
            'Need for invitations',
            'Role as a savior and helper',
            'Ability to influence masses'
          ],
          lifePath: 'Solitude → Invitation → Help → Influence',
          advice: [
            'Wait for the right invitations',
            'Don\'t impose your solutions',
            'Use talents to help others',
            'Trust your ability to solve problems'
          ]
        },
        '6/2': {
          title: 'Profile 6/2',
          subtitle: 'Role Model-Hermit',
          description: 'You go through life phases: first the role of an example, then solitude for development. Your role is to show others the right path through your own example.',
          characteristics: [
            'Role as an example for others',
            'Need for solitude',
            'Three-phase life structure',
            'Ability to see the big picture'
          ],
          lifePath: 'Example → Solitude → Wisdom → Mentoring',
          advice: [
            'Be an example for others',
            'Use solitude time for development',
            'Share wisdom with the world',
            'Trust the transformation process'
          ]
        },
        '6/3': {
          title: 'Profile 6/3',
          subtitle: 'Role Model-Martyr',
          description: 'You go through life phases: first active exploration and mistakes, then the role of a wise mentor. Your role is to show others how to transform experience into wisdom.',
          characteristics: [
            'Three-phase life structure',
            'Learning through experience',
            'Role as a wise mentor',
            'Ability to influence masses'
          ],
          lifePath: 'Exploration → Mistakes → Wisdom → Mentoring',
          advice: [
            'Accept different life phases',
            'Use experience for wisdom',
            'Share knowledge with the world',
            'Be an example of transformation'
          ]
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[profile] || {
      title: profile,
      subtitle: '',
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      characteristics: [],
      lifePath: '',
      advice: []
    }
  }

  const current = getProfileDescription(currentProfile)

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="cosmic-card mb-6">
          <h3 className="cosmic-subtitle text-xl mb-4">{language === 'ru' ? 'Жизненный путь' : 'Life Path'}</h3>
          <p className="text-cosmic-400 text-lg font-semibold">{current.lifePath}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="cosmic-card">
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
