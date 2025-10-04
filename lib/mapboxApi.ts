/**
 * MapBox Geocoding API v6 integration for international city search
 * Provides excellent global coverage with 100k free requests/month
 * Uses the latest v6 API with improved accuracy and features
 */

export interface MapBoxFeature {
  id: string
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    mapbox_id: string
    feature_type: string
    name: string
    name_preferred?: string
    place_formatted: string
    full_address?: string
    coordinates: {
      longitude: number
      latitude: number
      accuracy?: string
    }
    context?: {
      country?: {
        mapbox_id: string
        name: string
        country_code: string
        country_code_alpha_3: string
      }
      region?: {
        mapbox_id: string
        name: string
        region_code?: string
        region_code_full?: string
      }
      place?: {
        mapbox_id: string
        name: string
        wikidata_id?: string
      }
      locality?: {
        mapbox_id: string
        name: string
        wikidata_id?: string
      }
      neighborhood?: {
        mapbox_id: string
        name: string
      }
    }
  }
}

export interface MapBoxResponse {
  type: 'FeatureCollection'
  features: MapBoxFeature[]
  attribution: string
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
 * Search international cities using MapBox Geocoding API v6
 */
export async function searchCitiesMapBox(query: string, limit: number = 10): Promise<Place[]> {
  if (!query || query.length < 2) return []

  try {
    console.log(`🔍 MapBox v6: Searching for "${query}"`)
    
    // Check if API token is available
    const accessToken = process.env.MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      console.warn('⚠️ MapBox access token not configured')
      return []
    }
    
    const encodedQuery = encodeURIComponent(query)
    
    // Use MapBox Geocoding API v6
    const url = `https://api.mapbox.com/search/geocode/v6/forward?` +
      `q=${encodedQuery}&` +
      `access_token=${accessToken}&` +
      `limit=${limit}&` +
      `types=place&` + // Only places (cities, towns, villages)
      `language=ru,en&` +
      `autocomplete=true`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ MapBox API: Invalid access token (401)')
      } else if (response.status === 429) {
        console.error('❌ MapBox API: Rate limit exceeded (429)')
      } else {
        console.error(`❌ MapBox API error: ${response.status}`)
      }
      return []
    }

    const data: MapBoxResponse = await response.json()
    
    const places: Place[] = data.features
      .filter(feature => {
        // Filter for places only
        return feature.properties.feature_type === 'place' && 
               feature.geometry?.coordinates &&
               feature.properties.coordinates
      })
      .map(feature => {
        // Extract country and state from context
        let country = 'Unknown'
        let state: string | undefined

        if (feature.properties.context) {
          const context = feature.properties.context
          if (context.country) {
            country = context.country.name
          }
          if (context.region) {
            state = context.region.name
          }
        }

        // Determine place type based on feature_type
        let type: 'city' | 'town' | 'village' | 'settlement' = 'city'
        if (feature.properties.feature_type === 'locality') {
          type = 'village'
        } else if (feature.properties.feature_type === 'district') {
          type = 'town'
        }

        return {
          id: `mapbox-${feature.properties.mapbox_id}`,
          name: feature.properties.name,
          country: country,
          state: state,
          coordinates: {
            lat: feature.properties.coordinates.latitude,
            lng: feature.properties.coordinates.longitude
          },
          timezone: getTimezoneForCoordinates(
            feature.properties.coordinates.latitude, 
            feature.properties.coordinates.longitude
          ),
          type
        }
      })

    console.log(`✅ MapBox v6 returned ${places.length} results`)
    return places

  } catch (error) {
    console.error('❌ MapBox API error:', error)
    return []
  }
}

/**
 * Simple timezone detection based on coordinates
 */
function getTimezoneForCoordinates(lat: number, lng: number): string {
  // Simple timezone mapping for major regions
  if (lng >= -180 && lng < -120) return 'America/Los_Angeles'    // Pacific
  if (lng >= -120 && lng < -60) return 'America/New_York'        // Eastern
  if (lng >= -60 && lng < 0) return 'Europe/London'              // GMT
  if (lng >= 0 && lng < 30) return 'Europe/Berlin'               // CET
  if (lng >= 30 && lng < 60) return 'Europe/Moscow'              // MSK
  if (lng >= 60 && lng < 90) return 'Asia/Kolkata'               // IST
  if (lng >= 90 && lng < 120) return 'Asia/Shanghai'             // CST
  if (lng >= 120 && lng < 150) return 'Asia/Tokyo'               // JST
  if (lng >= 150 && lng <= 180) return 'Pacific/Auckland'        // NZST
  
  return 'UTC' // Default fallback
}

/**
 * Check if query should use MapBox (contains Latin characters)
 */
export function shouldUseMapBox(query: string): boolean {
  return /[a-z]/i.test(query) && !/[а-яё]/i.test(query)
}