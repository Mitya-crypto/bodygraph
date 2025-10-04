'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Users, Globe } from 'lucide-react'
import { searchPlaces, formatPlace, Place } from '@/lib/places'

interface PlaceAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: Place) => void
  placeholder?: string
  className?: string
  language?: 'en' | 'ru'
}

export function PlaceAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Enter location...',
  className = '',
  language = 'en'
}: PlaceAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Search places when value changes
  useEffect(() => {
    if (value.length >= 2) {
      setIsLoading(true)
      setIsOpen(true)
      searchPlaces(value, 8).then(result => {
        setSuggestions(result.places)
        setIsLoading(false)
        setSelectedIndex(-1)
      }).catch(error => {
        console.error('Search error:', error)
        setIsLoading(false)
      })
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [value])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  // Handle place selection
  const handlePlaceSelect = (place: Place) => {
    const formattedPlace = formatPlace(place)
    onChange(formattedPlace)
    onPlaceSelect(place)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handlePlaceSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  // Get timezone display
  const getTimezoneDisplay = (place: Place) => {
    const offset = place.timezone.includes('Europe') ? '+3' : 
                  place.timezone.includes('America') ? '-5' :
                  place.timezone.includes('Asia') ? '+8' : '+0'
    return `UTC${offset}`
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`cosmic-input w-full ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-space-800 border border-space-600 rounded-xl mt-2 max-h-80 overflow-y-auto z-50 shadow-2xl"
          >
            {isLoading && (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-cosmic-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="cosmic-text text-sm">
                  {language === 'ru' ? 'Поиск мест...' : 'Searching places...'}
                </p>
              </div>
            )}


            {!isLoading && suggestions.map((place, index) => (
              <motion.button
                key={place.id}
                type="button"
                onClick={() => handlePlaceSelect(place)}
                className={`w-full text-left px-4 py-3 hover:bg-space-700 border-b border-space-600 last:border-b-0 transition-colors ${
                  selectedIndex === index ? 'bg-space-700' : ''
                }`}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cosmic-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="cosmic-text font-medium truncate">
                        {place.name}
                      </h4>
                      {place.population && place.population > 1000000 && (
                        <span className="text-xs bg-cosmic-500/20 text-cosmic-300 px-2 py-0.5 rounded">
                          {language === 'ru' ? 'Крупный город' : 'Major City'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-space-400">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{place.country}</span>
                        {place.state && <span>, {place.state}</span>}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimezoneDisplay(place)}</span>
                      </div>
                      
                      {place.population && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>
                            {place.population > 1000000 
                              ? `${(place.population / 1000000).toFixed(1)}M`
                              : `${(place.population / 1000).toFixed(0)}K`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}

            {suggestions.length === 0 && value.length >= 2 && !isLoading && (
              <div className="p-4 text-center">
                <MapPin className="w-8 h-8 text-space-500 mx-auto mb-2" />
                <p className="cosmic-text text-sm">
                  {language === 'ru' 
                    ? 'Место не найдено. Попробуйте другой запрос.' 
                    : 'No places found. Try a different search.'
                  }
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
