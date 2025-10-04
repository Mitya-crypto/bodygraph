// app/api/transits/route.ts

import { NextRequest, NextResponse } from 'next/server'
import TransitsCalculator, { TransitReport } from '@/lib/transitsCalculator'
import { ChartData } from '@/lib/swissEphemeris'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      natalChart, 
      targetDate = new Date().toISOString(),
      includeMinorTransits = false 
    } = body

    console.log('🔄 Transits API called')
    console.log('📝 Full request body:', JSON.stringify(body, null, 2))
    console.log('📝 natalChart:', natalChart)
    console.log('📝 Has birthData:', !!natalChart?.birthData)
    console.log('📝 Has planets:', !!natalChart?.planets)

    if (!natalChart) {
      console.error('❌ No natal chart provided')
      return NextResponse.json({
        success: false,
        error: 'Natal chart data is required'
      }, { status: 400 })
    }

    // Валидируем данные натальной карты
    if (!natalChart.birthData || !natalChart.planets) {
      console.error('❌ Invalid natal chart structure:', {
        hasBirthData: !!natalChart.birthData,
        hasPlanets: !!natalChart.planets,
        natalChartKeys: Object.keys(natalChart)
      })
      return NextResponse.json({
        success: false,
        error: `Invalid natal chart data structure. Missing: ${!natalChart.birthData ? 'birthData' : ''} ${!natalChart.planets ? 'planets' : ''}`
      }, { status: 400 })
    }

    // Парсим целевую дату
    const targetDateObj = new Date(targetDate)
    if (isNaN(targetDateObj.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid target date format'
      }, { status: 400 })
    }

    console.log('📊 Calculating transits for:', {
      birthDate: `${natalChart.birthData.year}-${natalChart.birthData.month}-${natalChart.birthData.day}`,
      targetDate: targetDateObj.toISOString(),
      location: `${natalChart.birthData.latitude}, ${natalChart.birthData.longitude}`
    })

    // Рассчитываем транзиты
    const transitReport = await TransitsCalculator.calculateTransits(natalChart, targetDateObj)

    // Фильтруем минорные транзиты если нужно
    if (!includeMinorTransits) {
      transitReport.transits = transitReport.transits.filter(transit => 
        transit.aspect?.strength === 'exact' || 
        transit.aspect?.strength === 'strong' ||
        transit.aspect?.strength === 'medium'
      )
    }

    console.log('✅ Transits calculated successfully:', {
      totalTransits: transitReport.transits.length,
      majorTransits: transitReport.summary.majorTransits,
      overallInfluence: transitReport.summary.overallInfluence
    })

    return NextResponse.json({
      success: true,
      data: transitReport
    })

  } catch (error) {
    console.error('❌ Transits API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: true
    }, { status: 500 })
  }
}

// GET endpoint для получения информации о транзитах
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    console.log('📅 Transits info request for date:', date)

    const info = {
      description: 'API для расчета астрологических транзитов',
      features: [
        'Расчет текущих позиций планет',
        'Анализ аспектов между транзитными и натальными планетами',
        'Оценка влияния транзитов на разные сферы жизни',
        'Рекомендации по использованию транзитной энергии'
      ],
      planets: [
        'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
        'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
      ],
      aspects: [
        'conjunction (соединение)',
        'opposition (оппозиция)', 
        'trine (трин)',
        'square (квадрат)',
        'sextile (секстиль)',
        'quincunx (квинконс)',
        'semisextile (полусекстиль)'
      ],
      usage: {
        method: 'POST',
        required: ['natalChart'],
        optional: ['targetDate', 'includeMinorTransits'],
        example: {
          natalChart: 'ChartData object from astrology API',
          targetDate: '2024-01-15T12:00:00.000Z',
          includeMinorTransits: false
        }
      }
    }

    return NextResponse.json({
      success: true,
      info
    })

  } catch (error) {
    console.error('❌ Transits info error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

