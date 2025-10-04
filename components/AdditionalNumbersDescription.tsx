// components/AdditionalNumbersDescription.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Sun, Moon, Star } from 'lucide-react'

interface AdditionalNumbersDescriptionProps {
  number: number
  type: 'day' | 'month' | 'year'
  language: 'en' | 'ru'
  onClose: () => void
}

export function AdditionalNumbersDescription({ number, type, language, onClose }: AdditionalNumbersDescriptionProps) {
  console.log('🔄 AdditionalNumbersDescription rendered with number:', number, 'type:', type)
  
  const getNumberDescription = (num: number, numType: 'day' | 'month' | 'year') => {
    const descriptions = {
      ru: {
        day: {
          1: 'День лидерства - вы прирожденный лидер с сильной волей',
          2: 'День сотрудничества - вы умеете работать в команде и создавать гармонию',
          3: 'День творчества - вы обладаете ярким творческим потенциалом',
          4: 'День стабильности - вы цените порядок и надежность',
          5: 'День свободы - вы стремитесь к разнообразию и новым впечатлениям',
          6: 'День заботы - вы естественно заботитесь о других',
          7: 'День мудрости - вы стремитесь к пониманию тайн жизни',
          8: 'День власти - вы обладаете сильной волей к достижению целей',
          9: 'День служения - вы стремитесь помогать другим и служить человечеству'
        },
        month: {
          1: 'Месяц новых начинаний - вы любите начинать новые проекты',
          2: 'Месяц партнерства - вы цените близкие отношения',
          3: 'Месяц самовыражения - вы любите творчество и общение',
          4: 'Месяц стабильности - вы цените надежность и порядок',
          5: 'Месяц перемен - вы любите разнообразие и новые впечатления',
          6: 'Месяц заботы - вы естественно заботитесь о близких',
          7: 'Месяц размышлений - вы любите уединение и размышления',
          8: 'Месяц достижений - вы стремитесь к материальному успеху',
          9: 'Месяц завершений - вы любите завершать начатое'
        },
        year: {
          1: 'Год новых начинаний - время для старта новых проектов',
          2: 'Год сотрудничества - время для работы в команде',
          3: 'Год творчества - время для самовыражения и искусства',
          4: 'Год стабильности - время для создания прочного фундамента',
          5: 'Год перемен - время для изменений и новых впечатлений',
          6: 'Год заботы - время для семьи и близких отношений',
          7: 'Год размышлений - время для духовного роста',
          8: 'Год достижений - время для материального успеха',
          9: 'Год завершений - время для завершения циклов'
        }
      },
      en: {
        day: {
          1: 'Leadership day - you are a natural-born leader with strong will',
          2: 'Cooperation day - you know how to work in teams and create harmony',
          3: 'Creativity day - you have a bright creative potential',
          4: 'Stability day - you value order and reliability',
          5: 'Freedom day - you strive for diversity and new experiences',
          6: 'Care day - you naturally care for others',
          7: 'Wisdom day - you strive to understand life\'s mysteries',
          8: 'Power day - you have a strong will to achieve goals',
          9: 'Service day - you strive to help others and serve humanity'
        },
        month: {
          1: 'New beginnings month - you love starting new projects',
          2: 'Partnership month - you value close relationships',
          3: 'Self-expression month - you love creativity and communication',
          4: 'Stability month - you value reliability and order',
          5: 'Change month - you love diversity and new experiences',
          6: 'Care month - you naturally care for loved ones',
          7: 'Reflection month - you love solitude and reflection',
          8: 'Achievement month - you strive for material success',
          9: 'Completion month - you love completing what you started'
        },
        year: {
          1: 'New beginnings year - time to start new projects',
          2: 'Cooperation year - time to work in teams',
          3: 'Creativity year - time for self-expression and art',
          4: 'Stability year - time to create a solid foundation',
          5: 'Change year - time for changes and new experiences',
          6: 'Care year - time for family and close relationships',
          7: 'Reflection year - time for spiritual growth',
          8: 'Achievement year - time for material success',
          9: 'Completion year - time to complete cycles'
        }
      }
    }

    return descriptions[language][numType][num as keyof typeof descriptions[typeof language][typeof numType]] || 
           (language === 'ru' ? 'Особое число с уникальной энергией' : 'Special number with unique energy')
  }

  const getAdditionalNumberData = (num: number, numType: 'day' | 'month' | 'year') => {
    const data = {
      ru: {
        day: {
          title: 'Число дня',
          subtitle: 'Энергия дня рождения',
          description: 'Число дня показывает вашу основную энергию и способности, которые вы принесли в этот мир. Это число влияет на вашу личность и то, как вы проявляете себя в повседневной жизни.',
          icon: Sun,
          color: 'from-yellow-500 to-orange-700'
        },
        month: {
          title: 'Число месяца',
          subtitle: 'Энергия месяца рождения',
          description: 'Число месяца показывает ваши эмоциональные потребности и то, как вы обрабатываете чувства. Это число влияет на ваши отношения и способность к эмпатии.',
          icon: Moon,
          color: 'from-blue-500 to-indigo-700'
        },
        year: {
          title: 'Число года',
          subtitle: 'Энергия года рождения',
          description: 'Число года показывает ваши жизненные уроки и то, чему вы должны научиться в этой жизни. Это число влияет на ваши цели и жизненный путь.',
          icon: Star,
          color: 'from-purple-500 to-pink-700'
        }
      },
      en: {
        day: {
          title: 'Day Number',
          subtitle: 'Birth day energy',
          description: 'The day number shows your core energy and abilities that you brought into this world. This number affects your personality and how you express yourself in daily life.',
          icon: Sun,
          color: 'from-yellow-500 to-orange-700'
        },
        month: {
          title: 'Month Number',
          subtitle: 'Birth month energy',
          description: 'The month number shows your emotional needs and how you process feelings. This number affects your relationships and ability to empathize.',
          icon: Moon,
          color: 'from-blue-500 to-indigo-700'
        },
        year: {
          title: 'Year Number',
          subtitle: 'Birth year energy',
          description: 'The year number shows your life lessons and what you need to learn in this life. This number affects your goals and life path.',
          icon: Star,
          color: 'from-purple-500 to-pink-700'
        }
      }
    }

    const typeData = data[language][numType]
    const numberData = getNumberDescription(num, numType)
    
    return {
      ...typeData,
      number: num,
      numberDescription: numberData
    }
  }

  const additionalNumberData = getAdditionalNumberData(number, type)
  const IconComponent = additionalNumberData.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-space-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-space-800 border-b border-space-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${additionalNumberData.color} rounded-full flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="cosmic-title text-2xl">{additionalNumberData.title}</h1>
                <p className="text-cosmic-400">{additionalNumberData.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-space-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cosmic-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Number Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold bg-gradient-to-br ${additionalNumberData.color} bg-clip-text text-transparent mb-4`}>
              {number}
            </div>
            <p className="text-lg text-cosmic-300">
              {additionalNumberData.numberDescription}
            </p>
          </div>

          {/* Description */}
          <div className="cosmic-card p-6">
            <p className="text-lg text-cosmic-200 leading-relaxed">
              {additionalNumberData.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="cosmic-card p-6">
            <h3 className="cosmic-subtitle text-lg mb-4">
              {language === 'ru' ? 'Как использовать это число' : 'How to Use This Number'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Планируйте важные дела в дни, когда это число активно' 
                    : 'Plan important tasks on days when this number is active'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Используйте энергию этого числа для развития соответствующих качеств' 
                    : 'Use the energy of this number to develop corresponding qualities'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Обращайте внимание на повторения этого числа в повседневной жизни' 
                    : 'Pay attention to repetitions of this number in daily life'
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}