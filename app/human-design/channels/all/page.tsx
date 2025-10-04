'use client'

import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignCalculator'
import { motion } from 'framer-motion'
import { ArrowLeft, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumanDesignChannelsAllPage() {
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

  const getChannelDescription = (channel: string) => {
    const descriptions = {
      ru: {
        '1-8': {
          name: 'Канал Вдохновения',
          englishName: 'Inspiration',
          description: 'Канал вдохновения и творчества, соединяющий ворота 1 (Творчество) и 8 (Вклад). Это канал индивидуального творческого выражения и вдохновения.',
          characteristics: [
            'Творческое самовыражение',
            'Вдохновение и мотивация',
            'Индивидуальный подход',
            'Способность к инновациям'
          ],
          strengths: [
            'Уникальное творческое видение',
            'Способность вдохновлять других',
            'Инновационное мышление',
            'Индивидуальный стиль'
          ],
          challenges: [
            'Может быть слишком индивидуалистичным',
            'Сложности с командной работой',
            'Потребность в признании',
            'Сопротивление стандартам'
          ],
          advice: [
            'Развивайте свой уникальный стиль',
            'Ищите способы вдохновлять других',
            'Не бойтесь быть непохожим',
            'Используйте творчество для решения проблем'
          ]
        },
        '2-14': {
          name: 'Канал Креативности',
          englishName: 'Keeper of the Keys',
          description: 'Канал креативности и управления ресурсами, соединяющий ворота 2 (Направление) и 14 (Мощь). Это канал управления энергией и ресурсами.',
          characteristics: [
            'Управление ресурсами',
            'Креативное решение проблем',
            'Способность к адаптации',
            'Лидерские качества'
          ],
          strengths: [
            'Эффективное управление',
            'Креативные решения',
            'Способность к адаптации',
            'Лидерские качества'
          ],
          challenges: [
            'Может быть слишком контролирующим',
            'Сложности с делегированием',
            'Потребность в контроле',
            'Сопротивление изменениям'
          ],
          advice: [
            'Развивайте навыки управления',
            'Учитесь делегировать',
            'Используйте креативность в решении проблем',
            'Балансируйте контроль и свободу'
          ]
        },
        '3-60': {
          name: 'Канал Мутации',
          englishName: 'Mutation',
          description: 'Канал мутации и изменений, соединяющий ворота 3 (Начало) и 60 (Ограничение). Это канал эволюции и адаптации.',
          characteristics: [
            'Способность к изменениям',
            'Эволюционное развитие',
            'Адаптивность',
            'Трансформация'
          ],
          strengths: [
            'Гибкость в изменениях',
            'Способность к эволюции',
            'Адаптивность',
            'Трансформационные способности'
          ],
          challenges: [
            'Может быть нестабильным',
            'Сложности с постоянством',
            'Потребность в изменениях',
            'Сопротивление стабильности'
          ],
          advice: [
            'Принимайте изменения как естественный процесс',
            'Развивайте стабильность внутри',
            'Используйте мутацию для роста',
            'Балансируйте изменения и постоянство'
          ]
        }
      },
      en: {
        '1-8': {
          name: 'Channel of Inspiration',
          englishName: 'Inspiration',
          description: 'Channel of inspiration and creativity, connecting gates 1 (Creativity) and 8 (Contribution). This is a channel of individual creative expression and inspiration.',
          characteristics: [
            'Creative self-expression',
            'Inspiration and motivation',
            'Individual approach',
            'Ability to innovate'
          ],
          strengths: [
            'Unique creative vision',
            'Ability to inspire others',
            'Innovative thinking',
            'Individual style'
          ],
          challenges: [
            'May be too individualistic',
            'Difficulties with teamwork',
            'Need for recognition',
            'Resistance to standards'
          ],
          advice: [
            'Develop your unique style',
            'Find ways to inspire others',
            'Don\'t be afraid to be different',
            'Use creativity to solve problems'
          ]
        },
        '2-14': {
          name: 'Channel of Creativity',
          englishName: 'Keeper of the Keys',
          description: 'Channel of creativity and resource management, connecting gates 2 (Direction) and 14 (Power). This is a channel of energy and resource management.',
          characteristics: [
            'Resource management',
            'Creative problem solving',
            'Adaptability',
            'Leadership qualities'
          ],
          strengths: [
            'Effective management',
            'Creative solutions',
            'Adaptability',
            'Leadership qualities'
          ],
          challenges: [
            'May be too controlling',
            'Difficulties with delegation',
            'Need for control',
            'Resistance to change'
          ],
          advice: [
            'Develop management skills',
            'Learn to delegate',
            'Use creativity in problem solving',
            'Balance control and freedom'
          ]
        },
        '3-60': {
          name: 'Channel of Mutation',
          englishName: 'Mutation',
          description: 'Channel of mutation and change, connecting gates 3 (Beginning) and 60 (Limitation). This is a channel of evolution and adaptation.',
          characteristics: [
            'Ability to change',
            'Evolutionary development',
            'Adaptability',
            'Transformation'
          ],
          strengths: [
            'Flexibility in change',
            'Ability to evolve',
            'Adaptability',
            'Transformational abilities'
          ],
          challenges: [
            'May be unstable',
            'Difficulties with constancy',
            'Need for change',
            'Resistance to stability'
          ],
          advice: [
            'Accept change as natural process',
            'Develop inner stability',
            'Use mutation for growth',
            'Balance change and constancy'
          ]
        }
      }
    }
    const dict = descriptions[language as 'ru' | 'en'] as any
    return dict[channel] || {
      name: channel,
      englishName: channel,
      description: language === 'ru' ? 'Описание не найдено.' : 'Description not found.',
      characteristics: [],
      strengths: [],
      challenges: [],
      advice: []
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
            {language === 'ru' ? 'Активированные каналы' : 'Activated Channels'}
          </h1>
          <p className="text-cosmic-300 text-xl">
            {language === 'ru' ? 'Ваши энергетические каналы Human Design' : 'Your Human Design energy channels'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cosmic-card mb-6">
          <h2 className="cosmic-subtitle text-2xl mb-4">
            {language === 'ru' ? 'Описание каналов' : 'Channel Description'}
          </h2>
          <p className="text-cosmic-300 leading-relaxed">
            {language === 'ru' 
              ? 'Каналы Human Design представляют собой соединения между двумя центрами, которые создают стабильную энергию. Каждый канал имеет свои уникальные характеристики и влияет на то, как вы взаимодействуете с миром.'
              : 'Human Design channels are connections between two centers that create stable energy. Each channel has its unique characteristics and influences how you interact with the world.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {humanDesignData.channels && humanDesignData.channels.length > 0 ? (
            humanDesignData.channels.map((channel, index) => {
              const channelInfo = getChannelDescription(channel.number)
              return (
                <motion.div
                  key={channel.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="cosmic-card"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-cosmic-400" />
                    <h3 className="cosmic-subtitle text-lg">{channel.number}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-semibold text-cosmic-300 mb-1">{channelInfo.name}</div>
                    <div className="text-cosmic-400 font-medium text-sm">{channelInfo.englishName}</div>
                  </div>

                  <p className="text-sm text-cosmic-300 mb-4">{channelInfo.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">
                        {language === 'ru' ? 'Характеристики' : 'Characteristics'}
                      </h4>
                      <ul className="text-xs text-cosmic-300 space-y-1">
                        {channelInfo.characteristics.slice(0, 2).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">
                        {language === 'ru' ? 'Сильные стороны' : 'Strengths'}
                      </h4>
                      <ul className="text-xs text-cosmic-300 space-y-1">
                        {channelInfo.strengths.slice(0, 2).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="cosmic-card text-center col-span-full">
              <p className="text-cosmic-300">
                {language === 'ru' ? 'У вас нет активированных каналов.' : 'You have no activated channels.'}
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  )
}
