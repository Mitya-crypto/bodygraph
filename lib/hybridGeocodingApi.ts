/**
 * Hybrid Geocoding API that combines Nominatim and MapBox
 * - Nominatim for Russian/Cyrillic queries (unlimited, excellent for Russia/CIS)
 * - MapBox for international/Latin queries (100k requests/month, global coverage)
 */

import { searchCitiesNominatim, shouldUseNominatim } from './nominatimApi'
import { searchCitiesMapBox, shouldUseMapBox } from './mapboxApi'

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
 * Smart hybrid city search that automatically chooses the best API
 */
export async function searchCitiesHybrid(query: string, limit: number = 10): Promise<Place[]> {
  if (!query || query.length < 2) return []

  const trimmedQuery = query.trim()
  
  try {
    // Always use both APIs for maximum accuracy and coverage
    console.log(`🔄 Searching with both Nominatim and MapBox APIs for: "${trimmedQuery}"`)
    
    const [nominatimResults, mapboxResults] = await Promise.allSettled([
      searchCitiesNominatim(trimmedQuery, limit),
      searchCitiesMapBox(trimmedQuery, limit)
    ])
    
    const allResults: Place[] = []
    
    // Collect results from Nominatim
    if (nominatimResults.status === 'fulfilled') {
      console.log(`✅ Nominatim returned ${nominatimResults.value.length} results`)
      allResults.push(...nominatimResults.value)
    } else {
      console.warn(`⚠️ Nominatim failed:`, nominatimResults.reason)
    }
    
    // Collect results from MapBox
    if (mapboxResults.status === 'fulfilled') {
      console.log(`✅ MapBox returned ${mapboxResults.value.length} results`)
      allResults.push(...mapboxResults.value)
    } else {
      console.warn(`⚠️ MapBox failed:`, mapboxResults.reason)
    }
    
    if (allResults.length === 0) {
      console.log(`❌ No results from any API for: "${trimmedQuery}"`)
      return []
    }
    
    // Remove duplicates based on coordinates proximity
    const uniqueResults = removeDuplicates(allResults)
    
    // Sort by relevance and query language preference
    const sortedResults = sortByRelevanceAndSource(uniqueResults, trimmedQuery)
    
    console.log(`🎯 Returning ${Math.min(sortedResults.length, limit)} combined results`)
    return sortedResults.slice(0, limit)
    
    } catch (error) {
    console.error('❌ Hybrid geocoding error:', error)
    return []
  }
}

/**
 * Remove duplicate places based on coordinate proximity
 */
function removeDuplicates(places: Place[]): Place[] {
  const unique: Place[] = []
  
  for (const place of places) {
    const isDuplicate = unique.some(existing => {
      const latDiff = Math.abs(existing.coordinates.lat - place.coordinates.lat)
      const lngDiff = Math.abs(existing.coordinates.lng - place.coordinates.lng)
      return latDiff < 0.01 && lngDiff < 0.01 // ~1km tolerance
    })
    
    if (!isDuplicate) {
      unique.push(place)
    }
  }
  
  return unique
}

/**
 * Sort places by relevance to the query and prefer appropriate source
 */
function sortByRelevanceAndSource(places: Place[], query: string): Place[] {
  const queryLower = query.toLowerCase()
  const hasRussianChars = /[а-яё]/i.test(query)
  
  return places.sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()
    
    // Calculate base relevance score
    const getRelevanceScore = (name: string) => {
      if (name === queryLower) return 1000
      if (name.startsWith(queryLower)) return 500
      if (name.includes(queryLower)) return 250
      return 0
    }
    
    let aScore = getRelevanceScore(aName)
    let bScore = getRelevanceScore(bName)
    
    // Boost score based on source preference for query language
    if (hasRussianChars) {
      // For Russian queries, prefer Nominatim results
      if (a.id.startsWith('nominatim-')) aScore += 100
      if (b.id.startsWith('nominatim-')) bScore += 100
    } else {
      // For Latin queries, prefer MapBox results
      if (a.id.startsWith('mapbox-')) aScore += 100
      if (b.id.startsWith('mapbox-')) bScore += 100
    }
    
    // Boost by place type
    const typeOrder = { city: 50, town: 30, settlement: 20, village: 10 }
    aScore += typeOrder[a.type] || 0
    bScore += typeOrder[b.type] || 0
    
    // Boost by population if available
    if (a.population) aScore += Math.min(a.population / 100000, 50)
    if (b.population) bScore += Math.min(b.population / 100000, 50)
    
    // Compare final scores
    if (aScore !== bScore) return bScore - aScore
    
    // Alphabetical as final tiebreaker
    return aName.localeCompare(bName)
  })
}

/**
 * Legacy function for backward compatibility
 */
function sortByRelevance(places: Place[], query: string): Place[] {
  return sortByRelevanceAndSource(places, query)
}

/**
 * Get API status for debugging
 */
export function getApiStatus() {
  return {
    nominatim: {
      available: true, // Nominatim is always available (free)
      key: 'Free (OpenStreetMap)'
    },
    mapbox: {
      available: !!process.env.MAPBOX_ACCESS_TOKEN,
      key: process.env.MAPBOX_ACCESS_TOKEN ? '***' + process.env.MAPBOX_ACCESS_TOKEN.slice(-4) : 'Not set'
    }
  }
}