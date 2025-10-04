// app/api/astrology/route.ts
import { NextRequest, NextResponse } from 'next/server'
// Используем динамический импорт для Swiss Ephemeris
const swisseph = require('swisseph')

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Astrology API called')
    const body = await request.json()
    console.log('📝 Request body:', body)
    const { birthDate, birthTime, latitude, longitude, timezone } = body

    // Валидируем входные данные
    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: birthDate, birthTime, latitude, longitude' },
        { status: 400 }
      )
    }

    // Рассчитываем юлианский день
    const birthDateObj = new Date(birthDate)
    const timeParts = birthTime.split(':')
    const hours = parseInt(timeParts[0] || '12')
    const minutes = parseInt(timeParts[1] || '0')
    const utHour = hours - (timezone || 0)
    
    console.log('📅 Calculating Julian day for:', {
      year: birthDateObj.getFullYear(),
      month: birthDateObj.getMonth() + 1,
      day: birthDateObj.getDate(),
      hour: utHour + minutes / 60
    })
    
    const julianDay = swisseph.swe_julday(
      birthDateObj.getFullYear(),
      birthDateObj.getMonth() + 1,
      birthDateObj.getDate(),
      utHour + minutes / 60,
      swisseph.SE_GREG_CAL
    )
    
    console.log('✅ Julian day calculated:', julianDay)

    // Рассчитываем позиции планет
    const planets = []
    const planetCodes = [
      { name: 'Sun', code: 0 },
      { name: 'Moon', code: 1 },
      { name: 'Mercury', code: 2 },
      { name: 'Venus', code: 3 },
      { name: 'Mars', code: 4 },
      { name: 'Jupiter', code: 5 },
      { name: 'Saturn', code: 6 },
      { name: 'Uranus', code: 7 },
      { name: 'Neptune', code: 8 },
      { name: 'Pluto', code: 9 }
    ]

    for (const planet of planetCodes) {
      try {
        console.log(`🔄 Calculating ${planet.name}...`)
        const result = swisseph.swe_calc_ut(julianDay, planet.code, 2)
        console.log(`📊 ${planet.name} result:`, result)
        
        if (!result.error) {
          const longitude = result.longitude
          const latitude = result.latitude
          
          // Определяем знак зодиака
          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
          let normalizedLongitude = longitude % 360
          if (normalizedLongitude < 0) normalizedLongitude += 360
          const signIndex = Math.floor(normalizedLongitude / 30)
          const sign = signs[signIndex] || 'Aries'
          const degree = normalizedLongitude % 30
          
          planets.push({
            name: planet.name,
            longitude,
            latitude,
            sign,
            degree,
            house: 1 // Пока ставим дом 1, можно рассчитать позже
          })
          console.log(`✅ ${planet.name} calculated:`, sign, degree)
        } else {
          console.warn(`❌ ${planet.name} calculation error:`, result.error)
        }
      } catch (error) {
        console.error(`❌ Error calculating ${planet.name}:`, error)
      }
    }

    // Определяем знаки зодиака для домов
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    // Рассчитываем дома
    const housesResult = swisseph.swe_houses(julianDay, parseFloat(latitude), parseFloat(longitude), 'P')
    const houses = []
    
    if (!housesResult.error) {
      for (let i = 1; i <= 12; i++) {
        const houseLongitude = housesResult.cusps[i]
        let normalizedLongitude = houseLongitude % 360
        if (normalizedLongitude < 0) normalizedLongitude += 360
        const signIndex = Math.floor(normalizedLongitude / 30)
        const sign = signs[signIndex] || 'Aries'
        const degree = normalizedLongitude % 30
        
        houses.push({
          number: i,
          longitude: houseLongitude,
          sign,
          degree
        })
      }
    }

    const ascendant = houses[0]?.longitude || 0
    const mc = houses[9]?.longitude || 0

    // Преобразуем данные в формат для фронтенда
    const response = {
      success: true,
      chartData: {
        ascendant,
        mc,
        houses: houses.map(h => h.longitude),
        planets: planets.map(p => ({
          name: p.name,
          longitude: p.longitude,
          latitude: p.latitude
        }))
      },
      sun: {
        sign: planets.find(p => p.name === 'Sun')?.sign || 'Aries',
        degree: planets.find(p => p.name === 'Sun')?.degree || 0,
        house: planets.find(p => p.name === 'Sun')?.house || 1,
        description: `Солнце в ${planets.find(p => p.name === 'Sun')?.sign || 'Aries'}`
      },
      moon: {
        sign: planets.find(p => p.name === 'Moon')?.sign || 'Aries',
        degree: planets.find(p => p.name === 'Moon')?.degree || 0,
        house: planets.find(p => p.name === 'Moon')?.house || 1,
        description: `Луна в ${planets.find(p => p.name === 'Moon')?.sign || 'Aries'}`
      },
      rising: {
        sign: houses.find(h => h.number === 1)?.sign || 'Aries',
        degree: houses.find(h => h.number === 1)?.degree || 0,
        description: `Асцендент в ${houses.find(h => h.number === 1)?.sign || 'Aries'}`
      },
      planets: planets.map(planet => ({
        name: planet.name,
        sign: planet.sign,
        degree: planet.degree,
        house: planet.house,
        description: `${planet.name} в ${planet.sign}`
      })),
      houses: houses.map(house => ({
        number: house.number,
        sign: house.sign,
        degree: house.degree,
        description: `Дом ${house.number} в ${house.sign}`
      })),
      aspects: generateAspects(planets),
      julianDay
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in astrology API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Функция для генерации аспектов
function generateAspects(planets: any[]) {
  const aspects = []
  const mainPlanets = planets.filter(p => 
    ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.name)
  )

  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const planet1 = mainPlanets[i]
      const planet2 = mainPlanets[j]

      const angleDiff = Math.abs(planet1.longitude - planet2.longitude)
      let normalizedDiff = angleDiff
      if (normalizedDiff > 180) normalizedDiff = 360 - normalizedDiff

      // Определяем тип аспекта
      let aspectType = null
      let orb = 0

      if (normalizedDiff <= 8) {
        aspectType = 'Conjunction'
        orb = normalizedDiff
      } else if (Math.abs(normalizedDiff - 180) <= 8) {
        aspectType = 'Opposition'
        orb = Math.abs(normalizedDiff - 180)
      } else if (Math.abs(normalizedDiff - 120) <= 8) {
        aspectType = 'Trine'
        orb = Math.abs(normalizedDiff - 120)
      } else if (Math.abs(normalizedDiff - 90) <= 8) {
        aspectType = 'Square'
        orb = Math.abs(normalizedDiff - 90)
      } else if (Math.abs(normalizedDiff - 60) <= 8) {
        aspectType = 'Sextile'
        orb = Math.abs(normalizedDiff - 60)
      }

      if (aspectType) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: aspectType,
          orb,
          description: `${aspectType} между ${planet1.name} и ${planet2.name}`
        })
      }
    }
  }

  return aspects
}
