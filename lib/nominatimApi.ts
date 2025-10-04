/**
 * Nominatim API integration for global city search
 * Free alternative to Yandex for Russian cities
 * Based on OpenStreetMap data with excellent coverage
 */

export interface NominatimPlace {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon?: string
  address?: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    state?: string
    region?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export interface Place {
  id: string
  name: string
  country: string
  state?: string
  coordinates: {
    lat: number
    lng: number
  }
  timezone: string
  population?: number
  type: 'city' | 'town' | 'village' | 'settlement'
}

/**
 * Search cities using Nominatim API (OpenStreetMap)
 * Excellent free alternative for Russian cities
 */
export async function searchCitiesNominatim(query: string, limit: number = 10): Promise<Place[]> {
  if (!query || query.length < 2) return []

  try {
    console.log(`🔍 Nominatim: Searching for "${query}"`)
    
    const encodedQuery = encodeURIComponent(query)
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodedQuery}&` +
      `format=json&` +
      `addressdetails=1&` +
      `limit=${limit}&` +
      // No country restriction for global search
      `featuretype=city,town,village&` +
      `accept-language=ru,en&` +
      `email=your-email@example.com&` + // Required for Nominatim
      `dedupe=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BodyGraph/1.0 (your-email@example.com)',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`❌ Nominatim API error: ${response.status}`)
      return []
    }

    const data: NominatimPlace[] = await response.json()
    
    const places: Place[] = data
      .filter(place => {
        // Filter for cities, towns, villages
        return ['city', 'town', 'village', 'municipality'].includes(place.class) &&
               place.lat && place.lon
      })
      .map(place => {
        // Extract city name
        let cityName = place.display_name.split(',')[0]
        if (place.address?.city) {
          cityName = place.address.city
        } else if (place.address?.town) {
          cityName = place.address.town
        } else if (place.address?.village) {
          cityName = place.address.village
        }

        // Extract country and state
        let country = 'Unknown'
        let state: string | undefined

        if (place.address?.country) {
          country = place.address.country
        }
        if (place.address?.state || place.address?.region) {
          state = place.address.state || place.address.region
        }

        // Determine place type
        let type: 'city' | 'town' | 'village' | 'settlement' = 'city'
        if (place.class === 'village') {
          type = 'village'
        } else if (place.class === 'town') {
          type = 'town'
        } else if (place.class === 'municipality') {
          type = 'settlement'
        }

        return {
          id: `nominatim-${place.place_id}`,
          name: cityName,
          country: country,
          state: state,
          coordinates: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          },
          timezone: getTimezoneForCoordinates(parseFloat(place.lat), parseFloat(place.lon)),
          type
        }
      })

    console.log(`✅ Nominatim returned ${places.length} results`)
    return places

  } catch (error) {
    console.error('❌ Nominatim API error:', error)
    return []
  }
}

/**
 * Simple timezone detection based on coordinates
 */
function getTimezoneForCoordinates(lat: number, lng: number): string {
  // Simple timezone mapping for Russia and CIS
  if (lng >= 19 && lng < 40) return 'Europe/Moscow'        // Moscow time
  if (lng >= 40 && lng < 55) return 'Europe/Samara'        // Samara time  
  if (lng >= 55 && lng < 70) return 'Asia/Yekaterinburg'   // Yekaterinburg time
  if (lng >= 70 && lng < 85) return 'Asia/Omsk'            // Omsk time
  if (lng >= 85 && lng < 100) return 'Asia/Krasnoyarsk'    // Krasnoyarsk time
  if (lng >= 100 && lng < 115) return 'Asia/Irkutsk'       // Irkutsk time
  if (lng >= 115 && lng < 130) return 'Asia/Yakutsk'       // Yakutsk time
  if (lng >= 130 && lng < 145) return 'Asia/Vladivostok'   // Vladivostok time
  if (lng >= 145) return 'Asia/Magadan'                    // Magadan time
  
  // For other CIS countries
  if (lng >= 20 && lng <= 40 && lat >= 44 && lat <= 52) return 'Europe/Kiev'     // Ukraine
  if (lng >= 23 && lng <= 33 && lat >= 53 && lat <= 57) return 'Europe/Minsk'    // Belarus
  if (lng >= 46 && lng <= 87 && lat >= 40 && lat <= 55) return 'Asia/Almaty'     // Kazakhstan
  
  return 'UTC' // Default fallback
}

/**
 * Check if query should use Nominatim (contains Cyrillic characters)
 */
export function shouldUseNominatim(query: string): boolean {
  return /[а-яё]/i.test(query)
}
