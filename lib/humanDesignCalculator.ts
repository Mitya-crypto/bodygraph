// lib/humanDesignCalculator.ts
// Локальный калькулятор Human Design на основе алгоритмов

interface BirthData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  latitude: number
  longitude: number
}

interface HumanDesignResult {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
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
    line: number
    color: string
  }>
  centers: Array<{
    name: string
    defined: boolean
    color: string
  }>
}

// Основная функция расчета Human Design
export function calculateHumanDesign(birthData: BirthData): HumanDesignResult {
  console.log('🔄 Calculating Human Design for:', birthData)
  
  // 1. Расчет планетарных позиций (упрощенный)
  const planetaryPositions = calculatePlanetaryPositions(birthData)
  console.log('✅ Planetary positions calculated:', Object.keys(planetaryPositions))
  
  // 2. Расчет ворот (Gates)
  const gates = calculateGates(planetaryPositions)
  console.log('✅ Gates calculated:', gates.length)
  
  // 3. Расчет каналов (Channels)
  const channels = calculateChannels(gates)
  console.log('✅ Channels calculated:', channels.length)
  
  // 4. Расчет центров (Centers)
  const centers = calculateCenters(channels)
  console.log('✅ Centers calculated:', centers.length)
  
  // 5. Определение типа
  const type = determineType(centers)
  console.log('✅ Type determined:', type)
  
  // 6. Определение стратегии
  const strategy = determineStrategy(type)
  console.log('✅ Strategy determined:', strategy)
  
  // 7. Определение авторитета
  const authority = determineAuthority(centers)
  console.log('✅ Authority determined:', authority)
  
  // 8. Расчет профиля
  const profile = calculateProfile(planetaryPositions)
  console.log('✅ Profile calculated:', profile)
  
  // 9. Определение креста воплощения
  const incarnationCross = calculateIncarnationCross(planetaryPositions)
  console.log('✅ Incarnation cross calculated:', incarnationCross)
  
  const result = {
    type,
    strategy,
    authority,
    profile,
    definition: `${type} with ${authority} authority`,
    incarnationCross,
    channels,
    gates,
    centers
  }
  
  console.log('🎯 Final Human Design result:', result)
  return result
}

// Расчет планетарных позиций (упрощенный алгоритм)
function calculatePlanetaryPositions(birthData: BirthData) {
  const { year, month, day, hour, minute, latitude, longitude } = birthData
  
  // Юлианский день
  const julianDay = calculateJulianDay(year, month, day, hour, minute)
  
  // Расчет позиций планет (упрощенный)
  const positions = {
    sun: calculateSunPosition(julianDay),
    moon: calculateMoonPosition(julianDay),
    mercury: calculateMercuryPosition(julianDay),
    venus: calculateVenusPosition(julianDay),
    mars: calculateMarsPosition(julianDay),
    jupiter: calculateJupiterPosition(julianDay),
    saturn: calculateSaturnPosition(julianDay),
    uranus: calculateUranusPosition(julianDay),
    neptune: calculateNeptunePosition(julianDay),
    pluto: calculatePlutoPosition(julianDay),
    earth: calculateEarthPosition(julianDay)
  }
  
  return positions
}

// Расчет ворот (Gates) на основе планетарных позиций
function calculateGates(positions: any) {
  const gates = []
  
  // Солнце - определяет ворота личности
  const sunGate = Math.floor(positions.sun / 30) + 1
  gates.push({
    number: sunGate.toString(),
    name: getGateName(sunGate),
    description: getGateDescription(sunGate),
    line: Math.floor((positions.sun % 30) / 5) + 1,
    color: getGateColor(sunGate)
  })
  
  // Луна - определяет ворота дизайна
  const moonGate = Math.floor(positions.moon / 30) + 1
  gates.push({
    number: moonGate.toString(),
    name: getGateName(moonGate),
    description: getGateDescription(moonGate),
    line: Math.floor((positions.moon % 30) / 5) + 1,
    color: getGateColor(moonGate)
  })
  
  // Остальные планеты
  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  planets.forEach(planet => {
    const gate = Math.floor(positions[planet] / 30) + 1
    gates.push({
      number: gate.toString(),
      name: getGateName(gate),
      description: getGateDescription(gate),
      line: Math.floor((positions[planet] % 30) / 5) + 1,
      color: getGateColor(gate)
    })
  })
  
  return gates
}

// Расчет каналов на основе ворот
function calculateChannels(gates: any[]) {
  const channels: any[] = []
  const gateNumbers = gates.map(g => parseInt(g.number))
  
  // Определяем активные каналы
  const activeChannels = [
    { number: '1-8', gates: [1, 8], name: 'Inspiration', description: 'Channel of inspiration and creativity' },
    { number: '2-14', gates: [2, 14], name: 'The Beat', description: 'Channel of rhythm and timing' },
    { number: '3-60', gates: [3, 60], name: 'Mutation', description: 'Channel of mutation and change' },
    { number: '4-63', gates: [4, 63], name: 'Logic', description: 'Channel of logic and reasoning' },
    { number: '5-15', gates: [5, 15], name: 'Rhythm', description: 'Channel of rhythm and flow' },
    { number: '6-59', gates: [6, 59], name: 'Mating', description: 'Channel of mating and reproduction' },
    { number: '7-31', gates: [7, 31], name: 'Leadership', description: 'Channel of leadership and authority' },
    { number: '9-52', gates: [9, 52], name: 'Concentration', description: 'Channel of concentration and focus' },
    { number: '10-20', gates: [10, 20], name: 'Awakening', description: 'Channel of awakening and awareness' },
    { number: '11-56', gates: [11, 56], name: 'Curiosity', description: 'Channel of curiosity and seeking' }
  ]
  
  activeChannels.forEach(channel => {
    const hasGate1 = gateNumbers.includes(channel.gates[0])
    const hasGate2 = gateNumbers.includes(channel.gates[1])
    
    if (hasGate1 && hasGate2) {
      channels.push({
        number: channel.number,
        name: channel.name,
        description: channel.description
      })
    }
  })
  
  return channels
}

// Расчет центров
function calculateCenters(channels: any[]) {
  const centers = [
    { name: 'Head', defined: false, color: '#0ea5e9' },
    { name: 'Ajna', defined: false, color: '#d946ef' },
    { name: 'Throat', defined: false, color: '#fbbf24' },
    { name: 'G-Center', defined: false, color: '#ef4444' },
    { name: 'Heart', defined: false, color: '#8b5cf6' },
    { name: 'Solar Plexus', defined: false, color: '#06b6d4' },
    { name: 'Sacral', defined: false, color: '#10b981' },
    { name: 'Root', defined: false, color: '#f59e0b' },
    { name: 'Spleen', defined: false, color: '#ec4899' }
  ]
  
  console.log('🔍 Calculating centers for channels:', channels.length)
  
  // Определяем активные центры на основе каналов
  channels.forEach(channel => {
    const channelNumber = channel.number
    console.log('🔍 Processing channel:', channelNumber)
    
    // Логика определения активных центров на основе каналов
    if (channelNumber.includes('1-8') || channelNumber.includes('2-14')) {
      centers.find(c => c.name === 'Head')!.defined = true
      console.log('✅ Head center activated')
    }
    if (channelNumber.includes('3-60') || channelNumber.includes('4-63')) {
      centers.find(c => c.name === 'Ajna')!.defined = true
      console.log('✅ Ajna center activated')
    }
    if (channelNumber.includes('5-15') || channelNumber.includes('6-59')) {
      centers.find(c => c.name === 'Throat')!.defined = true
      console.log('✅ Throat center activated')
    }
    if (channelNumber.includes('7-31') || channelNumber.includes('9-52')) {
      centers.find(c => c.name === 'G-Center')!.defined = true
      console.log('✅ G-Center activated')
    }
    if (channelNumber.includes('10-20') || channelNumber.includes('11-56')) {
      centers.find(c => c.name === 'Heart')!.defined = true
      console.log('✅ Heart center activated')
    }
    if (channelNumber.includes('12-22') || channelNumber.includes('13-33')) {
      centers.find(c => c.name === 'Solar Plexus')!.defined = true
      console.log('✅ Solar Plexus center activated')
    }
    if (channelNumber.includes('14-2') || channelNumber.includes('15-5')) {
      centers.find(c => c.name === 'Sacral')!.defined = true
      console.log('✅ Sacral center activated')
    }
    if (channelNumber.includes('16-48') || channelNumber.includes('17-62')) {
      centers.find(c => c.name === 'Root')!.defined = true
      console.log('✅ Root center activated')
    }
    if (channelNumber.includes('18-58') || channelNumber.includes('19-49')) {
      centers.find(c => c.name === 'Spleen')!.defined = true
      console.log('✅ Spleen center activated')
    }
  })
  
  const definedCenters = centers.filter(c => c.defined)
  console.log('✅ Defined centers:', definedCenters.map(c => c.name))
  
  return centers
}

// Определение типа
function determineType(centers: any[]) {
  const definedCenters = centers.filter(c => c.defined)
  const definedCenterNames = definedCenters.map(c => c.name)
  
  console.log('🔍 Determining type for centers:', definedCenterNames)
  
  // Логика определения типа на основе активных центров
  if (definedCenterNames.includes('Sacral')) {
    // Проверяем, есть ли соединение между Горловым центром и мотором
    if (definedCenterNames.includes('Throat') && 
        (definedCenterNames.includes('Solar Plexus') || 
         definedCenterNames.includes('Root') || 
         definedCenterNames.includes('Heart'))) {
      console.log('✅ Type: Manifesting Generator')
      return 'Manifesting Generator'
    }
    console.log('✅ Type: Generator')
    return 'Generator'
  } else if (definedCenterNames.includes('Throat') && !definedCenterNames.includes('Sacral')) {
    console.log('✅ Type: Manifestor')
    return 'Manifestor'
  } else if (definedCenterNames.includes('Throat') && !definedCenterNames.includes('Sacral') && !definedCenterNames.includes('Solar Plexus')) {
    console.log('✅ Type: Projector')
    return 'Projector'
  } else {
    console.log('✅ Type: Reflector (no defined centers)')
    return 'Reflector'
  }
}

// Определение стратегии
function determineStrategy(type: string) {
  const strategies = {
    'Generator': 'Respond',
    'Manifesting Generator': 'Respond, then Inform',
    'Manifestor': 'Inform',
    'Projector': 'Wait for the Invitation',
    'Reflector': 'Wait for the Lunar Cycle'
  }
  return strategies[type as keyof typeof strategies] || 'Respond'
}

// Определение авторитета
function determineAuthority(centers: any[]) {
  const definedCenters = centers.filter(c => c.defined)
  const definedCenterNames = definedCenters.map(c => c.name)
  
  if (definedCenterNames.includes('Solar Plexus')) {
    return 'Emotional'
  } else if (definedCenterNames.includes('Sacral')) {
    return 'Sacral'
  } else if (definedCenterNames.includes('Spleen')) {
    return 'Splenic'
  } else if (definedCenterNames.includes('Heart')) {
    return 'Ego'
  } else if (definedCenterNames.includes('G-Center')) {
    return 'Self-Projected'
  } else {
    return 'Environmental'
  }
}

// Расчет профиля
function calculateProfile(positions: any) {
  // Упрощенный расчет профиля на основе позиций Солнца и Земли
  const sunLine = Math.floor((positions.sun % 30) / 5) + 1
  const earthLine = Math.floor((positions.earth % 30) / 5) + 1
  
  const profiles = ['1/3', '2/4', '3/5', '4/6', '5/1', '6/2']
  const profileIndex = (sunLine + earthLine) % profiles.length
  
  return profiles[profileIndex]
}

// Расчет креста воплощения
function calculateIncarnationCross(positions: any) {
  const crosses = [
    'Right Angle Cross of the Sphinx',
    'Left Angle Cross of the Vessel of Love',
    'Juxtaposition Cross of the Sleeping Phoenix',
    'Right Angle Cross of the Sleeping Phoenix',
    'Left Angle Cross of the Sphinx'
  ]
  
  const crossIndex = Math.floor(positions.sun / 72) % crosses.length
  return crosses[crossIndex]
}

// Вспомогательные функции
function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function calculateSunPosition(julianDay: number): number {
  return (julianDay * 0.9856) % 360
}

// Добавляем расчет позиции Земли для профиля
function calculateEarthPosition(julianDay: number): number {
  const sunPos = calculateSunPosition(julianDay)
  return (sunPos + 180) % 360
}

function calculateMoonPosition(julianDay: number): number {
  return (julianDay * 13.18) % 360
}

function calculateMercuryPosition(julianDay: number): number {
  return (julianDay * 4.15) % 360
}

function calculateVenusPosition(julianDay: number): number {
  return (julianDay * 1.6) % 360
}

function calculateMarsPosition(julianDay: number): number {
  return (julianDay * 0.53) % 360
}

function calculateJupiterPosition(julianDay: number): number {
  return (julianDay * 0.084) % 360
}

function calculateSaturnPosition(julianDay: number): number {
  return (julianDay * 0.034) % 360
}

function calculateUranusPosition(julianDay: number): number {
  return (julianDay * 0.012) % 360
}

function calculateNeptunePosition(julianDay: number): number {
  return (julianDay * 0.006) % 360
}

function calculatePlutoPosition(julianDay: number): number {
  return (julianDay * 0.004) % 360
}

function getGateName(gateNumber: number): string {
  const gateNames: { [key: number]: string } = {
    1: 'The Creative', 2: 'The Higher Self', 3: 'Ordering', 4: 'Youthful Folly', 5: 'Waiting',
    6: 'Conflict', 7: 'The Army', 8: 'Holding Together', 9: 'The Taming Power', 10: 'Treading',
    11: 'Peace', 12: 'Standstill', 13: 'Fellowship', 14: 'Great Possession', 15: 'Modesty',
    16: 'Enthusiasm', 17: 'Following', 18: 'Work on What Has Been Spoiled', 19: 'Approach', 20: 'Contemplation'
  }
  return gateNames[gateNumber] || `Gate ${gateNumber}`
}

function getGateDescription(gateNumber: number): string {
  const descriptions: { [key: number]: string } = {
    1: 'Gate of self-expression and creativity',
    2: 'Gate of higher self and intuition',
    3: 'Gate of ordering and difficulty',
    4: 'Gate of youthful folly and learning',
    5: 'Gate of waiting and timing'
  }
  return descriptions[gateNumber] || `Description for Gate ${gateNumber}`
}

function getGateColor(gateNumber: number): string {
  const colors = ['#0ea5e9', '#d946ef', '#fbbf24', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']
  return colors[gateNumber % colors.length]
}

// Экспорт основной функции (уже экспортируется выше)
