'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { User, Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { profileManager } from '@/lib/profileManager'
import { SimpleBirthPlace } from '@/components/SimpleBirthPlace'

export default function RegistrationPage() {
  const { setCurrentScreen, setUserProfile, language } = useAppStore()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Отладочная информация для состояния
  useEffect(() => {
    console.log('🔍 isLoading changed to:', isLoading)
  }, [isLoading])
  
  // Отладочная информация для рендеринга
  useEffect(() => {
    console.log('🔍 RegistrationPage rendered')
    console.log('🔍 step:', step)
    console.log('🔍 isLoading:', isLoading)
    console.log('🔍 formData:', formData)
    
    // Проверяем, что кнопка существует в DOM
    setTimeout(() => {
      const createButton = document.querySelector('button')
      if (createButton) {
        console.log('🔍 Кнопка найдена в DOM:', createButton.textContent?.trim())
        console.log('🔍 Кнопка заблокирована:', createButton.disabled)
      }
    }, 100)
  })
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    birthCoordinates: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [birthPlaceValid, setBirthPlaceValid] = useState(false)

  // Функция для форматирования ФИО с заглавными буквами
  const formatFullName = (name: string): string => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Обрабатываем слова с дефисами (например: Анна-Мария)
        if (word.includes('-')) {
          return word
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-')
        }
        // Обрабатываем слова с апострофами (например: О'Коннор)
        if (word.includes("'")) {
          return word
            .split("'")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join("'")
        }
        // Обычное форматирование
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
      .trim() // Убираем лишние пробелы
  }

  const handleInputChange = (field: string, value: string) => {
    // Для поля имени не форматируем при вводе, только при потере фокуса
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    console.log('🔍 Validating form...')
    console.log('🔍 name:', formData.name)
    console.log('🔍 birthDate:', formData.birthDate)
    console.log('🔍 birthPlace:', formData.birthPlace)
    console.log('🔍 birthPlaceValid:', birthPlaceValid)
    
    if (!formData.name.trim()) {
      newErrors.name = 'ФИО обязательно'
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Введите полное ФИО (Фамилия Имя Отчество)'
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Дата рождения обязательна'
    }
    
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = 'Место рождения обязательно'
    }
    
    if (!birthPlaceValid) {
      newErrors.birthCoordinates = 'Необходимо выбрать место из списка'
    }
    
    console.log('🔍 Validation errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    try {
      console.log('🔍 handleSubmit called')
      console.log('🔍 formData:', formData)
      console.log('🔍 birthPlaceValid:', birthPlaceValid)
      console.log('🔍 errors:', errors)
      
      if (!validateForm()) {
        console.log('❌ Form validation failed')
        return
      }
      
      console.log('✅ Form validation passed')
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error)
      return
    }
    
    setIsLoading(true)
    
    try {
      // Форматируем ФИО перед созданием профиля
      const formattedName = formatFullName(formData.name.trim())
      
      // Создаем профиль напрямую в localStorage
      const profile = {
        id: Date.now().toString(),
        name: formattedName,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime || '12:00',
        birthPlace: formData.birthPlace,
        birthCoordinates: formData.birthCoordinates,
        coordinates: {
          lat: parseFloat(formData.birthCoordinates.split(',')[0]),
          lng: parseFloat(formData.birthCoordinates.split(',')[1])
        },
        language: 'ru' as const
      }
      
      // Сохраняем в localStorage
      const existingProfiles = JSON.parse(localStorage.getItem('bodygraph-profiles') || '[]')
      existingProfiles.push(profile)
      localStorage.setItem('bodygraph-profiles', JSON.stringify(existingProfiles))
      
      // Сохраняем в глобальное состояние
      setUserProfile(profile)
      
      // Переходим на страницу WelcomeScreen
      router.push('/welcome')
      
    } catch (error) {
      console.error('Ошибка создания профиля:', error)
      setErrors({ general: 'Ошибка создания профиля' })
    } finally {
      console.log('🔍 Setting isLoading to false')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cosmic-500 to-cosmic-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Добро пожаловать в Космический Анализ
          </h1>
          <p className="text-cosmic-300 text-lg">
            Создайте свой профиль для получения персональных космических данных
          </p>
        </motion.div>

        {/* Прогресс */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNum 
                    ? 'bg-cosmic-500 text-white' 
                    : 'bg-space-700 text-cosmic-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step > stepNum ? 'bg-cosmic-500' : 'bg-space-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Форма */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-space-800/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Шаг 1: Имя */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <User className="w-12 h-12 text-cosmic-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Ваше имя</h2>
                <p className="text-cosmic-300">Как вас зовут?</p>
                <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-blue-300">
                    <strong>Важно:</strong> Введите ваши ФИО полностью для точного расчета данных
                  </p>
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={(e) => {
                    // Форматирование ФИО при потере фокуса
                    const currentValue = e.target.value.trim()
                    if (currentValue) {
                      const formatted = formatFullName(currentValue)
                      if (formatted !== currentValue) {
                        setFormData(prev => ({ ...prev, name: formatted }))
                      }
                    }
                  }}
                  placeholder="Введите ваши ФИО полностью (например: Иванов Иван Иванович)"
                  className="w-full px-4 py-3 bg-space-700 border border-cosmic-500/30 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Шаг 2: Дата и время рождения */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-cosmic-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Дата и время рождения</h2>
                <p className="text-cosmic-300">Когда вы родились?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cosmic-300 text-sm mb-2">Дата рождения *</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-4 py-3 bg-space-700 border border-cosmic-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                  />
                  {errors.birthDate && (
                    <p className="text-red-400 text-sm mt-2">{errors.birthDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-cosmic-300 text-sm mb-2">Время рождения</label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    className="w-full px-4 py-3 bg-space-700 border border-cosmic-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                  />
                  <p className="text-cosmic-400 text-xs mt-1">Если не знаете, оставьте 12:00</p>
                </div>
              </div>
            </div>
          )}

          {/* Шаг 3: Место рождения */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-cosmic-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Место рождения</h2>
                <p className="text-cosmic-300">Где вы родились?</p>
              </div>
              
              <SimpleBirthPlace
                values={{
                  birthPlace: formData.birthPlace,
                  birthCoordinates: formData.birthCoordinates
                }}
                errors={{
                  birthPlace: errors.birthPlace,
                  birthCoordinates: errors.birthCoordinates
                }}
                onChange={(field, value) => handleInputChange(field, value)}
                onValidationChange={setBirthPlaceValid}
                language="ru"
              />
            </div>
          )}

          {/* Кнопки навигации */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-space-700 text-cosmic-300 rounded-xl hover:bg-space-600 transition-colors"
              >
                Назад
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-cosmic-500 text-white rounded-xl hover:bg-cosmic-600 transition-colors flex items-center gap-2 ml-auto"
              >
                Далее
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-cosmic-500 text-white rounded-xl hover:bg-cosmic-600 transition-colors flex items-center gap-2 ml-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Создаем профиль...' : 'Создать профиль'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

          {errors.general && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
