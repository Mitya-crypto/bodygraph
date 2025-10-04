'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Globe, Building, Search, Filter, X } from 'lucide-react'
// import { searchCitiesWithFallback, convertGeoDBCityToPlace } from '@/lib/geodb'
import { Place } from '@/lib/places'

interface AdvancedPlaceSearchProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: Place) => void
  placeholder?: string
  className?: string
  language?: 'en' | 'ru'
}

interface SearchFilters {
  country: string
  region: string
  minPopulation: number
  maxPopulation: number
}

export function AdvancedPlaceSearch({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Enter location...',
  className = '',
  language = 'en'
}: AdvancedPlaceSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    country: '',
    region: '',
    minPopulation: 0,
    maxPopulation: 0
  })
  const [countries, setCountries] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Load countries and regions on mount
  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      // Mock countries - in real app, fetch from GeoDB API
      const mockCountries = [
        'Россия', 'США', 'Великобритания', 'Франция', 'Германия', 'Италия', 'Испания',
        'Китай', 'Япония', 'Индия', 'Бразилия', 'Канада', 'Австралия', 'Мексика',
        'Турция', 'Египет', 'ЮАР', 'Нигерия', 'Аргентина', 'Чили'
      ]
      setCountries(mockCountries)
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const loadRegions = async (country: string) => {
    try {
      // Mock regions based on country
      const mockRegions: { [key: string]: string[] } = {
        'Россия': ['Московская область', 'Ленинградская область', 'Краснодарский край', 'Свердловская область', 'Республика Татарстан'],
        'США': ['Калифорния', 'Техас', 'Флорида', 'Нью-Йорк', 'Пенсильвания'],
        'Великобритания': ['Англия', 'Шотландия', 'Уэльс', 'Северная Ирландия'],
        'Германия': ['Бавария', 'Северный Рейн-Вестфалия', 'Баден-Вюртемберг', 'Нижняя Саксония'],
        'Франция': ['Иль-де-Франс', 'Прованс-Альпы-Лазурный берег', 'Рона-Альпы', 'Овернь-Рона-Альпы']
      }
      setRegions(mockRegions[country] || [])
    } catch (error) {
      console.error('Error loading regions:', error)
    }
  }

  // Search places when value or filters change
  useEffect(() => {
    if (value.length >= 2) {
      setIsLoading(true)
      searchPlacesWithFilters(value, filters).then(result => {
        setSuggestions(result.places)
        setIsLoading(false)
        setSelectedIndex(-1)
      }).catch(error => {
        console.error('Search error:', error)
        setIsLoading(false)
      })
    } else {
      setSuggestions([])
    }
  }, [value, filters])

  const searchPlacesWithFilters = async (query: string, filters: SearchFilters) => {
    try {
      // const geoDBCities = await searchCitiesWithFallback(query, 10)
      let filteredCities: any[] = []

      // Apply filters
      if (filters.country) {
        filteredCities = filteredCities.filter(city => 
          city.country.toLowerCase().includes(filters.country.toLowerCase())
        )
      }
      
      if (filters.region) {
        filteredCities = filteredCities.filter(city => 
          city.region.toLowerCase().includes(filters.region.toLowerCase())
        )
      }
      
      if (filters.minPopulation > 0) {
        filteredCities = filteredCities.filter(city => 
          city.population >= filters.minPopulation
        )
      }
      
      if (filters.maxPopulation > 0) {
        filteredCities = filteredCities.filter(city => 
          city.population <= filters.maxPopulation
        )
      }

      // const places = filteredCities.map(convertGeoDBCityToPlace)
      const places: Place[] = []
      
      return {
        places,
        total: places.length,
        hasMore: false
      }
    } catch (error) {
      console.error('Search error:', error)
      return { places: [], total: 0, hasMore: false }
    }
  }

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
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    
    if (key === 'country') {
      setRegions([])
      if (value) {
        loadRegions(value as string)
      }
    }
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      country: '',
      region: '',
      minPopulation: 0,
      maxPopulation: 0
    })
    setRegions([])
  }

  // Format place for display
  const formatPlace = (place: Place): string => {
    if (place.state) {
      return `${place.name}, ${place.state}, ${place.country}`
    }
    return `${place.name}, ${place.country}`
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
      {/* Search Input */}
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
        
        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-space-700 rounded"
        >
          <Filter className={`w-4 h-4 ${showFilters ? 'text-cosmic-400' : 'text-space-400'}`} />
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-space-800 border border-space-600 rounded-xl mt-2 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="cosmic-subtitle text-sm">
                {language === 'ru' ? 'Фильтры поиска' : 'Search Filters'}
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-cosmic-400 hover:text-cosmic-300"
              >
                {language === 'ru' ? 'Очистить' : 'Clear'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Country Filter */}
              <div>
                <label className="block text-xs text-space-300 mb-1">
                  {language === 'ru' ? 'Страна' : 'Country'}
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="cosmic-input text-sm py-2"
                >
                  <option value="">
                    {language === 'ru' ? 'Выберите страну' : 'Select country'}
                  </option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-xs text-space-300 mb-1">
                  {language === 'ru' ? 'Регион/Область' : 'Region/State'}
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="cosmic-input text-sm py-2"
                  disabled={!filters.country}
                >
                  <option value="">
                    {language === 'ru' ? 'Выберите регион' : 'Select region'}
                  </option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Min Population */}
              <div>
                <label className="block text-xs text-space-300 mb-1">
                  {language === 'ru' ? 'Мин. население' : 'Min Population'}
                </label>
                <input
                  type="number"
                  value={filters.minPopulation || ''}
                  onChange={(e) => handleFilterChange('minPopulation', parseInt(e.target.value) || 0)}
                  className="cosmic-input text-sm py-2"
                  placeholder="0"
                />
              </div>

              {/* Max Population */}
              <div>
                <label className="block text-xs text-space-300 mb-1">
                  {language === 'ru' ? 'Макс. население' : 'Max Population'}
                </label>
                <input
                  type="number"
                  value={filters.maxPopulation || ''}
                  onChange={(e) => handleFilterChange('maxPopulation', parseInt(e.target.value) || 0)}
                  className="cosmic-input text-sm py-2"
                  placeholder="0"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions List */}
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
                        <Building className="w-3 h-3" />
                        <span>{getTimezoneDisplay(place)}</span>
                      </div>
                      
                      {place.population && (
                        <div className="flex items-center gap-1">
                          <Search className="w-3 h-3" />
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
                    ? 'Место не найдено. Попробуйте другой запрос или измените фильтры.' 
                    : 'No places found. Try a different search or adjust filters.'
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

