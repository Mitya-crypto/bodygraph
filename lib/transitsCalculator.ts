// lib/transitsCalculator.ts

import { ChartData } from './swissEphemeris'

export interface TransitData {
  planet: string
  currentPosition: number
  natalPosition: number
  aspect: TransitAspect | null
  orb: number
  influence: TransitInfluence
  description: string
}

export interface TransitAspect {
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx' | 'semisextile'
  symbol: string
  orb: number
  strength: 'exact' | 'strong' | 'medium' | 'weak'
}

export interface TransitInfluence {
  intensity: 'high' | 'medium' | 'low'
  nature: 'positive' | 'negative' | 'neutral' | 'challenging'
  areas: string[]
  duration: string
  advice: string
}

export interface TransitReport {
  date: string
  natalChart: ChartData
  currentChart: ChartData
  transits: TransitData[]
  summary: {
    totalTransits: number
    majorTransits: number
    overallInfluence: 'very_positive' | 'positive' | 'neutral' | 'challenging' | 'very_challenging'
    keyThemes: string[]
    recommendations: string[]
  }
}

export class TransitsCalculator {
  // Основные аспекты и их орбы
  private static readonly ASPECTS = {
    conjunction: { degrees: 0, orb: 8, symbol: '☌', strength: 'strong' },
    opposition: { degrees: 180, orb: 8, symbol: '☍', strength: 'strong' },
    trine: { degrees: 120, orb: 6, symbol: '△', strength: 'strong' },
    square: { degrees: 90, orb: 6, symbol: '□', strength: 'challenging' },
    sextile: { degrees: 60, orb: 4, symbol: '⚹', strength: 'medium' },
    quincunx: { degrees: 150, orb: 3, symbol: '⚻', strength: 'weak' },
    semisextile: { degrees: 30, orb: 2, symbol: '⚺', strength: 'weak' }
  }

  // Планеты для анализа транзитов
  private static readonly TRANSIT_PLANETS = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
    'Uranus', 'Neptune', 'Pluto'
  ]

  // Влияние планет на разные сферы жизни
  private static readonly PLANET_INFLUENCES = {
    Sun: {
      areas: ['личность', 'творчество', 'здоровье', 'авторитет'],
      nature: 'positive',
      intensity: 'high'
    },
    Moon: {
      areas: ['эмоции', 'дом', 'семья', 'интуиция'],
      nature: 'neutral',
      intensity: 'medium'
    },
    Mercury: {
      areas: ['коммуникация', 'обучение', 'путешествия', 'торговля'],
      nature: 'neutral',
      intensity: 'medium'
    },
    Venus: {
      areas: ['любовь', 'красота', 'искусство', 'финансы'],
      nature: 'positive',
      intensity: 'medium'
    },
    Mars: {
      areas: ['энергия', 'действие', 'конфликты', 'спорт'],
      nature: 'challenging',
      intensity: 'high'
    },
    Jupiter: {
      areas: ['удача', 'расширение', 'философия', 'путешествия'],
      nature: 'positive',
      intensity: 'high'
    },
    Saturn: {
      areas: ['ответственность', 'ограничения', 'дисциплина', 'время'],
      nature: 'challenging',
      intensity: 'high'
    },
    Uranus: {
      areas: ['революция', 'инновации', 'свобода', 'внезапные изменения'],
      nature: 'neutral',
      intensity: 'high'
    },
    Neptune: {
      areas: ['духовность', 'интуиция', 'искусство', 'иллюзии'],
      nature: 'neutral',
      intensity: 'medium'
    },
    Pluto: {
      areas: ['трансформация', 'власть', 'секреты', 'возрождение'],
      nature: 'challenging',
      intensity: 'very_high'
    }
  }

  /**
   * Рассчитывает транзиты для заданной даты
   */
  static async calculateTransits(
    natalChart: ChartData,
    targetDate: Date = new Date()
  ): Promise<TransitReport> {
    console.log('🔄 Calculating transits for date:', targetDate.toISOString())

    // Рассчитываем текущие позиции планет
    const currentChart = await this.calculateCurrentChart(targetDate, natalChart)
    
    // Находим аспекты между текущими и натальными позициями
    const transits = this.findTransits(natalChart, currentChart)
    
    // Генерируем отчет
    const report = this.generateReport(natalChart, currentChart, transits, targetDate)
    
    console.log('✅ Transits calculated:', report.summary)
    return report
  }

  /**
   * Рассчитывает текущие позиции планет
   */
  private static async calculateCurrentChart(
    date: Date,
    natalChart: ChartData
  ): Promise<ChartData> {
    try {
      // Используем Swiss Ephemeris для расчета текущих позиций
      const { calculateNatalChart } = await import('./swissEphemeris')
      
      const currentChart = await calculateNatalChart({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        latitude: (natalChart as any).birthData.latitude,
        longitude: (natalChart as any).birthData.longitude,
        timezone: 0
      })

      return currentChart
    } catch (error) {
      console.error('❌ Error calculating current chart:', error)
      
      // Fallback: генерируем моковые данные
      return this.generateMockCurrentChart(date, natalChart)
    }
  }

  /**
   * Генерирует моковые текущие позиции планет
   */
  private static generateMockCurrentChart(date: Date, natalChart: ChartData): ChartData {
    const timeDiff = (date.getTime() - new Date((natalChart as any).birthData.year, (natalChart as any).birthData.month - 1, (natalChart as any).birthData.day).getTime()) / (1000 * 60 * 60 * 24)
    
    // Средние скорости планет в градусах в день
    const defaultSpeeds: { [key: string]: number } = {
      'Sun': 1.0,
      'Moon': 13.2,
      'Mercury': 1.4,
      'Venus': 1.2,
      'Mars': 0.5,
      'Jupiter': 0.08,
      'Saturn': 0.03,
      'Uranus': 0.01,
      'Neptune': 0.006,
      'Pluto': 0.004
    }
    
    return {
      ...natalChart,
      birthData: {
        ...(natalChart as any).birthData,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        latitude: (natalChart as any).birthData.latitude,
        longitude: (natalChart as any).birthData.longitude,
        timezone: 0
      },
      planets: natalChart.planets.map(planet => {
        const speed = planet.speed || defaultSpeeds[planet.name] || 1.0
        const newLongitude = (planet.longitude + (timeDiff * speed)) % 360
        
        return {
          ...planet,
          longitude: newLongitude >= 0 ? newLongitude : newLongitude + 360,
          speed: speed
        }
      })
    } as any
  }

  /**
   * Находит транзиты между текущими и натальными позициями
   */
  private static findTransits(natalChart: ChartData, currentChart: ChartData): TransitData[] {
    const transits: TransitData[] = []

    for (const transitPlanet of this.TRANSIT_PLANETS) {
      // Находим текущую позицию планеты
      const currentPlanet = currentChart.planets.find(p => p.name === transitPlanet)
      if (!currentPlanet) continue

      // Ищем аспекты с натальными планетами
      for (const natalPlanet of natalChart.planets) {
        const aspect = this.calculateAspect(currentPlanet.longitude, natalPlanet.longitude)
        
        if (aspect) {
          const transit = this.createTransitData(
            transitPlanet,
            currentPlanet.longitude,
            natalPlanet.longitude,
            aspect,
            natalPlanet.name
          )
          transits.push(transit)
        }
      }

      // Также проверяем аспекты с куспидами домов
      for (const house of natalChart.houses) {
        const aspect = this.calculateAspect(currentPlanet.longitude, (house as any).cusp)
        
        if (aspect) {
          const transit = this.createTransitData(
            transitPlanet,
            currentPlanet.longitude,
            (house as any).cusp,
            aspect,
            `Дом ${house.number}`
          )
          transits.push(transit)
        }
      }
    }

    // Сортируем по силе влияния
    return transits.sort((a, b) => this.getAspectStrength(b.aspect!) - this.getAspectStrength(a.aspect!))
  }

  /**
   * Рассчитывает аспект между двумя позициями
   */
  private static calculateAspect(pos1: number, pos2: number): TransitAspect | null {
    let diff = Math.abs(pos1 - pos2)
    if (diff > 180) diff = 360 - diff

    for (const [aspectName, aspectData] of Object.entries(this.ASPECTS)) {
      const aspectDiff = Math.abs(diff - aspectData.degrees)
      if (aspectDiff <= aspectData.orb) {
        return {
          type: aspectName as any,
          symbol: aspectData.symbol,
          orb: aspectDiff,
          strength: this.getStrengthByOrb(aspectDiff, aspectData.orb)
        }
      }
    }

    return null
  }

  /**
   * Определяет силу аспекта по орбу
   */
  private static getStrengthByOrb(orb: number, maxOrb: number): 'exact' | 'strong' | 'medium' | 'weak' {
    const percentage = (maxOrb - orb) / maxOrb
    
    if (percentage >= 0.9) return 'exact'
    if (percentage >= 0.7) return 'strong'
    if (percentage >= 0.5) return 'medium'
    return 'weak'
  }

  /**
   * Получает числовое значение силы аспекта для сортировки
   */
  private static getAspectStrength(aspect: TransitAspect): number {
    const strengthValues = { exact: 4, strong: 3, medium: 2, weak: 1 }
    const typeValues = { 
      conjunction: 4, opposition: 4, square: 3, trine: 3, 
      sextile: 2, quincunx: 1, semisextile: 1 
    }
    
    return strengthValues[aspect.strength] * typeValues[aspect.type]
  }

  /**
   * Создает данные транзита
   */
  private static createTransitData(
    planet: string,
    currentPos: number,
    natalPos: number,
    aspect: TransitAspect,
    target: string
  ): TransitData {
    const planetInfo = this.PLANET_INFLUENCES[planet as keyof typeof this.PLANET_INFLUENCES]
    const influence = this.calculateInfluence(planet, aspect, target)
    const description = this.generateDescription(planet, aspect, target, influence)

    return {
      planet,
      currentPosition: currentPos,
      natalPosition: natalPos,
      aspect,
      orb: aspect.orb,
      influence,
      description
    }
  }

  /**
   * Рассчитывает влияние транзита
   */
  private static calculateInfluence(
    planet: string,
    aspect: TransitAspect,
    target: string
  ): TransitInfluence {
    const planetInfo = this.PLANET_INFLUENCES[planet as keyof typeof this.PLANET_INFLUENCES]
    
    // Определяем интенсивность
    let intensity: 'high' | 'medium' | 'low' = 'medium'
    if (aspect.strength === 'exact' || aspect.strength === 'strong') {
      intensity = 'high'
    } else if (aspect.strength === 'weak') {
      intensity = 'low'
    }

    // Определяем природу влияния
    let nature: 'positive' | 'negative' | 'neutral' | 'challenging' = 'neutral'
    if (aspect.type === 'conjunction' || aspect.type === 'trine' || aspect.type === 'sextile') {
      nature = planetInfo.nature === 'positive' ? 'positive' : 'neutral'
    } else if (aspect.type === 'square' || aspect.type === 'opposition') {
      nature = planetInfo.nature === 'challenging' ? 'challenging' : 'negative'
    } else {
      nature = 'neutral'
    }

    // Определяем области влияния
    const areas = planetInfo.areas
    const duration = this.getTransitDuration(planet, aspect)
    const advice = this.generateAdvice(planet, aspect, nature)

    return {
      intensity,
      nature,
      areas,
      duration,
      advice
    }
  }

  /**
   * Определяет длительность транзита
   */
  private static getTransitDuration(planet: string, aspect: TransitAspect): string {
    const durations: Record<string, string> = {
      Sun: '1-2 дня',
      Moon: '2-3 часа',
      Mercury: '1-2 дня',
      Venus: '1-2 дня',
      Mars: '2-3 дня',
      Jupiter: '2-3 недели',
      Saturn: '2-3 месяца',
      Uranus: '6-12 месяцев',
      Neptune: '1-2 года',
      Pluto: '2-3 года'
    }

    return durations[planet] || 'неопределенно'
  }

  /**
   * Генерирует описание транзита
   */
  private static generateDescription(
    planet: string,
    aspect: TransitAspect,
    target: string,
    influence: TransitInfluence
  ): string {
    const planetNames: Record<string, string> = {
      Sun: 'Солнце',
      Moon: 'Луна',
      Mercury: 'Меркурий',
      Venus: 'Венера',
      Mars: 'Марс',
      Jupiter: 'Юпитер',
      Saturn: 'Сатурн',
      Uranus: 'Уран',
      Neptune: 'Нептун',
      Pluto: 'Плутон'
    }

    const aspectNames: Record<string, string> = {
      conjunction: 'соединение',
      opposition: 'оппозиция',
      trine: 'трин',
      square: 'квадрат',
      sextile: 'секстиль',
      quincunx: 'квинконс',
      semisextile: 'полусекстиль'
    }

    const natureDescriptions: Record<string, string> = {
      positive: 'благоприятное',
      negative: 'неблагоприятное',
      neutral: 'нейтральное',
      challenging: 'сложное'
    }

    const intensityDescriptions: Record<string, string> = {
      high: 'сильное',
      medium: 'умеренное',
      low: 'слабое'
    }

    return `${planetNames[planet]} в ${aspectNames[aspect.type]} с ${target}. ${intensityDescriptions[influence.intensity]} ${natureDescriptions[influence.nature]} влияние.`
  }

  /**
   * Генерирует совет по транзиту
   */
  private static generateAdvice(
    planet: string,
    aspect: TransitAspect,
    nature: 'positive' | 'negative' | 'neutral' | 'challenging'
  ): string {
    const adviceMap: Record<string, Record<string, string>> = {
      Sun: {
        positive: 'Отличное время для проявления лидерских качеств и творческих проектов.',
        negative: 'Будьте осторожны с авторитетными фигурами и избегайте конфликтов.',
        neutral: 'Фокус на саморазвитии и личных целях.',
        challenging: 'Время испытаний, но и роста через преодоление препятствий.'
      },
      Moon: {
        positive: 'Благоприятное время для семейных дел и эмоциональной близости.',
        negative: 'Избегайте эмоциональных решений, берегите нервную систему.',
        neutral: 'Обратите внимание на интуицию и эмоциональные потребности.',
        challenging: 'Эмоциональные испытания помогут стать сильнее.'
      },
      // Добавим остальные планеты...
    }

    return adviceMap[planet]?.[nature] || 'Используйте это время для самоанализа и развития.'
  }

  /**
   * Генерирует общий отчет
   */
  private static generateReport(
    natalChart: ChartData,
    currentChart: ChartData,
    transits: TransitData[],
    date: Date
  ): TransitReport {
    const majorTransits = transits.filter(t => 
      t.aspect?.strength === 'exact' || t.aspect?.strength === 'strong'
    )

    const overallInfluence = this.calculateOverallInfluence(transits)
    const keyThemes = this.extractKeyThemes(transits)
    const recommendations = this.generateRecommendations(transits, overallInfluence)

    return {
      date: date.toISOString(),
      natalChart,
      currentChart,
      transits,
      summary: {
        totalTransits: transits.length,
        majorTransits: majorTransits.length,
        overallInfluence,
        keyThemes,
        recommendations
      }
    }
  }

  /**
   * Рассчитывает общее влияние транзитов
   */
  private static calculateOverallInfluence(transits: TransitData[]): 
    'very_positive' | 'positive' | 'neutral' | 'challenging' | 'very_challenging' {
    
    if (transits.length === 0) return 'neutral'

    let positiveScore = 0
    let negativeScore = 0

    for (const transit of transits) {
      const weight = this.getAspectStrength(transit.aspect!)
      
      if (transit.influence.nature === 'positive') {
        positiveScore += weight
      } else if (transit.influence.nature === 'negative' || transit.influence.nature === 'challenging') {
        negativeScore += weight
      }
    }

    const ratio = positiveScore / (positiveScore + negativeScore || 1)
    
    if (ratio >= 0.7) return 'very_positive'
    if (ratio >= 0.6) return 'positive'
    if (ratio <= 0.3) return 'very_challenging'
    if (ratio <= 0.4) return 'challenging'
    return 'neutral'
  }

  /**
   * Извлекает ключевые темы
   */
  private static extractKeyThemes(transits: TransitData[]): string[] {
    const themes: string[] = []
    
    for (const transit of transits) {
      if (transit.aspect?.strength === 'exact' || transit.aspect?.strength === 'strong') {
        themes.push(...transit.influence.areas)
      }
    }

    // Убираем дубликаты и возвращаем топ-5
    return Array.from(new Set(themes)).slice(0, 5)
  }

  /**
   * Генерирует рекомендации
   */
  private static generateRecommendations(
    transits: TransitData[],
    overallInfluence: string
  ): string[] {
    const recommendations: string[] = []

    // Общие рекомендации по общему влиянию
    switch (overallInfluence) {
      case 'very_positive':
        recommendations.push('Отличное время для новых начинаний и важных решений.')
        recommendations.push('Используйте благоприятную энергию для достижения целей.')
        break
      case 'positive':
        recommendations.push('Хорошее время для развития и роста.')
        break
      case 'challenging':
        recommendations.push('Время испытаний - будьте терпеливы и настойчивы.')
        recommendations.push('Фокусируйтесь на решении проблем, а не на их избегании.')
        break
      case 'very_challenging':
        recommendations.push('Сложный период - избегайте важных решений.')
        recommendations.push('Фокус на внутренней работе и саморазвитии.')
        break
      default:
        recommendations.push('Нейтральное время - хороший момент для планирования.')
    }

    // Рекомендации по конкретным транзитам
    const majorTransits = transits.filter(t => 
      t.aspect?.strength === 'exact' || t.aspect?.strength === 'strong'
    )

    for (const transit of majorTransits.slice(0, 3)) {
      if (transit.influence.advice) {
        recommendations.push(transit.influence.advice)
      }
    }

    return recommendations.slice(0, 5)
  }
}

export default TransitsCalculator

