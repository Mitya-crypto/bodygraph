// lib/humanDesignApi.ts

import { calculateHumanDesign } from './humanDesignCalculator'

// Конфигурация API
const HUMAN_DESIGN_API_CONFIG = {
  baseUrl: 'https://humandesignapi.nl/api/v1',
  apiKey: process.env.NEXT_PUBLIC_HUMAN_DESIGN_API_KEY || '', // Добавим в .env.local
  timeout: 10000 // 10 секунд
}

interface HumanDesignRequest {
  birthDate: string // YYYY-MM-DD
  birthTime: string // HH:MM
  latitude: number
  longitude: number
}

interface HumanDesignResponse {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  innerAuthority: string
  incarnationCross: string
  channels: Array<{
    number: string
    name: string
    description: string
  }>
  gates: Array<{
    number: string
    name: string
    description: string
  }>
  centers: {
    defined: string[]
    undefined: string[]
  }
}

// Функция для получения данных Human Design через API
export async function fetchHumanDesignData(request: HumanDesignRequest): Promise<HumanDesignResponse> {
  try {
    console.log('🔄 Fetching Human Design data from API:', request)
    
    // Проверяем наличие API ключа
    if (!HUMAN_DESIGN_API_CONFIG.apiKey) {
      console.warn('⚠️ Human Design API key not found, using local calculation')
      return getLocalHumanDesignData(request)
    }

    // Формируем URL для запроса
    const url = `${HUMAN_DESIGN_API_CONFIG.baseUrl}/chart`
    
    // Подготавливаем данные для API
    const apiRequestData = {
      birth_date: request.birthDate,
      birth_time: request.birthTime,
      latitude: request.latitude,
      longitude: request.longitude
    }

    console.log('📡 Making API request to:', url)
    console.log('📡 Request data:', apiRequestData)

    // Выполняем запрос к API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': HUMAN_DESIGN_API_CONFIG.apiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify(apiRequestData),
      signal: AbortSignal.timeout(HUMAN_DESIGN_API_CONFIG.timeout)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      
      // Если API недоступен, возвращаем моковые данные
      if (response.status >= 500) {
        console.warn('⚠️ API server error, using mock data')
        return getMockHumanDesignData()
      }
      
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const apiData = await response.json()
    console.log('✅ Raw API response:', apiData)

    // Преобразуем ответ API в наш формат
    const transformedData = transformApiResponse(apiData)
    console.log('✅ Transformed Human Design data:', transformedData)
    
    return transformedData
    
  } catch (error) {
    console.error('❌ Error fetching Human Design data:', error)
    
    // В случае ошибки возвращаем локальные данные
    console.warn('⚠️ Using local calculation due to error')
    return getLocalHumanDesignData(request)
  }
}

// Функция для получения локальных данных
function getLocalHumanDesignData(request: HumanDesignRequest): HumanDesignResponse {
  try {
    // Парсим дату и время
    const birthDate = new Date(request.birthDate)
    const [hours, minutes] = request.birthTime.split(':').map(Number)
    
    const birthData = {
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: hours,
      minute: minutes,
      latitude: request.latitude,
      longitude: request.longitude
    }
    
    // Используем локальный калькулятор
    const result = calculateHumanDesign(birthData)
    
    // Преобразуем в формат API
    return {
      type: result.type,
      strategy: result.strategy,
      authority: result.authority,
      profile: result.profile,
      definition: result.definition,
      innerAuthority: result.authority,
      incarnationCross: result.incarnationCross,
      channels: result.channels,
      gates: result.gates,
      centers: {
        defined: result.centers.filter(c => c.defined).map(c => c.name),
        undefined: result.centers.filter(c => !c.defined).map(c => c.name)
      }
    }
  } catch (error) {
    console.error('❌ Error in local calculation:', error)
    return getMockHumanDesignData()
  }
}

// Функция для получения моковых данных (fallback)
function getMockHumanDesignData(): HumanDesignResponse {
  return {
    type: 'Generator',
    strategy: 'Respond',
    authority: 'Sacral',
    profile: '3/5',
    definition: 'Single Definition',
    innerAuthority: 'Sacral Response',
    incarnationCross: 'Right Angle Cross of Contagion',
    channels: [
      {
        number: '1-8',
        name: 'Inspiration',
        description: 'Channel of inspiration and creativity'
      },
      {
        number: '10-20',
        name: 'Awakening',
        description: 'Channel of awakening and awareness'
      },
      {
        number: '34-20',
        name: 'Charisma',
        description: 'Channel of charisma and transformation'
      }
    ],
    gates: [
      {
        number: '1',
        name: 'Self Expression',
        description: 'Gate of self-expression and creativity'
      },
      {
        number: '8',
        name: 'Contribution',
        description: 'Gate of contribution and leadership'
      },
      {
        number: '10',
        name: 'Self Love',
        description: 'Gate of self-love and behavior'
      },
      {
        number: '20',
        name: 'Contemplation',
        description: 'Gate of contemplation and awareness'
      },
      {
        number: '34',
        name: 'Power',
        description: 'Gate of power and transformation'
      }
    ],
    centers: {
      defined: ['Sacral', 'Root', 'Solar Plexus'],
      undefined: ['Heart', 'Spleen', 'Head', 'Ajna', 'Throat', 'G']
    }
  }
}

// Функция для преобразования ответа API в наш формат
function transformApiResponse(apiData: any): HumanDesignResponse {
  try {
    return {
      type: apiData.type || 'Generator',
      strategy: apiData.strategy || 'Respond',
      authority: apiData.authority || 'Sacral',
      profile: apiData.profile || '3/5',
      definition: apiData.definition || 'Single Definition',
      innerAuthority: apiData.inner_authority || apiData.innerAuthority || 'Sacral Response',
      incarnationCross: apiData.incarnation_cross || apiData.incarnationCross || 'Right Angle Cross of Contagion',
      channels: (apiData.channels || []).map((channel: any) => ({
        number: channel.number || channel.gate || '',
        name: channel.name || channel.title || '',
        description: channel.description || ''
      })),
      gates: (apiData.gates || []).map((gate: any) => ({
        number: gate.number || gate.gate || '',
        name: gate.name || gate.title || '',
        description: gate.description || ''
      })),
      centers: {
        defined: apiData.defined_centers || apiData.definedCenters || [],
        undefined: apiData.undefined_centers || apiData.undefinedCenters || []
      }
    }
  } catch (error) {
    console.error('❌ Error transforming API response:', error)
    return getMockHumanDesignData()
  }
}

// Функция для валидации входных данных
export function validateHumanDesignInput(birthDate: string, birthTime: string, latitude: number, longitude: number): boolean {
  // Проверяем дату рождения
  const date = new Date(birthDate)
  if (isNaN(date.getTime())) {
    console.error('❌ Invalid birth date:', birthDate)
    return false
  }
  
  // Проверяем время рождения
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(birthTime)) {
    console.error('❌ Invalid birth time:', birthTime)
    return false
  }
  
  // Проверяем координаты
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    console.error('❌ Invalid coordinates:', { latitude, longitude })
    return false
  }
  
  return true
}

// Функция для форматирования данных профиля для API
export function formatProfileForHumanDesign(userProfile: any): HumanDesignRequest | null {
  try {
    if (!userProfile || !userProfile.birthDate) {
      console.error('❌ Missing birth date in profile')
      return null
    }
    
    const birthDate = new Date(userProfile.birthDate)
    const birthTime = userProfile.birthTime || '12:00'
    
    // Парсим координаты
    let latitude = 0
    let longitude = 0
    
    if (userProfile.birthCoordinates) {
      const coords = userProfile.birthCoordinates.split(',').map(Number)
      if (coords.length === 2) {
        latitude = coords[0]
        longitude = coords[1]
      }
    }
    
    const request: HumanDesignRequest = {
      birthDate: birthDate.toISOString().split('T')[0], // YYYY-MM-DD
      birthTime: birthTime,
      latitude: latitude,
      longitude: longitude
    }
    
    // Валидируем данные
    if (!validateHumanDesignInput(request.birthDate, request.birthTime, request.latitude, request.longitude)) {
      console.error('❌ Invalid Human Design input data')
      return null
    }
    
    console.log('✅ Formatted Human Design request:', request)
    return request
    
  } catch (error) {
    console.error('❌ Error formatting profile for Human Design:', error)
    return null
  }
}

// Константы для Human Design
export const HUMAN_DESIGN_TYPES = {
  GENERATOR: 'Generator',
  MANIFESTOR: 'Manifestor',
  PROJECTOR: 'Projector',
  REFLECTOR: 'Reflector'
} as const

export const HUMAN_DESIGN_STRATEGIES = {
  RESPOND: 'Respond',
  INITIATE: 'Initiate',
  WAIT: 'Wait',
  'WAIT_FOR_LUNAR_CYCLE': 'Wait for Lunar Cycle'
} as const

export const HUMAN_DESIGN_AUTHORITIES = {
  SACRAL: 'Sacral',
  EMOTIONAL: 'Emotional',
  SPLENIC: 'Splenic',
  EGO: 'Ego',
  SELF_PROJECTED: 'Self-Projected',
  ENVIRONMENTAL: 'Environmental',
  LUNAR: 'Lunar',
  INNER: 'Inner'
} as const

export type HumanDesignType = typeof HUMAN_DESIGN_TYPES[keyof typeof HUMAN_DESIGN_TYPES]
export type HumanDesignStrategy = typeof HUMAN_DESIGN_STRATEGIES[keyof typeof HUMAN_DESIGN_STRATEGIES]
export type HumanDesignAuthority = typeof HUMAN_DESIGN_AUTHORITIES[keyof typeof HUMAN_DESIGN_AUTHORITIES]

// Функция для проверки статуса API и использования
// Удалены функции статуса и плана API по требованию: checkHumanDesignApiStatus, getHumanDesignPlanInfo
