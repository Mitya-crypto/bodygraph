// Reverse geocoding utility
import { Place } from './places'
import { reverseGeocodePhoton } from './photon'

export interface ReverseGeocodingResult {
  place: Place | null
  confidence: number
  error?: string
}

// Simple reverse geocoding using our local places database
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodingResult> {
  try {
    // Import places data
    // const { GLOBAL_PLACES } = await import('./places')
    const GLOBAL_PLACES: any[] = []
    
    if (!GLOBAL_PLACES || GLOBAL_PLACES.length === 0) {
      return {
        place: null,
        confidence: 0,
        error: 'Places database not available'
      }
    }

    // Find the closest place using simple distance calculation
    let closestPlace: Place | null = null
    let minDistance = Infinity
    let confidence = 0

    for (const place of GLOBAL_PLACES) {
      const distance = calculateDistance(lat, lng, place.coordinates.lat, place.coordinates.lng)
      
      if (distance < minDistance) {
        minDistance = distance
        closestPlace = place
      }
    }

    // Calculate confidence based on distance
    if (closestPlace && minDistance < 50) { // Within 50km
      confidence = Math.max(0, 1 - (minDistance / 50))
    } else if (closestPlace && minDistance < 200) { // Within 200km
      confidence = Math.max(0, 0.5 - (minDistance / 400))
    } else {
      confidence = 0
    }

    return {
      place: closestPlace,
      confidence,
      error: confidence < 0.3 ? 'No nearby places found' : undefined
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return {
      place: null,
      confidence: 0,
      error: 'Reverse geocoding failed'
    }
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Parse coordinates from string
export function parseCoordinates(coordsString: string): { lat: number; lng: number } | null {
  try {
    const trimmed = coordsString.trim()
    const parts = trimmed.split(/[,\s]+/)
    
    if (parts.length !== 2) {
      return null
    }

    const lat = parseFloat(parts[0])
    const lng = parseFloat(parts[1])

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return null
    }

    if (lat < -90 || lat > 90) {
      return null
    }

    if (lng < -180 || lng > 180) {
      return null
    }

    return { lat, lng }
  } catch (error) {
    return null
  }
}

// Enhanced reverse geocoding with multiple strategies
export async function enhancedReverseGeocode(lat: number, lng: number): Promise<ReverseGeocodingResult> {
  try {
    // First try Photon API
    const photonPlace = await reverseGeocodePhoton(lat, lng)
    
    if (photonPlace) {
      return {
        place: photonPlace,
        confidence: 0.8, // Photon is generally reliable
        error: undefined
      }
    }

    // If Photon doesn't have results, try our local database
    const localResult = await reverseGeocode(lat, lng)
    
    if (localResult.confidence > 0.7) {
      return localResult
    }

    // If local database doesn't have good results, try to create a generic place
    const genericPlace: Place = {
      id: `generic_${lat}_${lng}`,
      name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      country: 'Unknown',
      coordinates: { lat, lng },
      timezone: 'UTC',
      type: 'settlement'
    }

    return {
      place: genericPlace,
      confidence: 0.5,
      error: 'Using approximate location'
    }
  } catch (error) {
    console.error('Enhanced reverse geocoding error:', error)
    return {
      place: null,
      confidence: 0,
      error: 'Reverse geocoding failed'
    }
  }
}
