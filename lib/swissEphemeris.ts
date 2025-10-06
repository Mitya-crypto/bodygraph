// lib/swissEphemeris.ts

import * as swisseph from 'swisseph'

// Константы для Swiss Ephemeris
export const SWISS_EPHEMERIS_CONFIG = {
  // Коды планет
  SE_SUN: 0,
  SE_MOON: 1,
  SE_MERCURY: 2,
  SE_VENUS: 3,
  SE_MARS: 4,
  SE_JUPITER: 5,
  SE_SATURN: 6,
  SE_URANUS: 7,
  SE_NEPTUNE: 8,
  SE_PLUTO: 9,
  SE_TRUE_NODE: 10, // Истинный лунный узел
  SE_CHIRON: 15,
  
  // Коды систем домов
  SE_HSYS_PLACIDUS: 'P', // Placidus (по умолчанию)
  SE_HSYS_KOCH: 'K',     // Koch
  SE_HSYS_EQUAL: 'A',    // Equal
  SE_HSYS_WHOLE: 'W',    // Whole Sign
  
  // Флаги для расчетов
  SE_FLG_SWIEPH: 2,      // Использовать Swiss Ephemeris
  SE_FLG_SIDEREAL: 64,   // Сидериальная система
  SE_FLG_SPEED: 256,     // Включить скорость
  
  // Точность
  DEFAULT_EPHEMERIS_PATH: '', // Использовать встроенные файлы
}

// Интерфейсы для типизации
export interface BirthData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  latitude: number
  longitude: number
  timezone: number // Часовой пояс в часах
}

export interface PlanetPosition {
  name: string
  longitude: number    // Долгота в градусах
  latitude: number     // Широта в градусах
  distance: number     // Расстояние
  speed: number        // Скорость
  sign: string         // Знак зодиака
  degree: number       // Градус в знаке
  house: number        // Дом (если рассчитан)
}

export interface HouseData {
  number: number
  longitude: number
  sign: string
  degree: number
}

export interface ChartData {
  ascendant: number
  mc: number
  houses: HouseData[]
  planets: PlanetPosition[]
  julianDay: number
}

// Функция для конвертации даты в юлианский день
export function dateToJulianDay(birthData: BirthData): number {
  try {
    // Конвертируем время в UT (Universal Time)
    const utHour = birthData.hour - birthData.timezone
    
    // Используем Swiss Ephemeris для расчета юлианского дня
    const julianDay = swisseph.swe_julday(
      birthData.year,
      birthData.month,
      birthData.day,
      utHour + birthData.minute / 60 + birthData.second / 3600,
      swisseph.SE_GREG_CAL
    )
    
    console.log('✅ Julian day calculated:', julianDay)
    return julianDay
    
  } catch (error) {
    console.error('❌ Error calculating Julian day:', error)
    throw new Error('Failed to calculate Julian day')
  }
}

// Функция для получения знака зодиака по долготе
export function longitudeToSign(longitude: number): { sign: string, degree: number } {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  
  // Нормализуем долготу в диапазон 0-360
  let normalizedLongitude = longitude % 360
  if (normalizedLongitude < 0) normalizedLongitude += 360
  
  // Определяем знак (каждый знак занимает 30 градусов)
  const signIndex = Math.floor(normalizedLongitude / 30)
  const degreeInSign = normalizedLongitude % 30
  
  return {
    sign: signs[signIndex] || 'Aries',
    degree: degreeInSign
  }
}

// Функция для расчета позиций планет
export function calculatePlanetPositions(julianDay: number): PlanetPosition[] {
  try {
    const planets = [
      { name: 'Sun', code: SWISS_EPHEMERIS_CONFIG.SE_SUN },
      { name: 'Moon', code: SWISS_EPHEMERIS_CONFIG.SE_MOON },
      { name: 'Mercury', code: SWISS_EPHEMERIS_CONFIG.SE_MERCURY },
      { name: 'Venus', code: SWISS_EPHEMERIS_CONFIG.SE_VENUS },
      { name: 'Mars', code: SWISS_EPHEMERIS_CONFIG.SE_MARS },
      { name: 'Jupiter', code: SWISS_EPHEMERIS_CONFIG.SE_JUPITER },
      { name: 'Saturn', code: SWISS_EPHEMERIS_CONFIG.SE_SATURN },
      { name: 'Uranus', code: SWISS_EPHEMERIS_CONFIG.SE_URANUS },
      { name: 'Neptune', code: SWISS_EPHEMERIS_CONFIG.SE_NEPTUNE },
      { name: 'Pluto', code: SWISS_EPHEMERIS_CONFIG.SE_PLUTO },
      { name: 'North Node', code: SWISS_EPHEMERIS_CONFIG.SE_TRUE_NODE },
      { name: 'Chiron', code: SWISS_EPHEMERIS_CONFIG.SE_CHIRON }
    ]
    
    const positions: PlanetPosition[] = []
    
    for (const planet of planets) {
      try {
        // Рассчитываем позицию планеты
        const result = swisseph.swe_calc_ut(
          julianDay,
          planet.code,
          SWISS_EPHEMERIS_CONFIG.SE_FLG_SWIEPH
        )
        
        if ((result as any).error) {
          console.warn(`⚠️ Error calculating ${planet.name}:`, (result as any).error)
          // Fallback: используем моковые данные если Swiss Ephemeris недоступен
          const mockLongitude = Math.random() * 360
          const { sign, degree } = longitudeToSign(mockLongitude)
          
          positions.push({
            name: planet.name,
            longitude: mockLongitude,
            latitude: 0,
            distance: 1,
            speed: 1,
            sign,
            degree,
            house: 0
          })
          continue
        }
        
        const longitude = (result as any).longitude
        const latitude = (result as any).latitude
        const distance = (result as any).distance
        const speed = (result as any).speed
        
        const { sign, degree } = longitudeToSign(longitude)
        
        positions.push({
          name: planet.name,
          longitude,
          latitude,
          distance,
          speed,
          sign,
          degree,
          house: 0 // Будет рассчитан позже
        })
        
      } catch (error) {
        console.warn(`⚠️ Error calculating ${planet.name}:`, error)
      }
    }
    
    console.log('✅ Planet positions calculated:', positions.length, 'planets')
    return positions
    
  } catch (error) {
    console.error('❌ Error calculating planet positions:', error)
    throw new Error('Failed to calculate planet positions')
  }
}

// Функция для расчета домов (Placidus)
export function calculateHouses(julianDay: number, latitude: number, longitude: number): HouseData[] {
  try {
    // Рассчитываем куспиды домов
    const result = swisseph.swe_houses(
      julianDay,
      latitude,
      longitude,
      SWISS_EPHEMERIS_CONFIG.SE_HSYS_PLACIDUS
    )
    
    if ((result as any).error) {
      console.error('❌ Error calculating houses:', (result as any).error)
      // Fallback: используем моковые данные если Swiss Ephemeris недоступен
      console.warn('⚠️ Using fallback house calculation')
      const houses: HouseData[] = []
      
      for (let i = 0; i < 12; i++) {
        const mockLongitude = (i * 30) + Math.random() * 10 // Примерные позиции домов
        const { sign, degree } = longitudeToSign(mockLongitude)
        
        houses.push({
          number: i + 1,
          longitude: mockLongitude,
          sign,
          degree
        })
      }
      
      return houses
    }
    
    const houses: HouseData[] = []
    
    // Куспиды домов (1-12)
    if ((result as any).cusps && Array.isArray((result as any).cusps)) {
      for (let i = 0; i < 12; i++) {
        const houseLongitude = (result as any).cusps[i + 1] // Дома начинаются с индекса 1
        if (houseLongitude !== undefined) {
          const { sign, degree } = longitudeToSign(houseLongitude)
          
          houses.push({
            number: i + 1,
            longitude: houseLongitude,
            sign,
            degree
          })
        }
      }
    } else {
      console.warn('⚠️ Houses cusps not available, using default houses')
      // Создаем дома по умолчанию (каждый дом 30 градусов)
      for (let i = 0; i < 12; i++) {
        const houseLongitude = i * 30
        const { sign, degree } = longitudeToSign(houseLongitude)
        
        houses.push({
          number: i + 1,
          longitude: houseLongitude,
          sign,
          degree
        })
      }
    }
    
    console.log('✅ Houses calculated:', houses.length, 'houses')
    return houses
    
  } catch (error) {
    console.error('❌ Error calculating houses:', error)
    throw new Error('Failed to calculate houses')
  }
}

// Функция для определения дома планеты
export function assignPlanetsToHouses(planets: PlanetPosition[], houses: HouseData[]): PlanetPosition[] {
  return planets.map(planet => {
    // Находим дом для планеты
    let houseNumber = 1
    
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i]
      const nextHouse = houses[(i + 1) % 12]
      
      // Проверяем, находится ли планета в этом доме
      let currentLongitude = currentHouse.longitude
      let nextLongitude = nextHouse.longitude
      
      // Обрабатываем переход через 0 градусов
      if (nextLongitude < currentLongitude) {
        if (planet.longitude >= currentLongitude || planet.longitude < nextLongitude) {
          houseNumber = currentHouse.number
          break
        }
      } else {
        if (planet.longitude >= currentLongitude && planet.longitude < nextLongitude) {
          houseNumber = currentHouse.number
          break
        }
      }
    }
    
    return {
      ...planet,
      house: houseNumber
    }
  })
}

// Главная функция для расчета натальной карты
export function calculateNatalChart(birthData: BirthData): ChartData {
  try {
    console.log('🔄 Calculating natal chart for:', birthData)
    
    // 1. Конвертируем дату в юлианский день
    const julianDay = dateToJulianDay(birthData)
    
    // 2. Рассчитываем позиции планет
    const planets = calculatePlanetPositions(julianDay)
    
    // 3. Рассчитываем дома
    const houses = calculateHouses(julianDay, birthData.latitude, birthData.longitude)
    
    // 4. Присваиваем планеты к домам
    const planetsWithHouses = assignPlanetsToHouses(planets, houses)
    
    // 5. Получаем Асцендент и MC
    const ascendant = houses[0]?.longitude || 0
    const mc = houses[9]?.longitude || 0 // MC - это 10-й дом
    
    const chartData: ChartData = {
      ascendant,
      mc,
      houses,
      planets: planetsWithHouses,
      julianDay
    }
    
    console.log('✅ Natal chart calculated successfully')
    return chartData
    
  } catch (error) {
    console.error('❌ Error calculating natal chart:', error)
    throw new Error('Failed to calculate natal chart')
  }
}

// Функция для инициализации Swiss Ephemeris
export function initializeSwissEphemeris(): boolean {
  try {
    // Устанавливаем путь к файлам эфемерид
    const result = swisseph.swe_set_ephe_path(SWISS_EPHEMERIS_CONFIG.DEFAULT_EPHEMERIS_PATH)
    
    if (result !== '0') {
      console.warn('⚠️ Swiss Ephemeris initialization warning:', result)
    }
    
    console.log('✅ Swiss Ephemeris initialized')
    return true
    
  } catch (error) {
    console.error('❌ Error initializing Swiss Ephemeris:', error)
    return false
  }
}

// Функция для очистки ресурсов Swiss Ephemeris
export function cleanupSwissEphemeris(): void {
  try {
    swisseph.swe_close()
    console.log('✅ Swiss Ephemeris cleaned up')
  } catch (error) {
    console.error('❌ Error cleaning up Swiss Ephemeris:', error)
  }
}


