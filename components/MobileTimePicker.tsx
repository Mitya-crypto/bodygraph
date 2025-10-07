'use client'

import { useState } from 'react'

interface MobileTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  label?: string
  error?: string
  helpText?: string
}

export function MobileTimePicker({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Выберите время',
  label,
  error,
  helpText
}: MobileTimePickerProps) {
  const [selectedTime, setSelectedTime] = useState(value || '')

  // Разбираем время на компоненты
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: '', minutes: '' }
    const [hours, minutes] = timeStr.split(':')
    return { hours, minutes }
  }

  const { hours, minutes } = parseTime(selectedTime)

  // Форматируем время для отображения
  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    return `${h}:${m}`
  }

  const handleTimeChange = (field: 'hours' | 'minutes', value: string) => {
    const current = parseTime(selectedTime)
    const updated = { ...current, [field]: value }
    
    if (updated.hours && updated.minutes) {
      const newTime = `${updated.hours.padStart(2, '0')}:${updated.minutes.padStart(2, '0')}`
      setSelectedTime(newTime)
      onChange(newTime)
    } else {
      setSelectedTime(`${updated.hours}:${updated.minutes}`)
    }
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSelectedTime(newValue)
    onChange(newValue)
  }


  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-cosmic-300 text-sm mb-2">
          {label}
        </label>
      )}
      
      {/* Нативный input для мобильных устройств */}
      <div className="relative">
        <input
          type="time"
          value={selectedTime}
          onChange={handleNativeChange}
          className="w-full px-4 py-3 bg-space-700 border border-cosmic-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent appearance-none"
          style={{
            colorScheme: 'dark',
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
        />
        
        {/* Кастомная иконка часов */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className="w-5 h-5 text-cosmic-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
      </div>


      {/* Дополнительные элементы для десктопа */}
      <div className="hidden md:block mt-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-cosmic-400 mb-1">Часы</label>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => handleTimeChange('hours', e.target.value)}
              placeholder="ЧЧ"
              className="w-full px-2 py-1 bg-space-800 border border-cosmic-500/20 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-cosmic-500"
            />
          </div>
          <div>
            <label className="block text-xs text-cosmic-400 mb-1">Минуты</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => handleTimeChange('minutes', e.target.value)}
              placeholder="ММ"
              className="w-full px-2 py-1 bg-space-800 border border-cosmic-500/20 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-cosmic-500"
            />
          </div>
        </div>
      </div>

      {helpText && (
        <p className="text-cosmic-400 text-xs mt-1">{helpText}</p>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

