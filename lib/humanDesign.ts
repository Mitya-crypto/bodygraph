// Human Design API integration and calculations
import { isValid } from 'date-fns'

export interface HumanDesignResult {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  channels: Array<{
    number: string
    name: string
    gates: string[]
  }>
  gates: Array<{
    number: string
    name: string
    line: number
    color: string
  }>
  centers: Array<{
    name: string
    defined: boolean
    color: string
  }>
  incarnationCross: string
  variables?: {
    digestion: string
    environment: string
    motivation: string
    perspective: string
  }
}

// Mock Human Design API response (in real app, this would come from Bodygraph API)
export async function fetchHumanDesignData(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number
): Promise<HumanDesignResult> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Parse birth date and time with proper validation
  const birthDateTime = new Date(`${birthDate}T${birthTime || '12:00'}`)
  
  if (!isValid(birthDateTime)) {
    throw new Error('Invalid birth date or time provided')
  }
  
  const day = birthDateTime.getDate()
  const month = birthDateTime.getMonth() + 1
  
  // Generate consistent results based on birth date
  const seed = day + month
  
  const types = ['Generator', 'Manifestor', 'Projector', 'Reflector']
  const strategies = [
    'To Respond',
    'To Inform',
    'To Wait for the Invitation',
    'To Wait for the Lunar Cycle'
  ]
  const authorities = [
    'Sacral',
    'Solar Plexus',
    'Splenic',
    'G-Center',
    'Ego',
    'Self-Projected',
    'Mental Projected'
  ]
  const profiles = ['1/3', '2/4', '3/5', '4/6', '5/1', '6/2']
  
  const type = types[seed % types.length]
  const strategy = strategies[seed % strategies.length]
  const authority = authorities[seed % authorities.length]
  const profile = profiles[seed % profiles.length]
  
  // Mock channels and gates
  const channels = [
    { number: '1-8', name: 'Channel of Inspiration', gates: ['1', '8'] },
    { number: '2-14', name: 'Channel of the Beat', gates: ['2', '14'] },
    { number: '3-60', name: 'Channel of Mutation', gates: ['3', '60'] },
    { number: '4-63', name: 'Channel of Logic', gates: ['4', '63'] },
    { number: '5-15', name: 'Channel of Rhythm', gates: ['5', '15'] }
  ].slice(0, Math.floor(seed / 2) + 1)
  
  const gates = [
    { number: '1', name: 'The Creative', line: 1, color: '#0ea5e9' },
    { number: '2', name: 'The Higher Self', line: 2, color: '#d946ef' },
    { number: '3', name: 'Ordering', line: 3, color: '#fbbf24' },
    { number: '4', name: 'Youthful Folly', line: 4, color: '#ef4444' },
    { number: '5', name: 'The Higher Self', line: 5, color: '#8b5cf6' }
  ].slice(0, Math.floor(seed / 3) + 2)
  
  const centers = [
    { name: 'Head', defined: seed % 2 === 0, color: '#0ea5e9' },
    { name: 'Ajna', defined: seed % 3 === 0, color: '#d946ef' },
    { name: 'Throat', defined: seed % 4 === 0, color: '#fbbf24' },
    { name: 'G-Center', defined: seed % 5 === 0, color: '#ef4444' },
    { name: 'Heart', defined: seed % 6 === 0, color: '#8b5cf6' },
    { name: 'Solar Plexus', defined: seed % 7 === 0, color: '#06b6d4' },
    { name: 'Sacral', defined: seed % 8 === 0, color: '#10b981' },
    { name: 'Root', defined: seed % 9 === 0, color: '#f59e0b' },
    { name: 'Spleen', defined: seed % 10 === 0, color: '#ec4899' }
  ]
  
  const incarnationCrosses = [
    'Right Angle Cross of the Sphinx',
    'Left Angle Cross of the Vessel of Love',
    'Juxtaposition Cross of the Sleeping Phoenix',
    'Right Angle Cross of the Sleeping Phoenix',
    'Left Angle Cross of the Sphinx'
  ]
  
  return {
    type,
    strategy,
    authority,
    profile,
    definition: `${type} with ${authority} authority`,
    channels,
    gates,
    centers,
    incarnationCross: incarnationCrosses[seed % incarnationCrosses.length],
    variables: {
      digestion: 'Cold',
      environment: 'Caves',
      motivation: 'Hope',
      perspective: 'Individual'
    }
  }
}

// Human Design type descriptions
export const TYPE_DESCRIPTIONS = {
  'Generator': {
    title: 'The Generator',
    description: 'You are here to respond to life and generate energy. Your strategy is to respond to what life brings you.',
    strategy: 'To Respond',
    notSelf: 'Frustration',
    signature: 'Satisfaction'
  },
  'Manifestor': {
    title: 'The Manifestor',
    description: 'You are here to initiate and impact others. Your strategy is to inform before you act.',
    strategy: 'To Inform',
    notSelf: 'Anger',
    signature: 'Peace'
  },
  'Projector': {
    title: 'The Projector',
    description: 'You are here to guide and direct others. Your strategy is to wait for the invitation.',
    strategy: 'To Wait for the Invitation',
    notSelf: 'Bitterness',
    signature: 'Success'
  },
  'Reflector': {
    title: 'The Reflector',
    description: 'You are here to reflect the health of your community. Your strategy is to wait for the lunar cycle.',
    strategy: 'To Wait for the Lunar Cycle',
    notSelf: 'Disappointment',
    signature: 'Surprise'
  }
}

// Authority descriptions
export const AUTHORITY_DESCRIPTIONS = {
  'Sacral': 'Your gut feeling is your authority. Trust your immediate response to life.',
  'Solar Plexus': 'Your emotional clarity is your authority. Wait for emotional clarity before deciding.',
  'Splenic': 'Your instinct is your authority. Trust your immediate sense of what is healthy.',
  'G-Center': 'Your sense of direction is your authority. Trust your inner knowing about direction.',
  'Ego': 'Your will is your authority. Trust your heart\'s desire and will to act.',
  'Self-Projected': 'Your voice is your authority. Speak your truth to find clarity.',
  'Mental Projected': 'Your mind is your authority. Think through decisions to find clarity.'
}
