'use client'

import React, { use as usePromise } from 'react'
import { useAppStore } from '@/store/appStore'
import { calculateHumanDesign } from '@/lib/humanDesignEngine'
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

  // Используем данные из Human Design Engine через API
  const [humanDesignData, setHumanDesignData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchHumanDesignData = async () => {
      try {
        const response = await fetch('/api/human-design/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate: userProfile.birthDate,
            birthTime: userProfile.birthTime,
            latitude: userProfile.coordinates?.lat || 0,
            longitude: userProfile.coordinates?.lng || 0
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setHumanDesignData(data)
        }
      } catch (error) {
        console.error('Error fetching Human Design data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHumanDesignData()
  }, [userProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="cosmic-card text-center">
          <p className="text-cosmic-300">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!humanDesignData) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="cosmic-card text-center">
          <p className="text-cosmic-300">Ошибка загрузки данных Human Design.</p>
        </div>
      </div>
    )
  }

  const currentCross = humanDesignData.incarnationCross

  // Используем данные напрямую из API
  const current = {
    title: currentCross.name,
    subtitle: language === 'ru' ? 'Трансформация и возрождение' : 'Transformation and rebirth',
    description: currentCross.description,
    characteristics: currentCross.characteristics || [],
    mission: currentCross.lifeMission || [],
    strengths: currentCross.strengths || [],
    challenges: currentCross.challenges || [],
    advice: currentCross.advice || []
  }

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
