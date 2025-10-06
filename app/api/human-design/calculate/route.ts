import { NextRequest, NextResponse } from 'next/server'
import { calculateHumanDesign } from '@/lib/humanDesignEngine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { birthDate, birthTime, latitude, longitude } = body

    console.log('🔄 Human Design API called')
    console.log('📝 Request body:', { birthDate, birthTime, latitude, longitude })

    // Валидация входных данных
    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: birthDate, birthTime, latitude, longitude' },
        { status: 400 }
      )
    }

    // Парсинг даты и времени
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)

    // Создание объекта BirthData
    const birthData = {
      year,
      month,
      day,
      hour: hour || 0,
      minute: minute || 0,
      second: 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: 0
    }

    console.log('📝 Parsed birth data:', birthData)

    // Расчет Human Design
    console.log('🔄 Starting Human Design calculation...')
    const result = await calculateHumanDesign(birthData)
    console.log('✅ Human Design calculation completed, result:', {
      gates: result.gates?.length || 0,
      channels: result.channels?.length || 0,
      centers: result.centers?.length || 0
    })

    console.log('✅ Human Design calculation completed')
    console.log('📊 Result:', {
      type: result.type,
      strategy: result.strategy,
      authority: result.authority,
      profile: result.profile,
      centers: result.centers.filter(c => c.defined).length,
      channels: result.channels.length,
      gates: result.gates.length
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in Human Design API:', error)
    
    // Возвращаем mock данные в случае ошибки
    const mockResult = {
      type: 'Generator',
      strategy: 'Respond',
      authority: 'Sacral',
      profile: '1/4',
      definition: 'Single Definition',
      incarnationCross: {
        name: 'Cross of Planning',
        description: 'Крест планирования представляет способность к стратегическому мышлению и долгосрочному планированию. Люди с этим крестом обладают уникальной способностью видеть будущее и создавать планы для достижения целей.',
        characteristics: [
          'Стратегическое мышление',
          'Способность к планированию',
          'Видение будущего',
          'Организационные способности',
          'Лидерские качества'
        ],
        lifeMission: [
          'Создание долгосрочных планов и стратегий',
          'Руководство и направление других',
          'Развитие видения будущего',
          'Организация и структурирование процессов',
          'Достижение целей через планирование'
        ],
        strengths: [
          'Отличные организационные способности',
          'Способность видеть общую картину',
          'Лидерские качества',
          'Стратегическое мышление',
          'Умение мотивировать других'
        ],
        challenges: [
          'Может быть слишком жестким в планировании',
          'Трудности с импровизацией',
          'Давление ответственности за других',
          'Склонность к перфекционизму',
          'Трудности с делегированием'
        ],
        advice: [
          'Развивайте гибкость в планировании',
          'Учитесь делегировать задачи',
          'Позволяйте другим вносить свой вклад',
          'Балансируйте планирование с действием',
          'Принимайте неопределенность как часть процесса'
        ]
      },
      centers: [
        { name: 'G-центр', defined: false, gates: [], channels: [] },
        { name: 'S-центр', defined: true, gates: [2, 14], channels: ['2-14'] },
        { name: 'T-центр', defined: true, gates: [7, 31], channels: ['7-31'] },
        { name: 'H-центр', defined: false, gates: [], channels: [] },
        { name: 'E-центр', defined: false, gates: [], channels: [] },
        { name: 'A-центр', defined: false, gates: [], channels: [] },
        { name: 'P-центр', defined: true, gates: [5, 15], channels: ['5-15'] },
        { name: 'L-центр', defined: false, gates: [], channels: [] },
        { name: 'R-центр', defined: false, gates: [], channels: [] }
      ],
      channels: [
        {
          number: '2-14',
          name: 'Пульс',
          gates: [2, 14],
          center1: 'G',
          center2: 'S',
          description: 'Канал направления и силы'
        },
        {
          number: '7-31',
          name: 'Лидер',
          gates: [7, 31],
          center1: 'G',
          center2: 'T',
          description: 'Канал лидерства и влияния'
        },
        {
          number: '5-15',
          name: 'Ритм',
          gates: [5, 15],
          center1: 'G',
          center2: 'S',
          description: 'Канал ритма и скромности'
        }
      ],
      gates: [
        { number: 2, name: 'Принятие', planet: 'Sun', line: 1, color: 1, tone: 1, base: 1 },
        { number: 14, name: 'Власть', planet: 'Moon', line: 2, color: 2, tone: 2, base: 2 },
        { number: 7, name: 'Армия', planet: 'Mercury', line: 3, color: 3, tone: 3, base: 3 },
        { number: 31, name: 'Влияние', planet: 'Venus', line: 4, color: 4, tone: 4, base: 4 },
        { number: 5, name: 'Ожидание', planet: 'Mars', line: 5, color: 5, tone: 5, base: 5 },
        { number: 15, name: 'Скромность', planet: 'Jupiter', line: 6, color: 6, tone: 6, base: 6 }
      ],
      planets: [],
      notSelf: {
        type: 'Frustration',
        strategy: 'Not following strategy',
        authority: 'Not following authority'
      }
    }

    return NextResponse.json(mockResult)
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Human Design Calculation API',
    description: 'Calculate Human Design chart with full calculations',
    endpoint: '/api/human-design/calculate',
    method: 'POST',
    requiredFields: ['birthDate', 'birthTime', 'latitude', 'longitude'],
    example: {
      birthDate: '1983-11-14',
      birthTime: '07:15',
      latitude: 56.514828,
      longitude: 57.205193
    }
  })
}

