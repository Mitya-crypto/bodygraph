'use client'

import { useState } from 'react'

interface MobileDatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  label?: string
  error?: string
}

export function MobileDatePicker({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Выберите дату',
  label,
  error 
}: MobileDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || '')

  // Разбираем дату на компоненты
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { day: '', month: '', year: '' }
    const [year, month, day] = dateStr.split('-')
    return { day, month, year }
  }

  const { day, month, year } = parseDate(selectedDate)

  // Форматируем дату для отображения
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
    const current = parseDate(selectedDate)
    const updated = { ...current, [field]: value }
    
    if (updated.day && updated.month && updated.year) {
      const newDate = `${updated.year}-${updated.month.padStart(2, '0')}-${updated.day.padStart(2, '0')}`
      setSelectedDate(newDate)
      onChange(newDate)
    } else {
      setSelectedDate(`${updated.year}-${updated.month}-${updated.day}`)
    }
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSelectedDate(newValue)
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
          type="date"
          value={selectedDate}
          onChange={handleNativeChange}
          className="w-full px-4 py-3 bg-space-700 border border-cosmic-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent appearance-none"
          style={{
            colorScheme: 'dark',
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
        />
        
        {/* Кастомная стрелка для красоты */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className="w-5 h-5 text-cosmic-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>

      {/* Дополнительные элементы для десктопа */}
      <div className="hidden md:block mt-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-cosmic-400 mb-1">День</label>
            <input
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => handleDateChange('day', e.target.value)}
              placeholder="ДД"
              className="w-full px-2 py-1 bg-space-800 border border-cosmic-500/20 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-cosmic-500"
            />
          </div>
          <div>
            <label className="block text-xs text-cosmic-400 mb-1">Месяц</label>
            <select
              value={month}
              onChange={(e) => handleDateChange('month', e.target.value)}
              className="w-full px-2 py-1 bg-space-800 border border-cosmic-500/20 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-cosmic-500"
            >
              <option value="">ММ</option>
              <option value="01">Январь</option>
              <option value="02">Февраль</option>
              <option value="03">Март</option>
              <option value="04">Апрель</option>
              <option value="05">Май</option>
              <option value="06">Июнь</option>
              <option value="07">Июль</option>
              <option value="08">Август</option>
              <option value="09">Сентябрь</option>
              <option value="10">Октябрь</option>
              <option value="11">Ноябрь</option>
              <option value="12">Декабрь</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-cosmic-400 mb-1">Год</label>
            <input
              type="number"
              min="1900"
              max="2025"
              value={year}
              onChange={(e) => handleDateChange('year', e.target.value)}
              placeholder="ГГГГ"
              className="w-full px-2 py-1 bg-space-800 border border-cosmic-500/20 rounded text-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-cosmic-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

