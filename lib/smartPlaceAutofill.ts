// Smart bidirectional place autofill utility
// import { searchCitiesWithFallback, convertGeoDBCityToPlace } from './geodb'
import { getCountrySuggestions, getRegionSuggestions, getCitySuggestions } from './birthPlaceValidation'

export interface AutofillResult {
  country?: string
  region?: string
  city?: string
  confidence: number
}

// Russian region to country mapping
const RUSSIAN_REGIONS: { [key: string]: string } = {
  'Московская область': 'Россия',
  'Ленинградская область': 'Россия',
  'Новосибирская область': 'Россия',
  'Свердловская область': 'Россия',
  'Республика Татарстан': 'Россия',
  'Нижегородская область': 'Россия',
  'Челябинская область': 'Россия',
  'Самарская область': 'Россия',
  'Омская область': 'Россия',
  'Ростовская область': 'Россия',
  'Республика Башкортостан': 'Россия',
  'Красноярский край': 'Россия',
  'Воронежская область': 'Россия',
  'Пермский край': 'Россия',
  'Волгоградская область': 'Россия',
  'Краснодарский край': 'Россия',
  'Саратовская область': 'Россия',
  'Тюменская область': 'Россия',
  'Удмуртская Республика': 'Россия',
  'Алтайский край': 'Россия',
  'Ульяновская область': 'Россия',
  'Иркутская область': 'Россия',
  'Хабаровский край': 'Россия',
  'Ярославская область': 'Россия',
  'Приморский край': 'Россия',
  'Республика Дагестан': 'Россия',
  'Томская область': 'Россия',
  'Оренбургская область': 'Россия',
  'Кемеровская область': 'Россия',
  'Рязанская область': 'Россия',
  'Астраханская область': 'Россия',
  'Пензенская область': 'Россия',
  'Липецкая область': 'Россия',
  'Тульская область': 'Россия',
  'Кировская область': 'Россия',
  'Чувашская Республика': 'Россия',
  'Калининградская область': 'Россия',
  'Брянская область': 'Россия',
  'Курская область': 'Россия',
  'Тверская область': 'Россия',
  'Ставропольский край': 'Россия',
  'Ивановская область': 'Россия',
  'Белгородская область': 'Россия',
  'Архангельская область': 'Россия',
  'Владимирская область': 'Россия',
  'Курганская область': 'Россия',
  'Смоленская область': 'Россия',
  'Калужская область': 'Россия',
  'Забайкальский край': 'Россия',
  'Орловская область': 'Россия',
  'Вологодская область': 'Россия',
  'Мурманская область': 'Россия',
  'Ханты-Мансийский автономный округ': 'Россия',
  'Республика Северная Осетия': 'Россия',
  'Республика Мордовия': 'Россия',
  'Тамбовская область': 'Россия',
  'Чеченская Республика': 'Россия',
  'Республика Саха (Якутия)': 'Россия',
  'Костромская область': 'Россия',
  'Республика Карелия': 'Россия',
  'Кабардино-Балкарская Республика': 'Россия',
  'Республика Коми': 'Россия',
  'Амурская область': 'Россия',
  'Камчатский край': 'Россия',
  'Республика Хакасия': 'Россия',
  'Республика Марий Эл': 'Россия',
  'Севастополь': 'Россия',
  'Республика Крым': 'Россия'
}

// US state to country mapping
const US_STATES: { [key: string]: string } = {
  'New York': 'United States',
  'California': 'United States',
  'Illinois': 'United States',
  'Texas': 'United States',
  'Arizona': 'United States',
  'Pennsylvania': 'United States',
  'Florida': 'United States',
  'Ohio': 'United States',
  'North Carolina': 'United States',
  'Washington': 'United States',
  'Colorado': 'United States',
  'District of Columbia': 'United States',
  'Massachusetts': 'United States',
  'Tennessee': 'United States',
  'Michigan': 'United States',
  'Oklahoma': 'United States',
  'Oregon': 'United States',
  'Nevada': 'United States',
  'Kentucky': 'United States',
  'Maryland': 'United States',
  'Wisconsin': 'United States',
  'New Mexico': 'United States',
  'Minnesota': 'United States',
  'Nebraska': 'United States',
  'Louisiana': 'United States',
  'Kansas': 'United States',
  'Hawaii': 'United States',
  'Virginia': 'United States',
  'Indiana': 'United States',
  'Missouri': 'United States',
  'Georgia': 'United States',
  'Alabama': 'United States',
  'South Carolina': 'United States',
  'Connecticut': 'United States',
  'Iowa': 'United States',
  'Utah': 'United States',
  'Arkansas': 'United States',
  'Mississippi': 'United States',
  'New Jersey': 'United States',
  'West Virginia': 'United States',
  'New Hampshire': 'United States',
  'Idaho': 'United States',
  'Maine': 'United States',
  'Rhode Island': 'United States',
  'Montana': 'United States',
  'Delaware': 'United States',
  'South Dakota': 'United States',
  'North Dakota': 'United States',
  'Alaska': 'United States',
  'Vermont': 'United States',
  'Wyoming': 'United States'
}

// German state to country mapping
const GERMAN_STATES: { [key: string]: string } = {
  'Berlin': 'Germany',
  'Hamburg': 'Germany',
  'Bavaria': 'Germany',
  'North Rhine-Westphalia': 'Germany',
  'Hesse': 'Germany',
  'Baden-Württemberg': 'Germany',
  'Bremen': 'Germany',
  'Saxony': 'Germany',
  'Lower Saxony': 'Germany',
  'Schleswig-Holstein': 'Germany',
  'Saxony-Anhalt': 'Germany',
  'Rhineland-Palatinate': 'Germany',
  'Thuringia': 'Germany',
  'Brandenburg': 'Germany',
  'Saarland': 'Germany',
  'Mecklenburg-Vorpommern': 'Germany'
}

// Smart autofill based on input
export async function getSmartAutofill(
  input: string,
  currentCountry: string = '',
  currentRegion: string = '',
  currentCity: string = '',
  language: 'ru' | 'en' = 'ru'
): Promise<AutofillResult | null> {
  
  if (!input.trim()) return null
  
  const normalizedInput = input.trim()
  
  // Try to detect what the user is entering
  const result: AutofillResult = {
    confidence: 0
  }
  
  // 1. Check if input is a country
  if (await isCountryInput(normalizedInput)) {
    result.country = normalizedInput
    result.confidence = 0.9
    return result
  }
  
  // 2. Check if input is a region/state
  const regionResult = await detectRegionInput(normalizedInput, currentCountry)
  if (regionResult) {
    result.region = regionResult.region
    result.country = regionResult.country
    result.confidence = regionResult.confidence
    return result
  }
  
  // 3. Check if input is a city
  const cityResult = await detectCityInput(normalizedInput, currentCountry, currentRegion)
  if (cityResult) {
    result.city = cityResult.city
    result.region = cityResult.region
    result.country = cityResult.country
    result.confidence = cityResult.confidence
    return result
  }
  
  return null
}

// Check if input is a country
async function isCountryInput(input: string): Promise<boolean> {
  const countryNames = [
    'Россия', 'Russia', 'США', 'USA', 'United States', 'Германия', 'Germany',
    'Франция', 'France', 'Великобритания', 'United Kingdom', 'Италия', 'Italy',
    'Испания', 'Spain', 'Китай', 'China', 'Япония', 'Japan', 'Индия', 'India',
    'Бразилия', 'Brazil', 'Канада', 'Canada', 'Австралия', 'Australia'
  ]
  
  return countryNames.some(country => 
    country.toLowerCase().includes(input.toLowerCase()) ||
    input.toLowerCase().includes(country.toLowerCase())
  )
}

// Detect region input and suggest country
async function detectRegionInput(input: string, currentCountry: string): Promise<{ region: string; country: string; confidence: number } | null> {
  // Check Russian regions
  for (const [region, country] of Object.entries(RUSSIAN_REGIONS)) {
    if (region.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().includes(region.toLowerCase())) {
      return { region, country, confidence: 0.8 }
    }
  }
  
  // Check US states
  for (const [state, country] of Object.entries(US_STATES)) {
    if (state.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().includes(state.toLowerCase())) {
      return { region: state, country, confidence: 0.8 }
    }
  }
  
  // Check German states
  for (const [state, country] of Object.entries(GERMAN_STATES)) {
    if (state.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().includes(state.toLowerCase())) {
      return { region: state, country, confidence: 0.8 }
    }
  }
  
  return null
}

// Detect city input and suggest region and country
async function detectCityInput(input: string, currentCountry: string, currentRegion: string): Promise<{ city: string; region: string; country: string; confidence: number } | null> {
  try {
    // Use GeoDB API to find city
    // const searchResults = await searchCitiesWithFallback(input, 3)
    const searchResults: any[] = []
    
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0]
      return {
        city: bestMatch.name,
        region: bestMatch.region,
        country: bestMatch.country,
        confidence: 0.7
      }
    }
  } catch (error) {
    console.warn('City detection error:', error)
    // Return null instead of throwing to prevent crashes
  }
  
  return null
}

// Get suggestions for any field based on current values
export async function getSmartSuggestions(
  field: 'country' | 'region' | 'city',
  input: string,
  currentCountry: string = '',
  currentRegion: string = '',
  currentCity: string = '',
  language: 'ru' | 'en' = 'ru'
): Promise<string[]> {
  
  if (!input.trim()) return []
  
  try {
    if (field === 'country') {
      // Country suggestions
      return await getCountrySuggestions(input, 5)
    } else if (field === 'region') {
      // Region suggestions based on country
      if (currentCountry) {
        return await getRegionSuggestions(currentCountry, input, 5)
      }
      // If no country, try to detect from input
      const regionResult = await detectRegionInput(input, currentCountry)
      if (regionResult) {
        return [regionResult.region]
      }
    } else if (field === 'city') {
      // City suggestions based on country and region
      if (currentCountry && currentRegion) {
        return await getCitySuggestions(currentCountry, currentRegion, input, 5)
      } else if (currentCountry) {
        // Try to find city and suggest region
        const cityResult = await detectCityInput(input, currentCountry, currentRegion)
        if (cityResult) {
          return [cityResult.city]
        }
      }
    }
  } catch (error) {
    console.warn('Smart suggestions error:', error)
  }
  
  return []
}

