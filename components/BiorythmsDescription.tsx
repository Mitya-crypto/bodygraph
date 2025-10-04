// components/BiorythmsDescription.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Activity, Heart, Brain } from 'lucide-react'

interface BiorythmsDescriptionProps {
  biorythms: {
    physical: number
    emotional: number
    intellectual: number
  }
  language: 'en' | 'ru'
  onClose: () => void
}

export function BiorythmsDescription({ biorythms, language, onClose }: BiorythmsDescriptionProps) {
  console.log('🔄 BiorythmsDescription rendered with biorythms:', biorythms)
  
  const getBiorythmsData = () => {
    const data = {
      ru: {
        title: 'Биоритмы',
        subtitle: 'Циклы жизненной энергии',
        description: 'Биоритмы - это естественные циклы жизненной энергии, которые влияют на ваше физическое, эмоциональное и интеллектуальное состояние. Эти циклы помогают понять, когда вы находитесь на пике своих возможностей, а когда лучше отдохнуть.',
        physical: {
          title: 'Физический биоритм',
          description: 'Влияет на вашу физическую силу, выносливость и общее самочувствие. Когда биоритм высокий, вы чувствуете себя энергичным и готовым к физическим нагрузкам.',
          high: 'Высокий уровень энергии, отличное самочувствие, готовность к физическим нагрузкам',
          low: 'Низкий уровень энергии, усталость, потребность в отдыхе',
          neutral: 'Средний уровень энергии, стабильное состояние'
        },
        emotional: {
          title: 'Эмоциональный биоритм',
          description: 'Влияет на ваше эмоциональное состояние, настроение и способность к общению. Когда биоритм высокий, вы чувствуете себя счастливым и открытым для общения.',
          high: 'Отличное настроение, открытость для общения, позитивный настрой',
          low: 'Плохое настроение, замкнутость, потребность в уединении',
          neutral: 'Стабильное эмоциональное состояние'
        },
        intellectual: {
          title: 'Интеллектуальный биоритм',
          description: 'Влияет на вашу способность к концентрации, обучению и принятию решений. Когда биоритм высокий, вы легко усваиваете новую информацию и принимаете правильные решения.',
          high: 'Высокая концентрация, легкое усвоение информации, ясность мышления',
          low: 'Сложности с концентрацией, усталость от умственной работы',
          neutral: 'Стабильная умственная активность'
        },
        interpretation: {
          title: 'Как интерпретировать биоритмы',
          description: 'Положительные значения (выше 0) указывают на высокий уровень энергии в соответствующей области. Отрицательные значения (ниже 0) указывают на низкий уровень энергии. Значения близкие к 0 указывают на переходный период.',
          tips: [
            'Планируйте важные дела в дни с высокими биоритмами',
            'Отдыхайте в дни с низкими биоритмами',
            'Используйте высокие биоритмы для обучения и развития',
            'Берегите себя в дни с низкими биоритмами',
            'Обращайте внимание на переходные периоды (близко к 0)'
          ]
        }
      },
      en: {
        title: 'Biorhythms',
        subtitle: 'Life energy cycles',
        description: 'Biorhythms are natural cycles of life energy that affect your physical, emotional, and intellectual state. These cycles help understand when you are at the peak of your capabilities and when it is better to rest.',
        physical: {
          title: 'Physical biorhythm',
          description: 'Affects your physical strength, endurance, and overall well-being. When the biorhythm is high, you feel energetic and ready for physical exertion.',
          high: 'High energy level, excellent well-being, readiness for physical exertion',
          low: 'Low energy level, fatigue, need for rest',
          neutral: 'Average energy level, stable condition'
        },
        emotional: {
          title: 'Emotional biorhythm',
          description: 'Affects your emotional state, mood, and ability to communicate. When the biorhythm is high, you feel happy and open to communication.',
          high: 'Excellent mood, openness to communication, positive attitude',
          low: 'Bad mood, withdrawal, need for solitude',
          neutral: 'Stable emotional state'
        },
        intellectual: {
          title: 'Intellectual biorhythm',
          description: 'Affects your ability to concentrate, learn, and make decisions. When the biorhythm is high, you easily absorb new information and make right decisions.',
          high: 'High concentration, easy information absorption, clarity of thinking',
          low: 'Difficulties with concentration, fatigue from mental work',
          neutral: 'Stable mental activity'
        },
        interpretation: {
          title: 'How to interpret biorhythms',
          description: 'Positive values (above 0) indicate high energy level in the corresponding area. Negative values (below 0) indicate low energy level. Values close to 0 indicate a transitional period.',
          tips: [
            'Plan important tasks on days with high biorhythms',
            'Rest on days with low biorhythms',
            'Use high biorhythms for learning and development',
            'Take care of yourself on days with low biorhythms',
            'Pay attention to transitional periods (close to 0)'
          ]
        }
      }
    }

    return data[language]
  }

  const biorythmsData = getBiorythmsData()
  console.log('📋 BiorythmsData:', biorythmsData)

  const getBiorythmStatus = (value: number) => {
    if (value > 50) return 'high'
    if (value < -50) return 'low'
    return 'neutral'
  }

  const getBiorythmColor = (value: number) => {
    if (value > 50) return 'text-green-400'
    if (value < -50) return 'text-red-400'
    return 'text-yellow-400'
  }

  const getBiorythmDescription = (value: number, type: 'physical' | 'emotional' | 'intellectual') => {
    const status = getBiorythmStatus(value)
    const data = biorythmsData[type]
    
    switch (status) {
      case 'high':
        return data.high
      case 'low':
        return data.low
      default:
        return data.neutral
    }
  }

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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="cosmic-title text-2xl">{biorythmsData.title}</h1>
                <p className="text-cosmic-400">{biorythmsData.subtitle}</p>
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
              {biorythmsData.description}
            </p>
          </div>

          {/* Current Biorythms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-blue-400" />
                <h3 className="cosmic-subtitle text-lg">{biorythmsData.physical.title}</h3>
              </div>
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold mb-2 ${getBiorythmColor(biorythms.physical)}`}>
                  {biorythms.physical}%
                </div>
                <div className="w-full bg-space-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.abs(biorythms.physical)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-cosmic-300 mb-3">
                {biorythmsData.physical.description}
              </p>
              <p className="text-sm text-cosmic-400">
                {getBiorythmDescription(biorythms.physical, 'physical')}
              </p>
            </div>

            {/* Emotional */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-400" />
                <h3 className="cosmic-subtitle text-lg">{biorythmsData.emotional.title}</h3>
              </div>
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold mb-2 ${getBiorythmColor(biorythms.emotional)}`}>
                  {biorythms.emotional}%
                </div>
                <div className="w-full bg-space-700 rounded-full h-3">
                  <div 
                    className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.abs(biorythms.emotional)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-cosmic-300 mb-3">
                {biorythmsData.emotional.description}
              </p>
              <p className="text-sm text-cosmic-400">
                {getBiorythmDescription(biorythms.emotional, 'emotional')}
              </p>
            </div>

            {/* Intellectual */}
            <div className="cosmic-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <h3 className="cosmic-subtitle text-lg">{biorythmsData.intellectual.title}</h3>
              </div>
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold mb-2 ${getBiorythmColor(biorythms.intellectual)}`}>
                  {biorythms.intellectual}%
                </div>
                <div className="w-full bg-space-700 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.abs(biorythms.intellectual)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-cosmic-300 mb-3">
                {biorythmsData.intellectual.description}
              </p>
              <p className="text-sm text-cosmic-400">
                {getBiorythmDescription(biorythms.intellectual, 'intellectual')}
              </p>
            </div>
          </div>

          {/* Interpretation */}
          <div className="cosmic-card p-6">
            <h3 className="cosmic-subtitle text-lg mb-4">
              {biorythmsData.interpretation.title}
            </h3>
            <p className="text-cosmic-300 mb-4">
              {biorythmsData.interpretation.description}
            </p>
            <div>
              <h4 className="cosmic-subtitle text-md mb-3">
                {language === 'ru' ? 'Практические советы' : 'Practical Tips'}
              </h4>
              <ul className="space-y-2">
                {biorythmsData.interpretation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-cosmic-300">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

