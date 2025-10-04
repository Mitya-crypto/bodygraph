// Numerology calculations based on Pythagorean system
import { isValid, parseISO } from 'date-fns'

export interface NumerologyResult {
  lifePath: number
  expression: number
  soulUrge: number
  personality: number
  dayNumber: number
  monthNumber: number
  yearNumber: number
  biorythms: {
    physical: number
    emotional: number
    intellectual: number
  }
}

// Pythagorean letter-to-number mapping
const LETTER_VALUES: { [key: string]: number } = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
}

// Vowel values for Soul Urge calculation
const VOWEL_VALUES: { [key: string]: number } = {
  'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3, 'Y': 7
}

export function reduceToSingleDigit(num: number): number {
  const masterNumbers = [11, 22, 33]
  
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  
  return num
}

export function calculateLifePath(birthDate: string): number {
  // Validate and parse birth date
  let birthDateTime: Date
  
  try {
    birthDateTime = parseISO(birthDate)
    if (!isValid(birthDateTime)) {
      birthDateTime = new Date(birthDate)
    }
    
    if (!isValid(birthDateTime)) {
      throw new Error('Invalid birth date provided')
    }
  } catch (error) {
    throw new Error('Invalid birth date provided')
  }
  
  const day = birthDateTime.getDate()
  const month = birthDateTime.getMonth() + 1
  const year = birthDateTime.getFullYear()
  
  const dayReduced = reduceToSingleDigit(day)
  const monthReduced = reduceToSingleDigit(month)
  const yearReduced = reduceToSingleDigit(
    year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  )
  
  return reduceToSingleDigit(dayReduced + monthReduced + yearReduced)
}

export function calculateExpression(fullName: string): number {
  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  let sum = 0
  
  for (const letter of name) {
    sum += LETTER_VALUES[letter] || 0
  }
  
  return reduceToSingleDigit(sum)
}

export function calculateSoulUrge(fullName: string): number {
  const name = fullName.toUpperCase()
  const vowels = name.match(/[AEIOUY]/g) || []
  let sum = 0
  
  for (const vowel of vowels) {
    sum += VOWEL_VALUES[vowel] || 0
  }
  
  return reduceToSingleDigit(sum)
}

export function calculatePersonality(fullName: string): number {
  const name = fullName.toUpperCase().replace(/[AEIOUY]/g, '')
  let sum = 0
  
  for (const letter of name) {
    sum += LETTER_VALUES[letter] || 0
  }
  
  return reduceToSingleDigit(sum)
}

export function calculateBiorythms(birthDate: string): { physical: number, emotional: number, intellectual: number } {
  console.log('🔍 calculateBiorythms called with:', birthDate)
  console.log('🔍 Type of birthDate:', typeof birthDate)
  console.log('🔍 Length of birthDate:', birthDate?.length)
  
  // Try different parsing methods
  let birth: Date
  
  try {
    // First try parseISO
    birth = parseISO(birthDate)
    console.log('🔍 parseISO result:', birth)
    console.log('🔍 parseISO is valid:', isValid(birth))
    
    if (!isValid(birth)) {
      // Try new Date as fallback
      console.log('🔍 Trying new Date as fallback...')
      birth = new Date(birthDate)
      console.log('🔍 new Date result:', birth)
      console.log('🔍 new Date is valid:', isValid(birth))
    }
    
    if (!isValid(birth)) {
      console.error('❌ Invalid birth date after all attempts:', birthDate, 'Parsed as:', birth)
      throw new Error('Invalid birth date provided')
    }
  } catch (error) {
    console.error('❌ Error parsing birth date:', error)
    throw new Error('Invalid birth date provided')
  }
  
  const today = new Date()
  const daysSinceBirth = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  
  const physical = Math.sin((2 * Math.PI * daysSinceBirth) / 23) * 100
  const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / 28) * 100
  const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / 33) * 100
  
  return {
    physical: Math.round(physical),
    emotional: Math.round(emotional),
    intellectual: Math.round(intellectual)
  }
}

export function calculatePersonalNumbers(birthDate: string): { day: number, month: number, year: number } {
  let birthDateTime: Date
  
  try {
    birthDateTime = parseISO(birthDate)
    if (!isValid(birthDateTime)) {
      birthDateTime = new Date(birthDate)
    }
    
    if (!isValid(birthDateTime)) {
      throw new Error('Invalid birth date provided')
    }
  } catch (error) {
    throw new Error('Invalid birth date provided')
  }
  
  const day = birthDateTime.getDate()
  const month = birthDateTime.getMonth() + 1
  const year = birthDateTime.getFullYear()
  const currentYear = new Date().getFullYear()
  const currentYearReduced = reduceToSingleDigit(
    currentYear.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  )
  
  return {
    day: reduceToSingleDigit(day),
    month: reduceToSingleDigit(month),
    year: reduceToSingleDigit(day + month + currentYearReduced)
  }
}

export function calculateNumerology(fullName: string, birthDate: string): NumerologyResult {
  const lifePath = calculateLifePath(birthDate)
  const expression = calculateExpression(fullName)
  const soulUrge = calculateSoulUrge(fullName)
  const personality = calculatePersonality(fullName)
  const biorythms = calculateBiorythms(birthDate)
  const personalNumbers = calculatePersonalNumbers(birthDate)
  
  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    dayNumber: personalNumbers.day,
    monthNumber: personalNumbers.month,
    yearNumber: personalNumbers.year,
    biorythms
  }
}

// Number meanings for interpretations
export const NUMBER_MEANINGS = {
  1: {
    title: 'The Leader',
    keywords: ['Leadership', 'Independence', 'Originality', 'Ambition'],
    description: 'You are a natural leader with strong independence and originality. You have the drive to achieve your goals and inspire others.'
  },
  2: {
    title: 'The Diplomat',
    keywords: ['Cooperation', 'Sensitivity', 'Intuition', 'Balance'],
    description: 'You are a natural peacemaker with strong intuition and sensitivity. You excel at bringing people together and finding balance.'
  },
  3: {
    title: 'The Creative',
    keywords: ['Creativity', 'Expression', 'Optimism', 'Communication'],
    description: 'You are highly creative and expressive with natural communication skills. You bring joy and inspiration to others.'
  },
  4: {
    title: 'The Builder',
    keywords: ['Stability', 'Organization', 'Hard Work', 'Practicality'],
    description: 'You are practical and organized with a strong work ethic. You build solid foundations and create lasting structures.'
  },
  5: {
    title: 'The Adventurer',
    keywords: ['Freedom', 'Change', 'Variety', 'Experience'],
    description: 'You crave freedom and variety in life. You are adaptable and seek new experiences and adventures.'
  },
  6: {
    title: 'The Nurturer',
    keywords: ['Responsibility', 'Care', 'Harmony', 'Service'],
    description: 'You are naturally caring and responsible. You seek to create harmony and serve others with love and compassion.'
  },
  7: {
    title: 'The Seeker',
    keywords: ['Spirituality', 'Analysis', 'Introspection', 'Wisdom'],
    description: 'You are a deep thinker and spiritual seeker. You analyze life\'s mysteries and seek inner wisdom and understanding.'
  },
  8: {
    title: 'The Achiever',
    keywords: ['Power', 'Success', 'Material', 'Authority'],
    description: 'You have strong leadership abilities and drive for success. You can achieve material and professional accomplishments.'
  },
  9: {
    title: 'The Humanitarian',
    keywords: ['Compassion', 'Universal Love', 'Service', 'Completion'],
    description: 'You are compassionate and humanitarian. You seek to serve humanity and make the world a better place.'
  },
  11: {
    title: 'The Intuitive',
    keywords: ['Intuition', 'Inspiration', 'Enlightenment', 'Vision'],
    description: 'You are highly intuitive and inspirational. You have the potential for spiritual enlightenment and visionary leadership.'
  },
  22: {
    title: 'The Master Builder',
    keywords: ['Mastery', 'Large Scale', 'Practical Vision', 'Manifestation'],
    description: 'You have the potential to manifest large-scale projects and create lasting impact on the world.'
  },
  33: {
    title: 'The Master Teacher',
    keywords: ['Mastery', 'Teaching', 'Healing', 'Compassion'],
    description: 'You are a master teacher and healer with the ability to inspire and uplift humanity through compassion and wisdom.'
  }
}
