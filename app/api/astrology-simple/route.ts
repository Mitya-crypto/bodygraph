// app/api/astrology-simple/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Simple Astrology API called')
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

    // Простой расчет на основе даты рождения
    const birthDateObj = new Date(birthDate)
    const timeParts = birthTime.split(':')
    const hours = parseInt(timeParts[0] || '12')
    const minutes = parseInt(timeParts[1] || '0')

    // Генерируем псевдо-случайные данные на основе даты
    const seed = birthDateObj.getTime() + hours * 1000 + minutes
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000
      return x - Math.floor(x)
    }

    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    // Генерируем планеты
    const planets = [
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
    ].map((planet, index) => {
      const signIndex = Math.floor(seededRandom(seed + index) * signs.length)
      const sign = signs[signIndex]
      const degree = seededRandom(seed + index + 100) * 30
      const longitude = signIndex * 30 + degree
      
      return {
        name: planet.name,
        longitude,
        latitude: (seededRandom(seed + index + 200) - 0.5) * 10,
        sign,
        degree,
        house: Math.floor(seededRandom(seed + index + 300) * 12) + 1
      }
    })

    // Генерируем дома
    const houses = Array.from({ length: 12 }, (_, index) => {
      const signIndex = Math.floor(seededRandom(seed + 400 + index) * signs.length)
      const sign = signs[signIndex]
      const degree = seededRandom(seed + 500 + index) * 30
      const longitude = signIndex * 30 + degree
      
      return {
        number: index + 1,
        longitude,
        sign,
        degree
      }
    })

    const ascendant = houses[0]?.longitude || 0
    const mc = houses[9]?.longitude || 0

    // Генерируем аспекты
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
      aspects,
      julianDay: 2447892.5 // Примерный юлианский день
    }

    console.log('✅ Simple astrology calculation completed')
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Error in simple astrology API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}



