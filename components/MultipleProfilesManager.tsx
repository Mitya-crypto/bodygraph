'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Plus, 
  User, 
  Edit3, 
  Trash2, 
  Heart, 
  Users, 
  Baby, 
  Star,
  Save,
  X,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react'
import { useAppStore, UserProfile } from '@/store/appStore'
import { SimpleBirthPlace } from '@/components/SimpleBirthPlace'
import { parseCoordinates } from '@/lib/reverseGeocoding'

interface ProfileFormData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  birthCoordinates: string
  relationship: string
  notes: string
}

const relationshipOptions = [
  { value: 'self', label: 'Я', icon: User },
  { value: 'partner', label: 'Партнер/Супруг(а)', icon: Heart },
  { value: 'child', label: 'Ребенок', icon: Baby },
  { value: 'parent', label: 'Родитель', icon: Users },
  { value: 'friend', label: 'Друг/Подруга', icon: Star },
  { value: 'other', label: 'Другое', icon: User }
]

export function MultipleProfilesManager() {
  const { 
    savedProfiles, 
    addSavedProfile, 
    updateSavedProfile, 
    deleteSavedProfile,
    setUserProfile,
    triggerProfileUpdate 
  } = useAppStore()
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAddingProfile, setIsAddingProfile] = useState(false)
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)
  
  // Проверяем, пришли ли мы из синастрии
  const fromSynastry = searchParams.get('from') === 'synastry'
  
  // Фильтруем профили в зависимости от контекста
  const displayProfiles = fromSynastry 
    ? savedProfiles.filter(profile => !profile.isPrimary) // Для синастрии показываем только дополнительные профили
    : savedProfiles // Для обычного управления показываем все профили (семья)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    birthCoordinates: '',
    relationship: 'self',
    notes: ''
  })
  const [birthPlaceValid, setBirthPlaceValid] = useState(false)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // Автоматически сохраняем текущий профиль при первом заходе
  useEffect(() => {
    const currentProfile = useAppStore.getState().userProfile
    if (currentProfile && savedProfiles.length === 0) {
      const primaryProfile = {
        ...currentProfile,
        isPrimary: true,
        relationship: 'self'
      }
      addSavedProfile(primaryProfile)
    }
  }, [addSavedProfile, savedProfiles.length])

  const handleAddProfile = () => {
    // Создаем новый профиль
    setIsAddingProfile(true)
    setEditingProfileId(null)
    setFormData({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      birthCoordinates: '',
      relationship: 'self',
      notes: ''
    })
    setBirthPlaceValid(false)
    setFormErrors({})
  }

  const handleEditProfile = (profile: UserProfile) => {
    setEditingProfileId(profile.id)
    setIsAddingProfile(true)
    setFormData({
      name: profile.name,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      birthPlace: profile.birthPlace,
      birthCoordinates: profile.birthCoordinates || '',
      relationship: profile.relationship || 'self',
      notes: profile.notes || ''
    })
    setBirthPlaceValid(!!profile.birthCoordinates)
    setFormErrors({})
  }

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.birthDate || !formData.birthTime) {
      setFormErrors({ general: 'Пожалуйста, заполните все обязательные поля' })
      return
    }

    if (!birthPlaceValid) {
      setFormErrors({ birthPlace: 'Пожалуйста, выберите место рождения из списка' })
      return
    }

    try {
      // Парсим координаты из birthCoordinates
      const coordinates = parseCoordinates(formData.birthCoordinates)
      
      const profileData: UserProfile = {
        id: editingProfileId || `profile_${Date.now()}`,
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        birthCoordinates: formData.birthCoordinates,
        coordinates: coordinates,
        relationship: fromSynastry ? formData.relationship : 'self', // Для синастрии используем выбранное отношение
        notes: formData.notes,
        language: 'ru',
        isPrimary: fromSynastry ? false : (editingProfileId ? savedProfiles.find(p => p.id === editingProfileId)?.isPrimary : false), // Для синастрии всегда дополнительные, для семьи - дополнительные
        createdAt: editingProfileId ? savedProfiles.find(p => p.id === editingProfileId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingProfileId) {
        updateSavedProfile(editingProfileId, profileData)
      } else {
        addSavedProfile(profileData)
      }

      setIsAddingProfile(false)
      setEditingProfileId(null)
      setFormErrors({})
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error)
      setFormErrors({ general: 'Ошибка при сохранении профиля' })
    }
  }

  const handleDeleteProfile = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот профиль?')) {
      deleteSavedProfile(id)
    }
  }

  const handleSelectProfile = (profile: UserProfile) => {
    if (fromSynastry) {
      // Если пришли из синастрии, возвращаемся обратно с выбранным партнером
      router.push(`/results?module=synastry&partnerId=${profile.id}`)
    } else {
      // Обычное поведение - выбор активного профиля
      setUserProfile(profile)
      triggerProfileUpdate()
    }
  }

  const getRelationshipIcon = (relationship: string) => {
    const option = relationshipOptions.find(opt => opt.value === relationship)
    return option ? option.icon : User
  }

  const getRelationshipLabel = (relationship: string) => {
    const option = relationshipOptions.find(opt => opt.value === relationship)
    return option ? option.label : 'Другое'
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-space-900 via-space-800 to-space-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cosmic-300 mb-2">
            {fromSynastry ? 'Выберите партнера' : 'Мои Профили'}
          </h1>
          <p className="text-cosmic-400">
            {fromSynastry 
              ? 'Выберите партнера для анализа совместимости'
              : 'Управление профилями семьи и близких'
            }
          </p>
        </div>

        {/* Add Profile Button */}
        <motion.button
          onClick={handleAddProfile}
          className="w-full mb-6 p-4 bg-cosmic-600 hover:bg-cosmic-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          {fromSynastry ? 'Добавить партнера' : 'Добавить профиль'}
        </motion.button>

        {/* Profile Form */}
        <AnimatePresence>
          {isAddingProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-space-700 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {editingProfileId ? 'Редактировать профиль' : 'Новый профиль'}
                </h3>
                <button
                  onClick={() => setIsAddingProfile(false)}
                  className="text-cosmic-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cosmic-300 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-space-600 border border-cosmic-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500"
                    placeholder="Введите имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-300 mb-2">
                    Отношение
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full p-3 bg-space-600 border border-cosmic-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500"
                  >
                    {relationshipOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-300 mb-2">
                    Дата рождения *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full p-3 bg-space-600 border border-cosmic-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-300 mb-2">
                    Время рождения *
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full p-3 bg-space-600 border border-cosmic-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <SimpleBirthPlace
                    values={{
                      birthPlace: formData.birthPlace,
                      birthCoordinates: formData.birthCoordinates
                    }}
                    errors={formErrors}
                    onChange={(field, value) => {
                      if (field === 'birthPlace') {
                        setFormData({ ...formData, birthPlace: value })
                      } else if (field === 'birthCoordinates') {
                        setFormData({ ...formData, birthCoordinates: value })
                      }
                    }}
                    onValidationChange={setBirthPlaceValid}
                    language="ru"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cosmic-300 mb-2">
                    Заметки
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 bg-space-600 border border-cosmic-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 h-20 resize-none"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </div>

              {formErrors.general && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{formErrors.general}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 p-3 bg-cosmic-600 hover:bg-cosmic-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
                <button
                  onClick={() => setIsAddingProfile(false)}
                  className="px-6 p-3 bg-space-600 hover:bg-space-500 rounded-lg text-white font-medium transition-colors"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profiles List */}
        <div className="space-y-4">
          {displayProfiles.map((profile) => {
            const RelationshipIcon = getRelationshipIcon(profile.relationship || 'self')
            const isActive = useAppStore.getState().userProfile?.id === profile.id
            const createdAt = profile.createdAt ? new Date(profile.createdAt) : new Date()
            const updatedAt = profile.updatedAt ? new Date(profile.updatedAt) : createdAt
            
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="cosmic-card p-6 hover:bg-space-700/30 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-cosmic-600 rounded-full flex items-center justify-center">
                        <RelationshipIcon className="w-6 h-6 text-cosmic-200" />
                      </div>
                      <div>
                        <h3 className="cosmic-title text-lg">{profile.name}</h3>
                        <p className="text-cosmic-400 text-sm">
                          {getRelationshipLabel(profile.relationship || 'self')} • 
                          Создан {createdAt.toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })} г., {createdAt.toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-cosmic-300">
                        <Calendar className="w-4 h-4 text-cosmic-400" />
                        <span className="text-sm">{new Date(profile.birthDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-cosmic-300">
                        <Clock className="w-4 h-4 text-cosmic-400" />
                        <span className="text-sm">{profile.birthTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-cosmic-300 md:col-span-2">
                        <MapPin className="w-4 h-4 text-cosmic-400" />
                        <span className="text-sm">{profile.birthPlace}</span>
                      </div>
                    </div>

                    {profile.notes && (
                      <div className="mb-4 p-3 bg-space-600/50 rounded-lg border border-space-500/30">
                        <p className="text-sm text-cosmic-300">{profile.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-cosmic-500">
                      {isActive ? (
                        <>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span>Активный профиль</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 bg-cosmic-400 rounded-full"></div>
                          <span>Обновлен {updatedAt.toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })} г., {updatedAt.toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSelectProfile(profile)}
                      className={`px-4 py-2 rounded-lg transition-colors border text-sm font-medium ${
                        fromSynastry
                          ? 'bg-cosmic-600 hover:bg-cosmic-700 text-cosmic-100 border-cosmic-500 hover:border-cosmic-400'
                          : isActive 
                            ? 'bg-cosmic-600 text-cosmic-100 border-cosmic-500' 
                            : 'bg-cosmic-600 hover:bg-cosmic-700 text-cosmic-100 border-cosmic-500 hover:border-cosmic-400'
                      }`}
                      title={fromSynastry ? "Выбрать для синастрии" : "Выбрать для расчетов"}
                    >
                      {fromSynastry ? 'Выбрать' : (isActive ? 'Активный' : 'Выбрать')}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProfile(profile)
                      }}
                      className="p-2 text-cosmic-400 hover:text-cosmic-300 transition-colors"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    {!profile.isPrimary && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProfile(profile.id)
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {displayProfiles.length === 0 && !isAddingProfile && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-cosmic-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cosmic-300 mb-2">
              {fromSynastry ? 'Нет партнеров для анализа' : 'Нет сохраненных профилей'}
            </h3>
            <p className="text-cosmic-400 mb-6">
              {fromSynastry 
                ? 'Добавьте партнеров для анализа совместимости'
                : 'Добавьте профили семьи и близких для быстрого доступа'
              }
            </p>
            <button
              onClick={handleAddProfile}
              className="px-6 py-3 bg-cosmic-600 hover:bg-cosmic-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              {fromSynastry ? 'Добавить партнера' : 'Добавить профиль'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
