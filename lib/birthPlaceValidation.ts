// Birth place validation utility with GeoDB integration
// import { searchCitiesWithFallback, convertGeoDBCityToPlace } from './geodb'
import { Place } from './places'

export interface BirthPlaceData {
  country: string
  region: string
  city: string
}

export interface ValidationResult {
  isValid: boolean
  errors: {
    country?: string
    region?: string
    city?: string
    general?: string
  }
  suggestions?: {
    country?: string[]
    region?: string[]
    city?: string[]
  }
}

// Validate birth place data using GeoDB
export async function validateBirthPlace(data: BirthPlaceData, language: 'ru' | 'en' = 'ru'): Promise<ValidationResult> {
  const errors: ValidationResult['errors'] = {}
  const suggestions: ValidationResult['suggestions'] = {}

  try {
    // First, validate that all fields are filled
    if (!data.country.trim()) {
      errors.country = language === 'ru' ? 'Страна обязательна' : 'Country is required'
    }
    if (!data.region.trim()) {
      errors.region = language === 'ru' ? 'Регион обязателен' : 'Region is required'
    }
    if (!data.city.trim()) {
      errors.city = language === 'ru' ? 'Город обязателен' : 'City is required'
    }

    // If any field is empty, return early
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors }
    }

    // Search for the city in the specified country and region
    const searchQuery = `${data.city} ${data.region} ${data.country}`
    // const searchResults = await searchCitiesWithFallback(searchQuery, 10)
    const searchResults: any[] = []
    
    if (searchResults.length === 0) {
      // No results found, suggest alternatives
      // const cityOnlyResults = await searchCitiesWithFallback(data.city, 5)
      // const countryOnlyResults = await searchCitiesWithFallback(data.country, 5)
      const cityOnlyResults: any[] = []
      const countryOnlyResults: any[] = []
      
      errors.general = language === 'ru' 
        ? 'Место не найдено. Проверьте правильность ввода.'
        : 'Location not found. Please check your input.'
      
      if (cityOnlyResults.length > 0) {
        suggestions.city = cityOnlyResults.map(place => place.name)
      }
      if (countryOnlyResults.length > 0) {
        suggestions.country = Array.from(new Set(countryOnlyResults.map(place => place.country)))
      }
      
      return { isValid: false, errors, suggestions }
    }

    // Check if any result matches our criteria
    const matchingPlaces = searchResults.filter(place => {
      const countryMatch = place.country.toLowerCase().includes(data.country.toLowerCase()) ||
                          data.country.toLowerCase().includes(place.country.toLowerCase())
      
      const regionMatch = place.state?.toLowerCase().includes(data.region.toLowerCase()) ||
                         data.region.toLowerCase().includes(place.state?.toLowerCase() || '')
      
      const cityMatch = place.name.toLowerCase().includes(data.city.toLowerCase()) ||
                       data.city.toLowerCase().includes(place.name.toLowerCase())
      
      return countryMatch && regionMatch && cityMatch
    })

    if (matchingPlaces.length === 0) {
      // Found places but none match our criteria
      const countryMismatch = searchResults.some(place => 
        !place.country.toLowerCase().includes(data.country.toLowerCase()) &&
        !data.country.toLowerCase().includes(place.country.toLowerCase())
      )
      
      const regionMismatch = searchResults.some(place => 
        place.state && !place.state.toLowerCase().includes(data.region.toLowerCase()) &&
        !data.region.toLowerCase().includes(place.state.toLowerCase())
      )

      if (countryMismatch) {
        errors.country = language === 'ru' 
          ? 'Город не найден в указанной стране'
          : 'City not found in specified country'
        suggestions.country = Array.from(new Set(searchResults.map(place => place.country)))
      }
      
      if (regionMismatch) {
        errors.region = language === 'ru' 
          ? 'Город не найден в указанном регионе'
          : 'City not found in specified region'
        suggestions.region = Array.from(new Set(searchResults.map(place => place.state))).filter(Boolean)
      }

      return { isValid: false, errors, suggestions }
    }

    // Success - found matching places
    return { isValid: true, errors: {} }

  } catch (error) {
    console.error('Birth place validation error:', error)
    return {
      isValid: false,
      errors: {
        general: language === 'ru' 
          ? 'Ошибка проверки места рождения'
          : 'Error validating birth place'
      }
    }
  }
}

// Get suggestions for country based on partial input
export async function getCountrySuggestions(query: string, limit: number = 5): Promise<string[]> {
  try {
    // const results = await searchCitiesWithFallback(query, limit * 2)
    const results: any[] = []
    const countries = Array.from(new Set(results.map(place => place.country)))
    return countries.slice(0, limit)
  } catch (error) {
    console.error('Country suggestions error:', error)
    return []
  }
}

// Get suggestions for region based on country and partial input
export async function getRegionSuggestions(country: string, query: string, limit: number = 5): Promise<string[]> {
  try {
    // const results = await searchCitiesWithFallback(`${query} ${country}`, limit * 2)
    const results: any[] = []
    const regions = Array.from(new Set(results.map(place => place.state).filter(Boolean)))
    return regions.slice(0, limit)
  } catch (error) {
    console.error('Region suggestions error:', error)
    return []
  }
}

// Get suggestions for city based on country, region and partial input
export async function getCitySuggestions(country: string, region: string, query: string, limit: number = 5): Promise<string[]> {
  try {
    // const results = await searchCitiesWithFallback(`${query} ${region} ${country}`, limit * 2)
    const results: any[] = []
    const cities = Array.from(new Set(results.map(place => place.name)))
    return cities.slice(0, limit)
  } catch (error) {
    console.error('City suggestions error:', error)
    return []
  }
}

// Validate individual field as user types
export async function validateField(
  field: 'country' | 'region' | 'city',
  value: string,
  context: Partial<BirthPlaceData>,
  language: 'ru' | 'en' = 'ru'
): Promise<{ isValid: boolean; message?: string; suggestions?: string[] }> {
  
  if (!value.trim()) {
    return { isValid: false, message: language === 'ru' ? 'Поле обязательно' : 'Field is required' }
  }

  try {
    switch (field) {
      case 'country':
        const countrySuggestions = await getCountrySuggestions(value, 3)
        return { 
          isValid: countrySuggestions.length > 0, 
          suggestions: countrySuggestions,
          message: countrySuggestions.length === 0 
            ? (language === 'ru' ? 'Страна не найдена' : 'Country not found')
            : undefined
        }
      
      case 'region':
        if (!context.country) {
          return { isValid: false, message: language === 'ru' ? 'Сначала выберите страну' : 'Select country first' }
        }
        const regionSuggestions = await getRegionSuggestions(context.country, value, 3)
        return { 
          isValid: regionSuggestions.length > 0, 
          suggestions: regionSuggestions,
          message: regionSuggestions.length === 0 
            ? (language === 'ru' ? 'Регион не найден в этой стране' : 'Region not found in this country')
            : undefined
        }
      
      case 'city':
        if (!context.country || !context.region) {
          return { isValid: false, message: language === 'ru' ? 'Сначала выберите страну и регион' : 'Select country and region first' }
        }
        const citySuggestions = await getCitySuggestions(context.country, context.region, value, 3)
        return { 
          isValid: citySuggestions.length > 0, 
          suggestions: citySuggestions,
          message: citySuggestions.length === 0 
            ? (language === 'ru' ? 'Город не найден в этом регионе' : 'City not found in this region')
            : undefined
        }
      
      default:
        return { isValid: true }
    }
  } catch (error) {
    console.error('Field validation error:', error)
    return { 
      isValid: false, 
      message: language === 'ru' ? 'Ошибка проверки' : 'Validation error' 
    }
  }
}

