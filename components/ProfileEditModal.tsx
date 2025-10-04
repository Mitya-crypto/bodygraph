'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Calendar, Clock, MapPin, Lock } from 'lucide-react'
import { StoredProfile } from '@/lib/profileManager'

interface ProfileEditModalProps {
  profile: StoredProfile | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProfile: StoredProfile) => void
  language: 'en' | 'ru'
}

export function ProfileEditModal({ profile, isOpen, onClose, language }: ProfileEditModalProps) {
  if (!profile) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-space-800 border border-cosmic-500/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-cosmic-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {language === 'ru' ? 'Информация о профиле' : 'Profile Information'}
                  </h2>
                  <p className="text-sm text-cosmic-400">
                    {language === 'ru' ? 'Только для просмотра' : 'Read only'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-space-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-cosmic-400" />
              </button>
            </div>

            {/* Информация о профиле */}
            <div className="space-y-6">
              {/* Имя */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cosmic-400" />
                  <label className="text-sm font-medium text-cosmic-300">
                    {language === 'ru' ? 'Имя' : 'Name'}
                  </label>
                </div>
                <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                  <p className="text-white font-medium">{profile.profile.name}</p>
                </div>
              </div>

              {/* Дата рождения */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cosmic-400" />
                  <label className="text-sm font-medium text-cosmic-300">
                    {language === 'ru' ? 'Дата рождения' : 'Birth Date'}
                  </label>
                </div>
                <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                  <p className="text-white font-medium">
                    {new Date(profile.profile.birthDate).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Время рождения */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cosmic-400" />
                  <label className="text-sm font-medium text-cosmic-300">
                    {language === 'ru' ? 'Время рождения' : 'Birth Time'}
                  </label>
                </div>
                <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                  <p className="text-white font-medium">{profile.profile.birthTime}</p>
                </div>
              </div>

              {/* Место рождения */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cosmic-400" />
                  <label className="text-sm font-medium text-cosmic-300">
                    {language === 'ru' ? 'Место рождения' : 'Birth Place'}
                  </label>
                </div>
                <div className="p-3 bg-space-700 border border-cosmic-500/30 rounded-xl">
                  <p className="text-white font-medium">{profile.profile.birthPlace}</p>
                  {profile.profile.coordinates && (
                    <p className="text-xs text-cosmic-400 mt-1">
                      {profile.profile.coordinates.lat.toFixed(4)}, {profile.profile.coordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Уведомление о невозможности редактирования */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">
                    {language === 'ru' ? 'Профиль заблокирован' : 'Profile Locked'}
                  </h4>
                  <p className="text-sm text-cosmic-300">
                    {language === 'ru' 
                      ? 'Данные профиля нельзя изменить после создания. Это обеспечивает точность астрологических расчетов.'
                      : 'Profile data cannot be changed after creation. This ensures the accuracy of astrological calculations.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопка закрытия */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-space-700 hover:bg-space-600 text-cosmic-300 rounded-xl transition-colors"
              >
                {language === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}