// Astrology calculations using Swiss Ephemeris
import { format, parseISO, isValid } from 'date-fns'

export interface AstrologyResult {
  sun: {
    sign: string
    degree: number
    house: number
  }
  moon: {
    sign: string
    degree: number
    house: number
  }
  ascendant: {
    sign: string
    degree: number
  }
  planets: Array<{
    name: string
    sign: string
    degree: number
    house: number
    retrograde: boolean
  }>
  houses: Array<{
    number: number
    sign: string
    degree: number
    cusp: number
  }>
  aspects: Array<{
    planet1: string
    planet2: string
    type: string
    degree: number
    orb: number
  }>
}

// Zodiac signs
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

// Planet names
const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto'
]

// Aspect types
const ASPECTS = [
  { name: 'Conjunction', degree: 0, orb: 8 },
  { name: 'Sextile', degree: 60, orb: 6 },
  { name: 'Square', degree: 90, orb: 8 },
  { name: 'Trine', degree: 120, orb: 8 },
  { name: 'Opposition', degree: 180, orb: 8 }
]

function degreesToSign(degrees: number): string {
  return ZODIAC_SIGNS[Math.floor(degrees / 30)]
}

function degreesToHouse(degrees: number, ascendant: number): number {
  const houseSize = 30
  const adjustedDegrees = (degrees - ascendant + 360) % 360
  return Math.floor(adjustedDegrees / houseSize) + 1
}

function calculateAspects(planets: Array<{ name: string, degree: number }>): Array<{
  planet1: string
  planet2: string
  type: string
  degree: number
  orb: number
}> {
  const aspects: Array<{
    planet1: string
    planet2: string
    type: string
    degree: number
    orb: number
  }> = []

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]
      const degreeDiff = Math.abs(planet1.degree - planet2.degree)
      const actualDegree = Math.min(degreeDiff, 360 - degreeDiff)

      for (const aspect of ASPECTS) {
        const orb = Math.abs(actualDegree - aspect.degree)
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspect.name,
            degree: actualDegree,
            orb: orb
          })
        }
      }
    }
  }

  return aspects
}

// Mock astrology calculation (in real app, use Swiss Ephemeris)
export async function calculateAstrology(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number
): Promise<AstrologyResult> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Parse birth date and time with proper validation
  const birthDateTime = new Date(`${birthDate}T${birthTime || '12:00'}`)
  
  if (!isValid(birthDateTime)) {
    throw new Error('Invalid birth date or time provided')
  }
  
  const day = birthDateTime.getDate()
  const month = birthDateTime.getMonth() + 1
  const year = birthDateTime.getFullYear()
  const hour = birthDateTime.getHours()
  const minute = birthDateTime.getMinutes()
  
  // Generate consistent results based on birth date
  const seed = day + month + year
  
  // Mock planetary positions
  const sunDegree = (month - 1) * 30 + day + (seed % 30)
  const moonDegree = (day * 13) % 360
  const ascendantDegree = (hour * 15 + longitude) % 360
  
  const planets = [
    { name: 'Sun', degree: sunDegree },
    { name: 'Moon', degree: moonDegree },
    { name: 'Mercury', degree: (sunDegree + 20) % 360 },
    { name: 'Venus', degree: (sunDegree + 45) % 360 },
    { name: 'Mars', degree: (sunDegree + 90) % 360 },
    { name: 'Jupiter', degree: (sunDegree + 120) % 360 },
    { name: 'Saturn', degree: (sunDegree + 180) % 360 },
    { name: 'Uranus', degree: (sunDegree + 240) % 360 },
    { name: 'Neptune', degree: (sunDegree + 300) % 360 },
    { name: 'Pluto', degree: (sunDegree + 330) % 360 }
  ]
  
  // Calculate houses (simplified)
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: degreesToSign(ascendantDegree + i * 30),
    degree: (ascendantDegree + i * 30) % 360,
    cusp: ascendantDegree + i * 30
  }))
  
  // Calculate aspects
  const aspects = calculateAspects(planets)
  
  return {
    sun: {
      sign: degreesToSign(sunDegree),
      degree: sunDegree % 30,
      house: degreesToHouse(sunDegree, ascendantDegree)
    },
    moon: {
      sign: degreesToSign(moonDegree),
      degree: moonDegree % 30,
      house: degreesToHouse(moonDegree, ascendantDegree)
    },
    ascendant: {
      sign: degreesToSign(ascendantDegree),
      degree: ascendantDegree % 30
    },
    planets: planets.map(planet => ({
      name: planet.name,
      sign: degreesToSign(planet.degree),
      degree: planet.degree % 30,
      house: degreesToHouse(planet.degree, ascendantDegree),
      retrograde: Math.random() < 0.1 // 10% chance of retrograde
    })),
    houses,
    aspects
  }
}

// Zodiac sign descriptions
export const SIGN_DESCRIPTIONS = {
  'Aries': {
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'Mars',
    keywords: ['Pioneer', 'Leader', 'Impulsive', 'Courageous'],
    description: 'You are a natural leader with pioneering spirit and courage.'
  },
  'Taurus': {
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'Venus',
    keywords: ['Stable', 'Sensual', 'Practical', 'Determined'],
    description: 'You are grounded and practical with a love for beauty and comfort.'
  },
  'Gemini': {
    element: 'Air',
    quality: 'Mutable',
    ruler: 'Mercury',
    keywords: ['Curious', 'Communicative', 'Adaptable', 'Intellectual'],
    description: 'You are curious and communicative with a quick mind and adaptable nature.'
  },
  'Cancer': {
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'Moon',
    keywords: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
    description: 'You are nurturing and intuitive with strong emotional intelligence.'
  },
  'Leo': {
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'Sun',
    keywords: ['Confident', 'Creative', 'Generous', 'Dramatic'],
    description: 'You are confident and creative with natural leadership abilities.'
  },
  'Virgo': {
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'Mercury',
    keywords: ['Analytical', 'Practical', 'Service-oriented', 'Perfectionist'],
    description: 'You are analytical and service-oriented with attention to detail.'
  },
  'Libra': {
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'Venus',
    keywords: ['Diplomatic', 'Harmonious', 'Partnership-oriented', 'Aesthetic'],
    description: 'You are diplomatic and seek harmony in relationships and beauty.'
  },
  'Scorpio': {
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Pluto',
    keywords: ['Intense', 'Transformative', 'Passionate', 'Mysterious'],
    description: 'You are intense and transformative with deep emotional depth.'
  },
  'Sagittarius': {
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'Jupiter',
    keywords: ['Adventurous', 'Philosophical', 'Optimistic', 'Freedom-loving'],
    description: 'You are adventurous and philosophical with a love for exploration.'
  },
  'Capricorn': {
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn',
    keywords: ['Ambitious', 'Disciplined', 'Practical', 'Authoritative'],
    description: 'You are ambitious and disciplined with strong leadership potential.'
  },
  'Aquarius': {
    element: 'Air',
    quality: 'Fixed',
    ruler: 'Uranus',
    keywords: ['Innovative', 'Humanitarian', 'Independent', 'Unconventional'],
    description: 'You are innovative and humanitarian with a unique perspective.'
  },
  'Pisces': {
    element: 'Water',
    quality: 'Mutable',
    ruler: 'Neptune',
    keywords: ['Intuitive', 'Compassionate', 'Imaginative', 'Spiritual'],
    description: 'You are intuitive and compassionate with strong spiritual awareness.'
  }
}
