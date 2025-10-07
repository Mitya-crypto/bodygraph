import { UserProfile } from '@/store/appStore'

export interface SynastryAspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  harmony: number // -1 to 1, where -1 is very tense, 1 is very harmonious
  description: string
}

export interface SynastryHouse {
  planet: string
  house: number
  houseName: string
  influence: string
  description: string
}

export interface SynastryResult {
  overallCompatibility: number
  romanticCompatibility: number
  friendshipCompatibility: number
  aspects: SynastryAspect[]
  houses: SynastryHouse[]
  keyPoints: {
    strengths: string[]
    challenges: string[]
    growth: string[]
  }
  summary: string
}

/**
 * Основная функция расчета синастрии
 */
export async function calculateSynastry(
  profile1: UserProfile, 
  profile2: UserProfile
): Promise<SynastryResult> {
  try {
    console.log('Начинаем расчет синастрии для:', profile1.name, 'и', profile2.name)
    
    // В реальном приложении здесь были бы сложные астрологические расчеты
    // Пока используем демонстрационные данные
    const aspects = calculateAspects(profile1, profile2)
    const houses = calculateHousePlacements(profile1, profile2)
    const compatibility = calculateCompatibility(aspects, houses)
    
    const result: SynastryResult = {
      overallCompatibility: compatibility.overall,
      romanticCompatibility: compatibility.romantic,
      friendshipCompatibility: compatibility.friendship,
      aspects,
      houses,
      keyPoints: generateKeyPoints(aspects, houses),
      summary: generateSummary(compatibility, aspects)
    }
    
    console.log('Расчет синастрии завершен')
    return result
  } catch (error) {
    console.error('Ошибка расчета синастрии:', error)
    throw error
  }
}

/**
 * Рассчитывает аспекты между планетами
 */
function calculateAspects(profile1: UserProfile, profile2: UserProfile): SynastryAspect[] {
  // Демонстрационные данные - в реальном приложении здесь были бы точные расчеты
  const aspects: SynastryAspect[] = [
    {
      planet1: 'Солнце',
      planet2: 'Луна',
      aspect: 'Трин',
      orb: 2.3,
      harmony: 0.8,
      description: 'Гармоничное взаимодействие между сознанием и эмоциями. Вы интуитивно понимаете друг друга и создаете эмоциональную безопасность.'
    },
    {
      planet1: 'Венера',
      planet2: 'Марс',
      aspect: 'Соединение',
      orb: 1.5,
      harmony: 0.6,
      description: 'Сильное притяжение и страсть. Эмоциональная и физическая совместимость, но возможны конфликты из-за разного проявления чувств.'
    },
    {
      planet1: 'Меркурий',
      planet2: 'Меркурий',
      aspect: 'Квадрат',
      orb: 3.1,
      harmony: -0.4,
      description: 'Разное мышление может приводить к недопониманию в общении, но также создает интеллектуальный вызов и стимулирует развитие.'
    },
    {
      planet1: 'Солнце',
      planet2: 'Венера',
      aspect: 'Секстиль',
      orb: 4.2,
      harmony: 0.7,
      description: 'Легкость в романтических отношениях. Партнеры естественно притягиваются друг к другу и наслаждаются обществом друг друга.'
    },
    {
      planet1: 'Луна',
      planet2: 'Марс',
      aspect: 'Оппозиция',
      orb: 2.8,
      harmony: -0.3,
      description: 'Эмоциональные реакции могут быть разными и приводить к конфликтам, но также создают сильную страсть и интенсивность в отношениях.'
    }
  ]
  
  return aspects
}

/**
 * Рассчитывает размещение планет в домах партнера
 */
function calculateHousePlacements(profile1: UserProfile, profile2: UserProfile): SynastryHouse[] {
  const houses: SynastryHouse[] = [
    {
      planet: 'Солнце',
      house: 7,
      houseName: 'Дом партнерства',
      influence: 'Очень сильное',
      description: 'Партнер воспринимается как идеальная вторая половинка. Сильное желание быть в отношениях.'
    },
    {
      planet: 'Луна',
      house: 4,
      houseName: 'Дом семьи',
      influence: 'Положительное',
      description: 'Эмоциональная близость и общие семейные ценности. Партнер создает ощущение "дома".'
    },
    {
      planet: 'Марс',
      house: 8,
      houseName: 'Дом трансформации',
      influence: 'Интенсивное',
      description: 'Глубокие страсти и трансформационные процессы. Отношения могут быть очень интенсивными.'
    },
    {
      planet: 'Венера',
      house: 5,
      houseName: 'Дом любви и творчества',
      influence: 'Гармоничное',
      description: 'Романтические отношения и совместное творчество. Легкость в выражении чувств.'
    },
    {
      planet: 'Меркурий',
      house: 3,
      houseName: 'Дом общения',
      influence: 'Активное',
      description: 'Много общения и интеллектуального обмена. Возможны споры, но и интересные дискуссии.'
    },
    {
      planet: 'Юпитер',
      house: 9,
      houseName: 'Дом философии',
      influence: 'Расширяющее',
      description: 'Совместное изучение и расширение горизонтов. Партнер помогает расти и развиваться.'
    }
  ]
  
  return houses
}

/**
 * Рассчитывает общую совместимость
 */
function calculateCompatibility(aspects: SynastryAspect[], houses: SynastryHouse[]) {
  // Подсчитываем гармоничные и напряженные аспекты
  let harmoniousCount = 0
  let tenseCount = 0
  let neutralCount = 0
  
  aspects.forEach(aspect => {
    if (aspect.harmony >= 0.5) harmoniousCount++
    else if (aspect.harmony <= -0.3) tenseCount++
    else neutralCount++
  })
  
  // Базовый расчет совместимости
  const baseCompatibility = (harmoniousCount * 20 + neutralCount * 10 - tenseCount * 15) + 50
  const overall = Math.max(0, Math.min(100, baseCompatibility))
  
  // Романтическая совместимость (больше веса Венере и Марсу)
  const romanticAspects = aspects.filter(a => 
    a.planet1.includes('Венера') || a.planet2.includes('Венера') ||
    a.planet1.includes('Марс') || a.planet2.includes('Марс')
  )
  const romanticScore = romanticAspects.length > 0 
    ? romanticAspects.reduce((sum, a) => sum + (a.harmony * 20), 0) / romanticAspects.length + 50
    : overall
  const romantic = Math.max(0, Math.min(100, romanticScore))
  
  // Дружеская совместимость (больше веса Солнцу, Луне, Меркурию)
  const friendshipAspects = aspects.filter(a => 
    a.planet1.includes('Солнце') || a.planet2.includes('Солнце') ||
    a.planet1.includes('Луна') || a.planet2.includes('Луна') ||
    a.planet1.includes('Меркурий') || a.planet2.includes('Меркурий')
  )
  const friendshipScore = friendshipAspects.length > 0 
    ? friendshipAspects.reduce((sum, a) => sum + (a.harmony * 15), 0) / friendshipAspects.length + 50
    : overall
  const friendship = Math.max(0, Math.min(100, friendshipScore))
  
  return { overall, romantic, friendship }
}

/**
 * Генерирует ключевые точки совместимости
 */
function generateKeyPoints(aspects: SynastryAspect[], houses: SynastryHouse[]) {
  const strengths: string[] = []
  const challenges: string[] = []
  const growth: string[] = []
  
  // Анализируем аспекты для определения сильных сторон
  aspects.forEach(aspect => {
    if (aspect.harmony >= 0.6) {
      if (aspect.planet1.includes('Солнце') || aspect.planet2.includes('Солнце')) {
        strengths.push('Гармоничное взаимодействие личностей')
      }
      if (aspect.planet1.includes('Луна') || aspect.planet2.includes('Луна')) {
        strengths.push('Эмоциональная совместимость')
      }
      if (aspect.planet1.includes('Венера') || aspect.planet2.includes('Венера')) {
        strengths.push('Романтическая гармония')
      }
      if (aspect.planet1.includes('Меркурий') || aspect.planet2.includes('Меркурий')) {
        strengths.push('Интеллектуальное взаимопонимание')
      }
    }
    
    if (aspect.harmony <= -0.3) {
      if (aspect.planet1.includes('Меркурий') || aspect.planet2.includes('Меркурий')) {
        challenges.push('Различия в общении и мышлении')
      }
      if (aspect.planet1.includes('Марс') || aspect.planet2.includes('Марс')) {
        challenges.push('Возможные конфликты в действиях')
      }
      if (aspect.planet1.includes('Сатурн') || aspect.planet2.includes('Сатурн')) {
        challenges.push('Разное отношение к ответственности')
      }
    }
    
    // Точки роста
    if (aspect.harmony >= -0.2 && aspect.harmony <= 0.2) {
      growth.push('Развитие терпимости к различиям')
    }
  })
  
  // Анализируем дома
  houses.forEach(house => {
    if (house.influence === 'Очень сильное' || house.influence === 'Гармоничное') {
      if (house.house === 7) strengths.push('Сильное желание быть в партнерстве')
      if (house.house === 4) strengths.push('Общие семейные ценности')
      if (house.house === 5) strengths.push('Совместное творчество и развлечения')
    }
    
    if (house.influence === 'Интенсивное') {
      challenges.push('Интенсивные эмоции в отношениях')
      growth.push('Управление эмоциональной интенсивностью')
    }
  })
  
  // Убираем дубликаты
  return {
    strengths: [...new Set(strengths)],
    challenges: [...new Set(challenges)],
    growth: [...new Set(growth)]
  }
}

/**
 * Генерирует общее резюме совместимости
 */
function generateSummary(compatibility: any, aspects: SynastryAspect[]): string {
  const { overall, romantic, friendship } = compatibility
  
  let summary = ''
  
  if (overall >= 80) {
    summary = 'Ваша совместимость исключительно высока. У вас есть все предпосылки для гармоничных и долгосрочных отношений. '
  } else if (overall >= 60) {
    summary = 'У вас хорошая совместимость с потенциалом для развития отношений. '
  } else {
    summary = 'Ваша совместимость имеет свои особенности, требующие внимания и работы. '
  }
  
  const harmoniousAspects = aspects.filter(a => a.harmony >= 0.5).length
  const tenseAspects = aspects.filter(a => a.harmony <= -0.3).length
  
  if (harmoniousAspects > tenseAspects) {
    summary += 'Гармоничные аспекты преобладают, что создает основу для взаимопонимания. '
  } else if (tenseAspects > harmoniousAspects) {
    summary += 'Напряженные аспекты требуют осознанной работы над отношениями. '
  } else {
    summary += 'Баланс гармоничных и напряженных аспектов создает динамичные отношения. '
  }
  
  if (romantic > friendship) {
    summary += 'Романтическая совместимость выше дружеской, что указывает на сильное притяжение.'
  } else if (friendship > romantic) {
    summary += 'Дружеская совместимость выше романтической, что создает основу для стабильных отношений.'
  } else {
    summary += 'Романтическая и дружеская совместимость сбалансированы.'
  }
  
  return summary
}
