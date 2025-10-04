'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Globe } from 'lucide-react'
import { Place } from '@/lib/places'

interface PlaceMapProps {
  place: Place | null
  language?: 'en' | 'ru'
  className?: string
}

export function PlaceMap({ place, language = 'en', className = '' }: PlaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!place || !mapRef.current) return

    // Create Google Maps embed URL
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWDgvFgfh3_cw&q=${encodeURIComponent(place.name + ', ' + place.country)}&zoom=12`
    
    // Create iframe for Google Maps
    const iframe = document.createElement('iframe')
    iframe.src = embedUrl
    iframe.width = '100%'
    iframe.height = '200'
    iframe.frameBorder = '0'
    iframe.style.border = 'none'
    iframe.style.borderRadius = '12px'
    iframe.allowFullscreen = true
    iframe.loading = 'lazy'
    iframe.referrerPolicy = 'no-referrer-when-downgrade'

    // Clear previous content and add iframe
    mapRef.current.innerHTML = ''
    mapRef.current.appendChild(iframe)

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [place])

  if (!place) {
    return (
      <div className={`cosmic-card bg-space-800/50 ${className}`}>
        <div className="flex items-center justify-center h-48 text-space-500">
          <div className="text-center">
            <Globe className="w-12 h-12 mx-auto mb-3" />
            <p className="cosmic-text">
              {language === 'ru' 
                ? 'Выберите место для отображения карты' 
                : 'Select a place to show the map'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cosmic-card ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-cosmic-400" />
        <h3 className="cosmic-subtitle">
          {language === 'ru' ? 'Карта местоположения' : 'Location Map'}
        </h3>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden mb-4" />

      {/* Place Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cosmic-400" />
          <span className="cosmic-text text-sm">
            <strong>{place.name}</strong>
            {place.state && `, ${place.state}`}
            {`, ${place.country}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cosmic-400" />
          <span className="cosmic-text text-sm">
            {language === 'ru' ? 'Координаты' : 'Coordinates'}: 
            <span className="ml-1 font-mono">
              {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
            </span>
          </span>
        </div>

        {place.population && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cosmic-400" />
            <span className="cosmic-text text-sm">
              {language === 'ru' ? 'Население' : 'Population'}: 
              <span className="ml-1">
                {place.population.toLocaleString()}
              </span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 text-cosmic-400">🌍</span>
          <span className="cosmic-text text-sm">
            {language === 'ru' ? 'Часовой пояс' : 'Timezone'}: 
            <span className="ml-1 font-mono">{place.timezone}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + place.country)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 cosmic-button bg-cosmic-500 hover:bg-cosmic-600 text-white text-center py-2 px-4 text-sm"
        >
          {language === 'ru' ? 'Открыть в Google Maps' : 'Open in Google Maps'}
        </a>
        
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const distance = calculateDistance(
                  position.coords.latitude,
                  position.coords.longitude,
                  place.coordinates.lat,
                  place.coordinates.lng
                )
                alert(`${language === 'ru' ? 'Расстояние' : 'Distance'}: ${distance.toFixed(1)} km`)
              })
            }
          }}
          className="flex-1 cosmic-button bg-space-700 hover:bg-space-600 text-white text-center py-2 px-4 text-sm"
        >
          {language === 'ru' ? 'Расстояние' : 'Distance'}
        </button>
      </div>
    </motion.div>
  )
}

// Calculate distance between coordinates
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

