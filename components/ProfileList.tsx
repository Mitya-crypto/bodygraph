// components/ProfileList.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle
} from 'lucide-react'
import { profileManager, StoredProfile } from '@/lib/profileManager'
import { useAppStore } from '@/store/appStore'
// ProfileEditModal удален - профили нельзя редактировать
import toast from 'react-hot-toast'

interface ProfileListProps {
  telegramId: number
  onProfileSelect?: (profile: StoredProfile) => void
  language: 'en' | 'ru'
}

export function ProfileList({ 
  telegramId, 
  onProfileSelect, 
  language 
}: ProfileListProps) {
  const [profiles, setProfiles] = useState<StoredProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  // Модальное окно редактирования удалено
  const { setUserProfile } = useAppStore()

  console.log('ProfileList props:', { 
    telegramId, 
    onProfileSelect: typeof onProfileSelect, 
    language 
  })

  useEffect(() => {
    loadProfiles()
  }, [telegramId])

  const loadProfiles = async () => {
    try {
      setIsLoading(true)
      
      // Читаем профили напрямую из localStorage
      const storedProfiles = localStorage.getItem('bodygraph-profiles')
      let userProfiles: StoredProfile[] = []
      
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles)
        // Преобразуем формат данных из регистрации в формат StoredProfile
        userProfiles = profiles.map((profile: any) => ({
          id: profile.id,
          telegramId: telegramId,
          profile: {
            name: profile.name,
            birthDate: profile.birthDate,
            birthTime: profile.birthTime,
            birthPlace: profile.birthPlace,
            coordinates: profile.coordinates
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      }
      
      const sub = profileManager.getSubscription(telegramId)
      
      setProfiles(userProfiles)
      setSubscription(sub)
      
      console.log('📋 Loaded profiles from localStorage:', userProfiles.length)
    } catch (error) {
      console.error('Ошибка загрузки профилей:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSelect = (profile: StoredProfile) => {
    setUserProfile(profile.profile)
    if (onProfileSelect) {
      onProfileSelect(profile)
    } else {
      window.location.href = '/modules'
    }
  }

  const handleProfileDelete = async (profileId: string) => {
    try {
      await profileManager.deleteProfile(profileId)
      await loadProfiles()
      toast.success(language === 'ru' ? 'Профиль удален!' : 'Profile deleted!')
    } catch (error) {
      console.error('Ошибка удаления профиля:', error)
      toast.error(language === 'ru' ? 'Ошибка удаления профиля' : 'Error deleting profile')
    }
  }

  // Функции редактирования удалены - профили нельзя изменять

  const canCreateNewProfile = () => {
    if (!subscription) return false
    return subscription.limits.maxProfiles === -1 || profiles.length < subscription.limits.maxProfiles
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      // Проверяем, что дата валидна
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', date)
        return 'Неизвестно'
      }
      
      return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', date, error)
      return 'Неизвестно'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="cosmic-title text-2xl">
            {language === 'ru' ? 'Мои профили' : 'My Profiles'}
          </h2>
          <p className="text-cosmic-400 mt-1">
            {language === 'ru' 
              ? `${profiles.length} из ${subscription?.limits.maxProfiles === -1 ? '∞' : subscription?.limits.maxProfiles || 0} профилей`
              : `${profiles.length} of ${subscription?.limits.maxProfiles === -1 ? '∞' : subscription?.limits.maxProfiles || 0} profiles`
            }
          </p>
        </div>
        
        {/* Кнопка создания профиля удалена - профили создаются только при регистрации */}
      </div>


      {/* Список профилей */}
      <div className="space-y-4">
        <AnimatePresence>
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="cosmic-card p-6 hover:bg-space-700/30 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-cosmic-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-cosmic-200" />
                    </div>
                    <div>
                      <h3 className="cosmic-title text-lg">
                        {profile.profile.name}
                      </h3>
                      <p className="text-cosmic-400 text-sm">
                        {language === 'ru' ? 'Создан' : 'Created'} {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-cosmic-300">
                      <Calendar className="w-4 h-4 text-cosmic-400" />
                      <span className="text-sm">
                        {profile.profile.birthDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-cosmic-300">
                      <Clock className="w-4 h-4 text-cosmic-400" />
                      <span className="text-sm">
                        {profile.profile.birthTime || '12:00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-cosmic-300 md:col-span-2">
                      <MapPin className="w-4 h-4 text-cosmic-400" />
                      <span className="text-sm">
                        {profile.profile.birthPlace}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cosmic-500">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>
                      {language === 'ru' ? 'Обновлен' : 'Updated'} {formatDate(profile.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 transition-opacity">
                  {/* Кнопка выбора */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🎯 Select button clicked for profile:', profile.id)
                      handleProfileSelect(profile)
                    }}
                    className="px-4 py-2 bg-cosmic-600 hover:bg-cosmic-700 text-cosmic-100 rounded-lg transition-colors border border-cosmic-500 hover:border-cosmic-400 text-sm font-medium"
                    title={language === 'ru' ? 'Выбрать для расчетов' : 'Select for calculations'}
                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                  >
                    {language === 'ru' ? 'Выбрать' : 'Select'}
                  </button>
                  
                  {/* Кнопки редактирования и удаления удалены - профили нельзя изменять */}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Пустое состояние */}
        {profiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-cosmic-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-cosmic-400" />
            </div>
            <h3 className="cosmic-title text-lg mb-2">
              {language === 'ru' ? 'Нет профилей' : 'No profiles'}
            </h3>
            <p className="text-cosmic-400 mb-6">
              {language === 'ru' 
                ? 'Профиль будет создан при регистрации' 
                : 'Profile will be created during registration'
              }
            </p>
            {/* Кнопка создания профиля удалена - профили создаются только при регистрации */}
          </motion.div>
        )}
      </div>

      {/* Edit Modal удален - профили нельзя редактировать */}
    </div>
  )
}
