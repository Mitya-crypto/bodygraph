// components/AdditionalNumbersBlockDescription.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Sun, Moon, Star, Target, Users, Lightbulb } from 'lucide-react'

interface AdditionalNumbersBlockDescriptionProps {
  numerologyData: {
    dayNumber: number
    monthNumber: number
    yearNumber: number
  }
  language: 'en' | 'ru'
  onClose: () => void
}

export function AdditionalNumbersBlockDescription({ numerologyData, language, onClose }: AdditionalNumbersBlockDescriptionProps) {
  console.log('🔄 AdditionalNumbersBlockDescription rendered with numerologyData:', numerologyData)
  
  const getAdditionalNumbersData = () => {
    const data = {
      ru: {
        title: 'Дополнительные числа',
        subtitle: 'Энергия даты рождения',
        description: 'Дополнительные числа показывают различные аспекты вашей личности и жизненного пути. Каждое число несет свою уникальную энергию и влияет на то, как вы проявляете себя в разных сферах жизни.',
        dayNumber: {
          title: 'Число дня',
          subtitle: 'Энергия дня рождения',
          description: 'Число дня показывает вашу основную энергию и способности, которые вы принесли в этот мир. Это число влияет на вашу личность и то, как вы проявляете себя в повседневной жизни.',
          icon: Sun,
          color: 'from-yellow-500 to-orange-700'
        },
        monthNumber: {
          title: 'Число месяца',
          subtitle: 'Энергия месяца рождения',
          description: 'Число месяца показывает ваши эмоциональные потребности и то, как вы обрабатываете чувства. Это число влияет на ваши отношения и способность к эмпатии.',
          icon: Moon,
          color: 'from-blue-500 to-indigo-700'
        },
        yearNumber: {
          title: 'Число года',
          subtitle: 'Энергия года рождения',
          description: 'Число года показывает ваши жизненные уроки и то, чему вы должны научиться в этой жизни. Это число влияет на ваши цели и жизненный путь.',
          icon: Star,
          color: 'from-purple-500 to-pink-700'
        }
      },
      en: {
        title: 'Additional Numbers',
        subtitle: 'Birth date energy',
        description: 'Additional numbers show different aspects of your personality and life path. Each number carries its unique energy and affects how you express yourself in different areas of life.',
        dayNumber: {
          title: 'Day Number',
          subtitle: 'Birth day energy',
          description: 'The day number shows your core energy and abilities that you brought into this world. This number affects your personality and how you express yourself in daily life.',
          icon: Sun,
          color: 'from-yellow-500 to-orange-700'
        },
        monthNumber: {
          title: 'Month Number',
          subtitle: 'Birth month energy',
          description: 'The month number shows your emotional needs and how you process feelings. This number affects your relationships and ability to empathize.',
          icon: Moon,
          color: 'from-blue-500 to-indigo-700'
        },
        yearNumber: {
          title: 'Year Number',
          subtitle: 'Birth year energy',
          description: 'The year number shows your life lessons and what you need to learn in this life. This number affects your goals and life path.',
          icon: Star,
          color: 'from-purple-500 to-pink-700'
        }
      }
    }

    return data[language]
  }

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

  const additionalNumbersData = getAdditionalNumbersData()
  console.log('📋 AdditionalNumbersData:', additionalNumbersData)

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
        className="bg-space-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-space-800 border-b border-space-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-700 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="cosmic-title text-2xl">{additionalNumbersData.title}</h1>
                <p className="text-cosmic-400">{additionalNumbersData.subtitle}</p>
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
          {/* Description */}
          <div className="cosmic-card p-6">
            <p className="text-lg text-cosmic-200 leading-relaxed">
              {additionalNumbersData.description}
            </p>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day Number */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${additionalNumbersData.dayNumber.color} rounded-full flex items-center justify-center`}>
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="cosmic-subtitle text-lg">{additionalNumbersData.dayNumber.title}</h3>
                  <p className="text-sm text-cosmic-400">{additionalNumbersData.dayNumber.subtitle}</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold bg-gradient-to-br ${additionalNumbersData.dayNumber.color} bg-clip-text text-transparent mb-2`}>
                  {numerologyData.dayNumber}
                </div>
                <p className="text-sm text-cosmic-300">
                  {getNumberDescription(numerologyData.dayNumber, 'day')}
                </p>
              </div>
              <p className="text-sm text-cosmic-300">
                {additionalNumbersData.dayNumber.description}
              </p>
            </div>

            {/* Month Number */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${additionalNumbersData.monthNumber.color} rounded-full flex items-center justify-center`}>
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="cosmic-subtitle text-lg">{additionalNumbersData.monthNumber.title}</h3>
                  <p className="text-sm text-cosmic-400">{additionalNumbersData.monthNumber.subtitle}</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold bg-gradient-to-br ${additionalNumbersData.monthNumber.color} bg-clip-text text-transparent mb-2`}>
                  {numerologyData.monthNumber}
                </div>
                <p className="text-sm text-cosmic-300">
                  {getNumberDescription(numerologyData.monthNumber, 'month')}
                </p>
              </div>
              <p className="text-sm text-cosmic-300">
                {additionalNumbersData.monthNumber.description}
              </p>
            </div>

            {/* Year Number */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${additionalNumbersData.yearNumber.color} rounded-full flex items-center justify-center`}>
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="cosmic-subtitle text-lg">{additionalNumbersData.yearNumber.title}</h3>
                  <p className="text-sm text-cosmic-400">{additionalNumbersData.yearNumber.subtitle}</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold bg-gradient-to-br ${additionalNumbersData.yearNumber.color} bg-clip-text text-transparent mb-2`}>
                  {numerologyData.yearNumber}
                </div>
                <p className="text-sm text-cosmic-300">
                  {getNumberDescription(numerologyData.yearNumber, 'year')}
                </p>
              </div>
              <p className="text-sm text-cosmic-300">
                {additionalNumbersData.yearNumber.description}
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="cosmic-card p-6">
            <h3 className="cosmic-subtitle text-lg mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cosmic-400" />
              {language === 'ru' ? 'Как использовать дополнительные числа' : 'How to Use Additional Numbers'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Планируйте важные дела в дни, когда соответствующие числа активны' 
                    : 'Plan important tasks on days when corresponding numbers are active'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Используйте энергию каждого числа для развития соответствующих качеств' 
                    : 'Use the energy of each number to develop corresponding qualities'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Обращайте внимание на повторения этих чисел в повседневной жизни' 
                    : 'Pay attention to repetitions of these numbers in daily life'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3 text-cosmic-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ru' 
                    ? 'Сочетайте энергии всех трех чисел для максимального эффекта' 
                    : 'Combine the energies of all three numbers for maximum effect'
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



