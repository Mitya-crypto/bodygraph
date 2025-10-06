'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle, AlertCircle, Loader2, Navigation, X, RefreshCw } from 'lucide-react'
import { reverseGeocode, parseCoordinates, enhancedReverseGeocode } from '@/lib/reverseGeocoding'
import { Place } from '@/lib/places'
// Use API route to avoid "Load failed" error in Next.js 15
const searchCitiesHybrid = async (query: string, limit: number) => {
  try {
    const response = await fetch(`/api/search-cities?q=${encodeURIComponent(query)}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    return data.places || []
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}

interface SimpleBirthPlaceProps {
  values: {
    birthPlace: string
    birthCoordinates: string
  }
  errors: {
    birthPlace?: any
    birthCoordinates?: any
  }
  onChange: (field: 'birthPlace' | 'birthCoordinates', value: string) => void
  onValidationChange: (isValid: boolean) => void
  language: 'en' | 'ru'
}

export function SimpleBirthPlace({
  values,
  errors,
  onChange,
  onValidationChange,
  language
}: SimpleBirthPlaceProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [reverseGeocodingResult, setReverseGeocodingResult] = useState<Place | null>(null)
  const [autoComplete, setAutoComplete] = useState<string>('')
  const [cursorPosition, setCursorPosition] = useState<number>(0)

  const placeRef = useRef<HTMLInputElement>(null)
  const coordinatesRef = useRef<HTMLInputElement>(null)

  // Cache for search results with TTL
  const searchCache = useRef<Map<string, { data: Place[], timestamp: number }>>(new Map())
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  
  // Simple Levenshtein distance for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Debounced search for places
  useEffect(() => {
    if (!values.birthPlace || values.birthPlace.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      setIsValid(false)
      onValidationChange(false)
      return
    }

    // Don't search if a place is already selected
    if (selectedPlace) {
      return
    }

    const searchPlacesDebounced = async () => {
      setIsSearching(true)
      try {
        // Use hybrid API (Nominatim + MapBox)
        const places = await searchCitiesHybrid(values.birthPlace, 8)
        
        setSuggestions(places)
        setShowSuggestions(places.length > 0)
        
        // Set autocomplete suggestion
        if (places.length > 0 && values.birthPlace) {
          const topResult = places[0]
          const query = values.birthPlace.toLowerCase()
          const suggestion = topResult.name.toLowerCase()
          
          if (suggestion.startsWith(query) && suggestion !== query) {
            setAutoComplete(topResult.name)
          } else {
            setAutoComplete('')
          }
        } else {
          setAutoComplete('')
        }
        
        // Only mark as valid if we have a selected place or valid coordinates
        const hasValidCoords = values.birthCoordinates && /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(values.birthCoordinates.trim())
        const isValid = selectedPlace || hasValidCoords
        console.log('🔍 SimpleBirthPlace validation:', {
          selectedPlace: !!selectedPlace,
          hasValidCoords,
          isValid,
          birthCoordinates: values.birthCoordinates
        })
        onValidationChange(!!isValid)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
        setShowSuggestions(false)
        onValidationChange(false)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchPlacesDebounced, 300)
    return () => clearTimeout(timeoutId)
  }, [values.birthPlace, values.birthCoordinates, selectedPlace, onValidationChange])

  // Validate coordinates format and reverse geocode
  useEffect(() => {
    if (values.birthCoordinates) {
      const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/
      const isValidCoords = coordPattern.test(values.birthCoordinates.trim())
      setIsValid(isValidCoords)
      onValidationChange(isValidCoords)

      // If coordinates are valid, try reverse geocoding
      if (isValidCoords) {
        const coords = parseCoordinates(values.birthCoordinates)
        if (coords) {
          performReverseGeocoding(coords.lat, coords.lng)
        }
      }
    } else {
      setIsValid(false)
      onValidationChange(false)
      setReverseGeocodingResult(null)
    }
  }, [values.birthCoordinates, onValidationChange])

  // Perform reverse geocoding
  const performReverseGeocoding = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true)
    try {
      const result = await enhancedReverseGeocode(lat, lng)
      
      if (result.place && result.confidence > 0.3) {
        setReverseGeocodingResult(result.place)
        
        // Only auto-fill place name if it's completely empty
        if (!values.birthPlace) {
          onChange('birthPlace', result.place.name)
          setSelectedPlace(result.place)
          onValidationChange(true)
        }
      } else {
        setReverseGeocodingResult(null)
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      setReverseGeocodingResult(null)
    } finally {
      setIsReverseGeocoding(false)
    }
  }

  const handlePlaceChange = (value: string) => {
    onChange('birthPlace', value)
    // Only clear selected place if the field is completely empty
    if (!value.trim()) {
      setSelectedPlace(null)
      setAutoComplete('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      if (autoComplete && autoComplete.toLowerCase().startsWith(values.birthPlace.toLowerCase())) {
        e.preventDefault()
        onChange('birthPlace', autoComplete)
        setAutoComplete('')
        
        // Auto-select the top suggestion
        if (suggestions.length > 0) {
          handlePlaceSelect(suggestions[0])
        }
      }
    } else if (e.key === 'Escape') {
      setAutoComplete('')
      setShowSuggestions(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowSuggestions(true)
    }
  }

  const handlePlaceSelect = (place: Place) => {
    console.log('🔍 handlePlaceSelect called with:', place)
    onChange('birthPlace', place.name)
    onChange('birthCoordinates', `${place.coordinates.lat}, ${place.coordinates.lng}`)
    setSelectedPlace(place)
    setShowSuggestions(false)
    setSuggestions([]) // Очищаем список предложений
    setAutoComplete('') // Очищаем автозаполнение
    setIsValid(true)
    console.log('🔍 Setting validation to true for selected place')
    onValidationChange(true)
  }

  const handleCoordinatesChange = (value: string) => {
    onChange('birthCoordinates', value)
  }

  const handlePlaceFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handlePlaceBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleClearPlace = () => {
    onChange('birthPlace', '')
    setSelectedPlace(null)
    setSuggestions([])
    setShowSuggestions(false)
    onValidationChange(false)
  }

  const handleClearCoordinates = () => {
    onChange('birthCoordinates', '')
    setReverseGeocodingResult(null)
    setIsValid(false)
    onValidationChange(false)
  }

  const handleRefreshCoordinates = () => {
    if (values.birthCoordinates) {
      const coords = parseCoordinates(values.birthCoordinates)
      if (coords) {
        performReverseGeocoding(coords.lat, coords.lng)
      }
    }
  }

  const getFieldStatus = (field: 'birthPlace' | 'birthCoordinates') => {
    if (errors[field]) return 'error'
    if (field === 'birthPlace' && values.birthPlace && !selectedPlace) return 'warning'
    if (field === 'birthCoordinates' && values.birthCoordinates && isValid) return 'valid'
    if (field === 'birthCoordinates' && values.birthCoordinates && !isValid) return 'error'
    return ''
  }

  const getFieldIcon = (field: 'birthPlace' | 'birthCoordinates') => {
    if (isSearching && field === 'birthPlace') {
      return <Loader2 className="w-4 h-4 animate-spin text-cosmic-400" />
    }
    if (isReverseGeocoding && field === 'birthCoordinates') {
      return <Loader2 className="w-4 h-4 animate-spin text-cosmic-400" />
    }
    if (getFieldStatus(field) === 'valid') {
      return <CheckCircle className="w-4 h-4 text-green-400" />
    }
    if (getFieldStatus(field) === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-400" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Place Field */}
      <motion.div
        className="cosmic-input-group"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => placeRef.current?.focus()}
      >
        <label className="flex items-center gap-3 mb-3">
          <MapPin className="w-5 h-5 text-cosmic-400" />
          <span className="cosmic-subtitle">
            {language === 'ru' ? 'Место рождения' : 'Birth Place'}
          </span>
          {getFieldIcon('birthPlace')}
        </label>
        
        <div className="relative">
          <div className="relative">
            <input
              ref={placeRef}
              type="text"
              value={values.birthPlace}
              onChange={(e) => handlePlaceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handlePlaceFocus}
              onBlur={handlePlaceBlur}
              className={`cosmic-input w-full pr-10 relative z-10 bg-transparent ${getFieldStatus('birthPlace') === 'error' ? 'border-red-400' : getFieldStatus('birthPlace') === 'valid' ? 'border-green-400' : ''}`}
              placeholder={language === 'ru' ? 'Начните вводить: Москва, Лондон, Нью-Йорк...' : 'Start typing: Moscow, London, New York...'}
              autoComplete="off"
            />
            {/* Autocomplete suggestion overlay */}
            {autoComplete && autoComplete.toLowerCase().startsWith(values.birthPlace.toLowerCase()) && values.birthPlace && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="cosmic-input w-full pr-10 text-cosmic-500 flex">
                  <span className="invisible">{values.birthPlace}</span>
                  <span className="text-cosmic-600">{autoComplete.slice(values.birthPlace.length)}</span>
                </div>
              </div>
            )}
            
            {/* Autocomplete hint */}
            {autoComplete && autoComplete.toLowerCase().startsWith(values.birthPlace.toLowerCase()) && values.birthPlace && (
              <div className="absolute -bottom-6 left-0 text-xs text-cosmic-500">
                {language === 'ru' ? 'Нажмите Tab или → для автозаполнения' : 'Press Tab or → to autocomplete'}
              </div>
            )}
          </div>
          
          {/* Clear button for place */}
          {values.birthPlace && (
            <button
              type="button"
              onClick={handleClearPlace}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-400 hover:text-cosmic-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Place Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 w-full bg-space-800 border border-cosmic-700 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto cosmic-scrollbar"
              >
                {suggestions.map((place, index) => {
                  // Get place type icon and color
                  const getPlaceTypeInfo = (type: string) => {
                    switch (type) {
                      case 'city':
                        return { icon: '🏙️', label: 'Город', color: 'text-blue-400' }
                      case 'town':
                        return { icon: '🏘️', label: 'Город', color: 'text-green-400' }
                      case 'village':
                        return { icon: '🏡', label: 'Село', color: 'text-yellow-400' }
                      case 'municipality':
                        return { icon: '🏛️', label: 'Муниципалитет', color: 'text-purple-400' }
                      default:
                        return { icon: '📍', label: 'Место', color: 'text-gray-400' }
                    }
                  }
                  
                  const typeInfo = getPlaceTypeInfo(place.type)
                  const isTopResult = index === 0
                  
                  return (
                    <li
                      key={place.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-cosmic-700 text-cosmic-200 transition-colors border-b border-cosmic-800 last:border-b-0 ${
                        isTopResult ? 'bg-cosmic-800/50' : ''
                      }`}
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{typeInfo.icon}</span>
                          <MapPin className={`w-3 h-3 flex-shrink-0 ${typeInfo.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white flex items-center gap-2">
                            {place.name}
                            {isTopResult && (
                              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                                ⭐ Лучший
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${typeInfo.color.replace('text-', 'bg-').replace('-400', '-900/30')}`}>
                              {typeInfo.label}
                            </span>
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                              {place.id.startsWith('nominatim-') ? 'Nominatim' : 
                               place.id.startsWith('mapbox-') ? 'MapBox' : 'API'}
                            </span>
                          </div>
                          <div className="text-sm text-cosmic-400">
                            {place.state ? `${place.state}, ` : ''}{place.country}
                            {place.population && (
                              <span className="ml-2 text-xs text-cosmic-500">
                                👥 {place.population.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-cosmic-500 mt-1 flex items-center gap-2">
                            <span>📍 {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Выбрать
                        </div>
                      </div>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        
        {errors.birthPlace && (
          <p className="text-red-400 text-sm mt-2">{errors.birthPlace.message}</p>
        )}
        
        
        {isSearching && (
          <p className="text-cosmic-400 text-sm mt-2 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Поиск через Nominatim + MapBox APIs...
          </p>
        )}
        
        {isSearching && (
          <p className="text-xs text-cosmic-500 mt-1 ml-4">
            Объединяем результаты от обоих сервисов для максимальной точности
          </p>
        )}
        
        {selectedPlace && (
          <div className="text-green-400 text-sm mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>
                {language === 'ru' 
                  ? `Выбрано: ${selectedPlace.name}, ${selectedPlace.country} (Nominatim)` 
                  : `Selected: ${selectedPlace.name}, ${selectedPlace.country} (Nominatim)`
                }
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedPlace(null)
                onChange('birthCoordinates', '')
                onValidationChange(false)
              }}
              className="text-red-400 hover:text-red-300 text-xs underline"
            >
              {language === 'ru' ? 'Сбросить' : 'Reset'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Coordinates Field */}
      <motion.div
        className="cosmic-input-group"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.35 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => coordinatesRef.current?.focus()}
      >
        <label className="flex items-center gap-3 mb-3">
          <Navigation className="w-5 h-5 text-cosmic-400" />
          <span className="cosmic-subtitle">
            {language === 'ru' ? 'Координаты (широта, долгота)' : 'Coordinates (latitude, longitude)'}
          </span>
          {getFieldIcon('birthCoordinates')}
        </label>
        
        <div className="relative">
          <input
            ref={coordinatesRef}
            type="text"
            value={values.birthCoordinates}
            onChange={(e) => handleCoordinatesChange(e.target.value)}
            className={`cosmic-input w-full pr-20 ${getFieldStatus('birthCoordinates') === 'error' ? 'border-red-400' : getFieldStatus('birthCoordinates') === 'valid' ? 'border-green-400' : ''}`}
            placeholder={language === 'ru' ? '55.7558, 37.6176' : '55.7558, 37.6176'}
          />
          
          {/* Action buttons for coordinates */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            {values.birthCoordinates && isValid && (
              <button
                type="button"
                onClick={handleRefreshCoordinates}
                disabled={isReverseGeocoding}
                className="text-cosmic-400 hover:text-cosmic-300 transition-colors disabled:opacity-50"
                title={language === 'ru' ? 'Обновить поиск места' : 'Refresh location search'}
              >
                <RefreshCw className={`w-4 h-4 ${isReverseGeocoding ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {values.birthCoordinates && (
              <button
                type="button"
                onClick={handleClearCoordinates}
                className="text-cosmic-400 hover:text-cosmic-300 transition-colors"
                title={language === 'ru' ? 'Очистить координаты' : 'Clear coordinates'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {errors.birthCoordinates && (
          <p className="text-red-400 text-sm mt-2">{errors.birthCoordinates.message}</p>
        )}
        
        {values.birthCoordinates && !isValid && (
          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {language === 'ru' 
              ? 'Неверный формат координат. Используйте: широта, долгота' 
              : 'Invalid coordinates format. Use: latitude, longitude'
            }
          </p>
        )}
        
        <p className="text-cosmic-400 text-sm mt-2 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {language === 'ru' 
            ? 'Формат: широта, долгота (например: 55.7558, 37.6176)' 
            : 'Format: latitude, longitude (e.g.: 55.7558, 37.6176)'
          }
        </p>
        
        {/* Reverse geocoding result */}
        {reverseGeocodingResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-md"
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'ru' ? 'Найдено место:' : 'Found location:'}
              </span>
            </div>
            <div className="mt-1 text-sm text-cosmic-200">
              <div className="font-medium">{reverseGeocodingResult.name}</div>
              {reverseGeocodingResult.state && (
                <div className="text-cosmic-400">
                  {reverseGeocodingResult.state}, {reverseGeocodingResult.country}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {isReverseGeocoding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-cosmic-900/20 border border-cosmic-500/30 rounded-md"
          >
            <div className="flex items-center gap-2 text-cosmic-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                {language === 'ru' ? 'Поиск места по координатам...' : 'Searching location by coordinates...'}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
