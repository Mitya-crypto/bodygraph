'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumanDesignCentersPage() {
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

  const getCenterDescription = (centerName: string) => {
    const descriptions = {
      ru: {
        'Head': {
          name: 'Центр Головы',
          description: 'Центр вдохновения и ментального давления. Отвечает за вопросы, вдохновение и ментальное давление.',
          characteristics: [
            'Ментальное давление',
            'Вдохновение и идеи',
            'Поиск ответов',
            'Творческое мышление'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная ментальная энергия. Вы можете генерировать вдохновение и идеи.',
            strengths: [
              'Стабильное вдохновение',
              'Способность генерировать идеи',
              'Ментальная стабильность',
              'Творческое мышление'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к ментальному давлению других. Можете впитывать вдохновение от окружающих.',
            strengths: [
              'Чувствительность к идеям',
              'Способность впитывать вдохновение',
              'Гибкость мышления',
              'Адаптивность'
            ]
          }
        },
        'Ajna': {
          name: 'Центр Аджаны',
          description: 'Центр осознания и ментальной определенности. Отвечает за способность к анализу и пониманию.',
          characteristics: [
            'Ментальная определенность',
            'Способность к анализу',
            'Понимание паттернов',
            'Ментальная ясность'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная ментальная определенность. Вы можете анализировать и понимать.',
            strengths: [
              'Стабильная ментальная ясность',
              'Способность к анализу',
              'Ментальная определенность',
              'Понимание паттернов'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к ментальной определенности других. Можете впитывать понимание от окружающих.',
            strengths: [
              'Чувствительность к пониманию',
              'Способность впитывать знания',
              'Гибкость мышления',
              'Адаптивность'
            ]
          }
        },
        'Throat': {
          name: 'Центр Горла',
          description: 'Центр самовыражения и действия. Отвечает за способность к общению и проявлению.',
          characteristics: [
            'Самовыражение',
            'Коммуникация',
            'Проявление идей',
            'Действие'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная способность к самовыражению. Вы можете эффективно общаться.',
            strengths: [
              'Стабильное самовыражение',
              'Эффективная коммуникация',
              'Способность к проявлению',
              'Уверенность в общении'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к самовыражению других. Можете впитывать способы общения от окружающих.',
            strengths: [
              'Чувствительность к общению',
              'Способность впитывать стили общения',
              'Гибкость в самовыражении',
              'Адаптивность'
            ]
          }
        },
        'G-Center': {
          name: 'G-Центр',
          description: 'Центр любви, направления и идентичности. Отвечает за чувство направления и любовь.',
          characteristics: [
            'Любовь и направление',
            'Идентичность',
            'Чувство направления',
            'Связь с высшим'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная идентичность и чувство направления. Вы знаете, кто вы есть.',
            strengths: [
              'Стабильная идентичность',
              'Четкое чувство направления',
              'Способность любить',
              'Связь с высшим'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к идентичности и направлению других. Можете впитывать любовь от окружающих.',
            strengths: [
              'Чувствительность к любви',
              'Способность впитывать направление',
              'Гибкость в идентичности',
              'Адаптивность'
            ]
          }
        },
        'Heart': {
          name: 'Центр Сердца',
          description: 'Центр воли и эго. Отвечает за способность к воле и самооценке.',
          characteristics: [
            'Воля и эго',
            'Самооценка',
            'Способность к воле',
            'Лидерство'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная воля и эго. Вы можете проявлять волю и лидерство.',
            strengths: [
              'Стабильная воля',
              'Сильное эго',
              'Способность к лидерству',
              'Уверенность в себе'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к воле и эго других. Можете впитывать силу от окружающих.',
            strengths: [
              'Чувствительность к силе',
              'Способность впитывать волю',
              'Гибкость в лидерстве',
              'Адаптивность'
            ]
          }
        },
        'Solar Plexus': {
          name: 'Центр Солнечного Сплетения',
          description: 'Центр эмоций и чувств. Отвечает за эмоциональную жизнь и чувства.',
          characteristics: [
            'Эмоции и чувства',
            'Эмоциональная жизнь',
            'Чувствительность',
            'Эмоциональная глубина'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная эмоциональная жизнь. Вы можете глубоко чувствовать.',
            strengths: [
              'Стабильные эмоции',
              'Глубокие чувства',
              'Эмоциональная стабильность',
              'Способность к эмпатии'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к эмоциям других. Можете впитывать эмоции от окружающих.',
            strengths: [
              'Чувствительность к эмоциям',
              'Способность впитывать чувства',
              'Эмоциональная гибкость',
              'Адаптивность'
            ]
          }
        },
        'Sacral': {
          name: 'Сакральный Центр',
          description: 'Центр жизненной силы и сексуальности. Отвечает за жизненную энергию и творчество.',
          characteristics: [
            'Жизненная сила',
            'Сексуальность',
            'Творчество',
            'Энергия'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная жизненная сила. Вы можете генерировать энергию.',
            strengths: [
              'Стабильная жизненная сила',
              'Способность генерировать энергию',
              'Творческая сила',
              'Сексуальная энергия'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к жизненной силе других. Можете впитывать энергию от окружающих.',
            strengths: [
              'Чувствительность к энергии',
              'Способность впитывать жизненную силу',
              'Энергетическая гибкость',
              'Адаптивность'
            ]
          }
        },
        'Root': {
          name: 'Центр Корня',
          description: 'Центр адреналина и стресса. Отвечает за способность справляться со стрессом.',
          characteristics: [
            'Адреналин и стресс',
            'Способность к стрессу',
            'Энергия для действия',
            'Стрессоустойчивость'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильная способность справляться со стрессом. Вы можете генерировать адреналин.',
            strengths: [
              'Стабильная стрессоустойчивость',
              'Способность генерировать адреналин',
              'Энергия для действия',
              'Способность к стрессу'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к стрессу других. Можете впитывать стресс от окружающих.',
            strengths: [
              'Чувствительность к стрессу',
              'Способность впитывать адреналин',
              'Стрессовая гибкость',
              'Адаптивность'
            ]
          }
        },
        'Spleen': {
          name: 'Центр Селезенки',
          description: 'Центр инстинктов и выживания. Отвечает за инстинкты и здоровье.',
          characteristics: [
            'Инстинкты и выживание',
            'Здоровье',
            'Интуиция',
            'Способность к выживанию'
          ],
          defined: {
            title: 'Определенный центр',
            description: 'У вас стабильные инстинкты. Вы можете полагаться на свою интуицию.',
            strengths: [
              'Стабильные инстинкты',
              'Надежная интуиция',
              'Способность к выживанию',
              'Здоровые инстинкты'
            ]
          },
          undefined: {
            title: 'Неопределенный центр',
            description: 'Вы чувствительны к инстинктам других. Можете впитывать интуицию от окружающих.',
            strengths: [
              'Чувствительность к инстинктам',
              'Способность впитывать интуицию',
              'Инстинктивная гибкость',
              'Адаптивность'
            ]
          }
        }
      },
      en: {
        'Head': {
          name: 'Head Center',
          description: 'Center of inspiration and mental pressure. Responsible for questions, inspiration and mental pressure.',
          characteristics: [
            'Mental pressure',
            'Inspiration and ideas',
            'Seeking answers',
            'Creative thinking'
          ],
          defined: {
            title: 'Defined center',
            description: 'You have stable mental energy. You can generate inspiration and ideas.',
            strengths: [
              'Stable inspiration',
              'Ability to generate ideas',
              'Mental stability',
              'Creative thinking'
            ]
          },
          undefined: {
            title: 'Undefined center',
            description: 'You are sensitive to others\' mental pressure. You can absorb inspiration from others.',
            strengths: [
              'Sensitivity to ideas',
              'Ability to absorb inspiration',
              'Mental flexibility',
              'Adaptability'
            ]
          }
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[centerName] || {
      name: centerName,
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      characteristics: [],
      defined: { title: '', description: '', strengths: [] },
      undefined: { title: '', description: '', strengths: [] }
    }
  }

  return (
    <div className="min-h-screen bg-space-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
          <h1 className="text-4xl font-bold text-cosmic-100 mb-2">
            {language === 'ru' ? 'Центры Human Design' : 'Human Design Centers'}
          </h1>
          <p className="text-cosmic-300 text-xl">
            {language === 'ru' ? 'Ваши энергетические центры' : 'Your energy centers'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cosmic-card mb-6">
          <h2 className="cosmic-subtitle text-2xl mb-4">
            {language === 'ru' ? 'Описание центров' : 'Centers Description'}
          </h2>
          <p className="text-cosmic-300 leading-relaxed">
            {language === 'ru' 
              ? 'Центры Human Design представляют собой энергетические центры в вашем теле. Определенные центры дают вам стабильную энергию, а неопределенные центры делают вас чувствительными к энергии других людей.'
              : 'Human Design centers are energy centers in your body. Defined centers give you stable energy, while undefined centers make you sensitive to others\' energy.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {humanDesignData.centers.map((center, index) => {
            const centerInfo = getCenterDescription(center.name)
            const isDefined = center.defined
            return (
              <motion.div
                key={center.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="cosmic-card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-cosmic-400" />
                  <h3 className="cosmic-subtitle text-lg">
                    {language === 'ru' ? getCenterNameRu(center.name) : center.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDefined 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-blue-900/20 text-blue-400'
                  }`}>
                    {isDefined 
                      ? (language === 'ru' ? 'Определен' : 'Defined')
                      : (language === 'ru' ? 'Неопределен' : 'Undefined')
                    }
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="font-semibold text-cosmic-300 mb-1">{centerInfo.name}</div>
                  <p className="text-sm text-cosmic-300">{centerInfo.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      {language === 'ru' ? 'Характеристики' : 'Characteristics'}
                    </h4>
                    <ul className="text-xs text-cosmic-300 space-y-1">
                      {centerInfo.characteristics.slice(0, 2).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDefined ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {isDefined ? centerInfo.defined.title : centerInfo.undefined.title}
                    </h4>
                    <p className="text-xs text-cosmic-300 mb-2">
                      {isDefined ? centerInfo.defined.description : centerInfo.undefined.description}
                    </p>
                    <ul className="text-xs text-cosmic-300 space-y-1">
                      {(isDefined ? centerInfo.defined.strengths : centerInfo.undefined.strengths).slice(0, 2).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`mt-1 ${isDefined ? 'text-green-400' : 'text-blue-400'}`}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
