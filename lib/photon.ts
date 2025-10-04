// Photon API integration (OpenStreetMap + OpenSearch)
import safeAxios from './safeAxios'

// Photon API configuration
const PHOTON_API_BASE = 'https://photon.komoot.io/api'
const PHOTON_TIMEOUT = 5000

// Types for Photon API responses
export interface PhotonFeature {
  geometry: {
    coordinates: [number, number] // [lng, lat]
    type: string
  }
  type: string
  properties: {
    osm_id: number
    osm_type: string
    extent?: [number, number, number, number]
    country: string
    countrycode: string
    state?: string
    city?: string
    postcode?: string
    name: string
    housenumber?: string
    street?: string
    district?: string
    county?: string
    type: string
    importance?: number
  }
}

export interface PhotonResponse {
  type: string
  features: PhotonFeature[]
  properties: {
    attribution: string
    extent: [number, number, number, number]
    name: string
    osm_type: string
    osm_id: number
  }
}

export interface PhotonSearchParams {
  q: string
  limit?: number
  lat?: number
  lon?: number
  osm_tag?: string
  location_bias_scale?: number
  lang?: string
}

// Search places using Photon API
export async function searchPlacesPhoton(params: PhotonSearchParams): Promise<PhotonResponse> {
  try {
    const searchParams = new URLSearchParams()
    
    // Required parameters
    searchParams.append('q', params.q)
    
    // Optional parameters
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.lat) searchParams.append('lat', params.lat.toString())
    if (params.lon) searchParams.append('lon', params.lon.toString())
    if (params.osm_tag) searchParams.append('osm_tag', params.osm_tag)
    if (params.location_bias_scale) searchParams.append('location_bias_scale', params.location_bias_scale.toString())
    if (params.lang) searchParams.append('lang', params.lang)

    const response = await safeAxios.get(`${PHOTON_API_BASE}`, {
      params: searchParams,
      timeout: PHOTON_TIMEOUT
    })

    return response.data
  } catch (error) {
    console.warn('Photon API error:', error)
    throw new Error('Failed to fetch places from Photon API')
  }
}

// Convert Photon feature to our Place format
export function convertPhotonFeatureToPlace(feature: PhotonFeature): Place {
  const [lng, lat] = feature.geometry.coordinates
  
  return {
    id: `${feature.properties.osm_type}_${feature.properties.osm_id}`,
    name: feature.properties.name,
    country: feature.properties.country,
    state: feature.properties.state || feature.properties.county,
    coordinates: {
      lat,
      lng
    },
    timezone: 'UTC', // Photon doesn't provide timezone, we'll use UTC as default
    population: undefined, // Photon doesn't provide population data
    type: mapPhotonTypeToPlaceType(feature.properties.type)
  }
}

// Map Photon place types to our place types
function mapPhotonTypeToPlaceType(photonType: string): 'city' | 'town' | 'village' | 'settlement' {
  switch (photonType.toLowerCase()) {
    case 'city':
    case 'municipality':
      return 'city'
    case 'town':
    case 'suburb':
      return 'town'
    case 'village':
    case 'hamlet':
      return 'village'
    default:
      return 'settlement'
  }
}

// Search places with Photon API and fallback
export async function searchPlacesWithPhoton(query: string, limit: number = 10): Promise<Place[]> {
  try {
    // Try Photon API with simplified parameters
    const response = await searchPlacesPhoton({
      q: query,
      limit
    })
    
    // Convert Photon features to our Place format
    const places = response.features.map(convertPhotonFeatureToPlace)
    
    // Filter out low-quality results
    const filteredPlaces = places.filter(place => {
      // Only include places with proper names and coordinates
      return place.name && 
             place.name.length > 1 && 
             place.coordinates.lat && 
             place.coordinates.lng &&
             Math.abs(place.coordinates.lat) <= 90 &&
             Math.abs(place.coordinates.lng) <= 180
    })
    
    return filteredPlaces
  } catch (error) {
    console.warn('Photon API failed, using fallback data:', error)
    
    // Fallback to local mock data
    return getLocalFallbackPlaces(query, limit)
  }
}

// Local fallback data (simplified version)
function getLocalFallbackPlaces(query: string, limit: number): Place[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  const fallbackPlaces: Place[] = [
    // Russia
    {
      id: 'moscow',
      name: 'Москва',
      country: 'Россия',
      state: 'Московская область',
      coordinates: { lat: 55.7558, lng: 37.6176 },
      timezone: 'Europe/Moscow',
      population: 12615000,
      type: 'city'
    },
    {
      id: 'spb',
      name: 'Санкт-Петербург',
      country: 'Россия',
      state: 'Ленинградская область',
      coordinates: { lat: 59.9311, lng: 30.3609 },
      timezone: 'Europe/Moscow',
      population: 5383000,
      type: 'city'
    },
    {
      id: 'perm',
      name: 'Пермь',
      country: 'Россия',
      state: 'Пермский край',
      coordinates: { lat: 58.0105, lng: 56.2502 },
      timezone: 'Asia/Yekaterinburg',
      population: 1051000,
      type: 'city'
    },
    {
      id: 'oktyabrsky',
      name: 'Октябрьский',
      country: 'Россия',
      state: 'Пермский край',
      coordinates: { lat: 56.5167, lng: 56.8833 },
      timezone: 'Asia/Yekaterinburg',
      population: 15000,
      type: 'settlement'
    },
    {
      id: 'oktyabrsky-pos',
      name: 'пос. Октябрьский',
      country: 'Россия',
      state: 'Пермский край',
      coordinates: { lat: 56.5167, lng: 56.8833 },
      timezone: 'Asia/Yekaterinburg',
      population: 15000,
      type: 'settlement'
    },
    // USA
    {
      id: 'newyork',
      name: 'New York',
      country: 'United States',
      state: 'New York',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      timezone: 'America/New_York',
      population: 8336817,
      type: 'city'
    },
    {
      id: 'losangeles',
      name: 'Los Angeles',
      country: 'United States',
      state: 'California',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      timezone: 'America/Los_Angeles',
      population: 3979576,
      type: 'city'
    },
    // Europe
    {
      id: 'london',
      name: 'London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      timezone: 'Europe/London',
      population: 8982000,
      type: 'city'
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      timezone: 'Europe/Paris',
      population: 2161000,
      type: 'city'
    },
    {
      id: 'berlin',
      name: 'Berlin',
      country: 'Germany',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      timezone: 'Europe/Berlin',
      population: 3669491,
      type: 'city'
    }
  ]
  
  // Filter by query with improved matching
  const filtered = fallbackPlaces.filter(place => {
    const name = place.name.toLowerCase()
    const country = place.country.toLowerCase()
    const state = place.state ? place.state.toLowerCase() : ''
    
    // Различные варианты поиска для российских населенных пунктов
    const queryVariants = [
      normalizedQuery,
      normalizedQuery.replace(/пос\./g, 'поселок'),
      normalizedQuery.replace(/поселок/g, 'пос.'),
      normalizedQuery.replace(/п\./g, 'поселок'),
      normalizedQuery.replace(/пгт/g, 'поселок городского типа'),
      normalizedQuery.replace(/с\./g, 'село'),
      normalizedQuery.replace(/д\./g, 'деревня'),
    ]
    
    // Проверяем все варианты
    return queryVariants.some(variant => {
      // Check if query matches any part of the name
      const nameWords = name.split(/[\s\-_]+/) // Split by spaces, hyphens, underscores
      const queryWords = variant.split(/[\s\-_]+/)
      
      // Check if all query words are found in name words
      const nameMatch = queryWords.every(queryWord => 
        nameWords.some(nameWord => nameWord.includes(queryWord))
      )
      
      // Also check direct includes
      const directMatch = name.includes(variant) ||
        country.includes(variant) ||
        state.includes(variant)
      
      return nameMatch || directMatch
    })
  })

  return filtered.slice(0, limit)
}

// Reverse geocoding using Photon
export async function reverseGeocodePhoton(lat: number, lng: number): Promise<Place | null> {
  try {
    // Use a simple coordinate-based search
    const response = await searchPlacesPhoton({
      q: `${lat.toFixed(4)},${lng.toFixed(4)}`,
      limit: 1
    })
    
    if (response.features.length > 0) {
      const place = convertPhotonFeatureToPlace(response.features[0])
      
      // Validate the result
      if (place.name && place.coordinates.lat && place.coordinates.lng) {
        return place
      }
    }
    
    return null
  } catch (error) {
    console.error('Photon reverse geocoding error:', error)
    return null
  }
}

// Import Place type from places.ts
import { Place } from './places'
