/**
 * Полноценная библиотека для расчетов Human Design
 * Включает все основные компоненты: планеты, ворота, центры, каналы, тип, стратегию, авторитет
 */

// Убираем импорт Swiss Ephemeris из клиентского кода

// Данные ворот Human Design
const GATES_DATA = {
  1: { name: 'Creative', description: 'Творческий потенциал' },
  2: { name: 'Receptive', description: 'Восприимчивость' },
  3: { name: 'Difficulty', description: 'Сложности и препятствия' },
  4: { name: 'Youthful Folly', description: 'Молодое невежество' },
  5: { name: 'Fixed Rhythms', description: 'Фиксированные ритмы' },
  6: { name: 'Friction', description: 'Трение и конфликты' },
  7: { name: 'The Army', description: 'Армия и организация' },
  8: { name: 'Holding Together', description: 'Сохранение единства' },
  9: { name: 'Focus', description: 'Фокус и концентрация' },
  10: { name: 'Treading', description: 'Следование пути' },
  11: { name: 'Ideas', description: 'Идеи и концепции' },
  12: { name: 'Standstill', description: 'Застой и остановка' },
  13: { name: 'The Listener', description: 'Слушатель' },
  14: { name: 'Power', description: 'Сила и власть' },
  15: { name: 'Modesty', description: 'Скромность' },
  16: { name: 'Enthusiasm', description: 'Энтузиазм' },
  17: { name: 'Following', description: 'Следование' },
  18: { name: 'Work', description: 'Работа' },
  19: { name: 'Approach', description: 'Подход' },
  20: { name: 'Contemplation', description: 'Созерцание' },
  21: { name: 'Biting Through', description: 'Прогрызание' },
  22: { name: 'Grace', description: 'Благодать' },
  23: { name: 'Splitting Apart', description: 'Разделение' },
  24: { name: 'Return', description: 'Возвращение' },
  25: { name: 'Innocence', description: 'Невинность' },
  26: { name: 'The Taming Power', description: 'Укрощающая сила' },
  27: { name: 'Nourishment', description: 'Питание' },
  28: { name: 'The Great Exceeding', description: 'Великое превышение' },
  29: { name: 'The Abysmal', description: 'Бездонное' },
  30: { name: 'The Clinging Fire', description: 'Цепляющийся огонь' },
  31: { name: 'Influence', description: 'Влияние' },
  32: { name: 'Duration', description: 'Длительность' },
  33: { name: 'Retreat', description: 'Отступление' },
  34: { name: 'The Power of the Great', description: 'Сила великого' },
  35: { name: 'Progress', description: 'Прогресс' },
  36: { name: 'Darkening of the Light', description: 'Затемнение света' },
  37: { name: 'The Family', description: 'Семья' },
  38: { name: 'Opposition', description: 'Оппозиция' },
  39: { name: 'Obstruction', description: 'Препятствие' },
  40: { name: 'Deliverance', description: 'Избавление' },
  41: { name: 'Decrease', description: 'Уменьшение' },
  42: { name: 'Increase', description: 'Увеличение' },
  43: { name: 'Breakthrough', description: 'Прорыв' },
  44: { name: 'Coming to Meet', description: 'Встреча' },
  45: { name: 'Gathering Together', description: 'Собирание вместе' },
  46: { name: 'Pushing Upward', description: 'Толкание вверх' },
  47: { name: 'Oppression', description: 'Угнетение' },
  48: { name: 'The Well', description: 'Колодец' },
  49: { name: 'Revolution', description: 'Революция' },
  50: { name: 'The Cauldron', description: 'Котел' },
  51: { name: 'The Arousing', description: 'Пробуждение' },
  52: { name: 'Keeping Still', description: 'Сохранение покоя' },
  53: { name: 'Development', description: 'Развитие' },
  54: { name: 'The Marrying Maiden', description: 'Выходящая замуж дева' },
  55: { name: 'Abundance', description: 'Изобилие' },
  56: { name: 'The Wanderer', description: 'Странник' },
  57: { name: 'The Gentle', description: 'Нежный' },
  58: { name: 'The Joyous', description: 'Радостный' },
  59: { name: 'Dispersion', description: 'Рассеивание' },
  60: { name: 'Limitation', description: 'Ограничение' },
  61: { name: 'Inner Truth', description: 'Внутренняя правда' },
  62: { name: 'Preponderance of the Small', description: 'Преобладание малого' },
  63: { name: 'After Completion', description: 'После завершения' },
  64: { name: 'Before Completion', description: 'До завершения' }
}

// Данные каналов Human Design
const CHANNELS_DATA = {
  '1-8': {
    name: 'Channel of Inspiration',
    gates: [1, 8],
    centers: ['G-Center', 'Throat'],
    description: 'Канал вдохновения - творческое самовыражение'
  },
  '2-14': {
    name: 'Channel of the Beat',
    gates: [2, 14],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал ритма - жизненная сила и направление'
  },
  '3-60': {
    name: 'Channel of Mutation',
    gates: [3, 60],
    centers: ['G-Center', 'Root'],
    description: 'Канал мутации - адаптация и изменения'
  },
  '4-63': {
    name: 'Channel of Logic',
    gates: [4, 63],
    centers: ['G-Center', 'Head'],
    description: 'Канал логики - ментальная активность'
  },
  '5-15': {
    name: 'Channel of Rhythm',
    gates: [5, 15],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал ритма - естественные циклы'
  },
  '6-59': {
    name: 'Channel of Mating',
    gates: [6, 59],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал спаривания - репродуктивная энергия'
  },
  '7-31': {
    name: 'Channel of the Alpha',
    gates: [7, 31],
    centers: ['G-Center', 'Throat'],
    description: 'Канал альфы - лидерство и направление'
  },
  '9-52': {
    name: 'Channel of Concentration',
    gates: [9, 52],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал концентрации - фокус и настойчивость'
  },
  '10-20': {
    name: 'Channel of Awakening',
    gates: [10, 20],
    centers: ['G-Center', 'Throat'],
    description: 'Канал пробуждения - осознанность'
  },
  '11-56': {
    name: 'Channel of Curiosity',
    gates: [11, 56],
    centers: ['G-Center', 'Throat'],
    description: 'Канал любопытства - поиск смысла'
  },
  '12-22': {
    name: 'Channel of Openness',
    gates: [12, 22],
    centers: ['G-Center', 'Throat'],
    description: 'Канал открытости - социальное взаимодействие'
  },
  '13-33': {
    name: 'Channel of the Prodigal',
    gates: [13, 33],
    centers: ['G-Center', 'Throat'],
    description: 'Канал блудного сына - опыт и мудрость'
  },
  '16-48': {
    name: 'Channel of the Wavelength',
    gates: [16, 48],
    centers: ['G-Center', 'Throat'],
    description: 'Канал длины волны - талант и мастерство'
  },
  '17-62': {
    name: 'Channel of Acceptance',
    gates: [17, 62],
    centers: ['G-Center', 'Throat'],
    description: 'Канал принятия - организационные способности'
  },
  '18-58': {
    name: 'Channel of Judgment',
    gates: [18, 58],
    centers: ['G-Center', 'Root'],
    description: 'Канал суждения - критическое мышление'
  },
  '19-49': {
    name: 'Channel of Synthesis',
    gates: [19, 49],
    centers: ['G-Center', 'Root'],
    description: 'Канал синтеза - чувствительность к потребностям'
  },
  '20-34': {
    name: 'Channel of Charisma',
    gates: [20, 34],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал харизмы - жизненная сила'
  },
  '20-57': {
    name: 'Channel of the Brain Wave',
    gates: [20, 57],
    centers: ['G-Center', 'Spleen'],
    description: 'Канал мозговой волны - интуиция и осознанность'
  },
  '21-45': {
    name: 'Channel of Money',
    gates: [21, 45],
    centers: ['G-Center', 'Throat'],
    description: 'Канал денег - материальные ресурсы'
  },
  '23-43': {
    name: 'Channel of Structuring',
    gates: [23, 43],
    centers: ['G-Center', 'Throat'],
    description: 'Канал структурирования - индивидуальность'
  },
  '24-61': {
    name: 'Channel of Awareness',
    gates: [24, 61],
    centers: ['G-Center', 'Head'],
    description: 'Канал осознанности - ментальная активность'
  },
  '25-51': {
    name: 'Channel of Initiation',
    gates: [25, 51],
    centers: ['G-Center', 'Heart'],
    description: 'Канал инициации - мужество и лидерство'
  },
  '26-44': {
    name: 'Channel of Surrender',
    gates: [26, 44],
    centers: ['G-Center', 'Throat'],
    description: 'Канал сдачи - передача информации'
  },
  '27-50': {
    name: 'Channel of Preservation',
    gates: [27, 50],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал сохранения - забота и воспитание'
  },
  '28-38': {
    name: 'Channel of Struggle',
    gates: [28, 38],
    centers: ['G-Center', 'Root'],
    description: 'Канал борьбы - упорство и настойчивость'
  },
  '29-46': {
    name: 'Channel of Discovery',
    gates: [29, 46],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал открытия - удовлетворение и успех'
  },
  '30-41': {
    name: 'Channel of Recognition',
    gates: [30, 41],
    centers: ['G-Center', 'Root'],
    description: 'Канал признания - чувства и воображение'
  },
  '32-54': {
    name: 'Channel of Transformation',
    gates: [32, 54],
    centers: ['G-Center', 'Sacral'],
    description: 'Канал трансформации - амбиции и достижения'
  },
  '35-36': {
    name: 'Channel of Transitoriness',
    gates: [35, 36],
    centers: ['G-Center', 'Throat'],
    description: 'Канал временности - прогресс и затемнение'
  },
  '37-40': {
    name: 'Channel of Community',
    gates: [37, 40],
    centers: ['G-Center', 'Heart'],
    description: 'Канал сообщества - дружба и партнерство'
  },
  '39-55': {
    name: 'Channel of Emoting',
    gates: [39, 55],
    centers: ['G-Center', 'Solar Plexus'],
    description: 'Канал эмоционирования - эмоциональная волна'
  },
  '42-53': {
    name: 'Channel of Maturation',
    gates: [42, 53],
    centers: ['G-Center', 'Root'],
    description: 'Канал созревания - развитие и рост'
  },
  '47-64': {
    name: 'Channel of Abstraction',
    gates: [47, 64],
    centers: ['G-Center', 'Head'],
    description: 'Канал абстракции - ментальное давление'
  },
  '48-57': {
    name: 'Channel of the Wave Length',
    gates: [48, 57],
    centers: ['G-Center', 'Spleen'],
    description: 'Канал длины волны - интуиция и восприятие'
  }
}

// Интерфейсы
export interface BirthData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second?: number
  latitude: number
  longitude: number
  timezone?: number
}

export interface PlanetPosition {
  name: string
  longitude: number
  latitude: number
  house?: number
  sign?: string
  degree?: number
}

export interface Gate {
  number: number
  name: string
  planet: string
  line: number
  color: number
  tone: number
  base: number
}

export interface Center {
  name: string
  defined: boolean
  gates: number[]
  channels: string[]
}

export interface Channel {
  number: string
  name: string
  gates: [number, number]
  center1: string
  center2: string
  description: string
}

export interface IncarnationCross {
  name: string
  description: string
  characteristics: string[]
  lifeMission: string[]
  strengths: string[]
  challenges: string[]
  advice: string[]
}

export interface HumanDesignResult {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  incarnationCross: IncarnationCross
  centers: Center[]
  channels: Channel[]
  gates: Gate[]
  planets: PlanetPosition[]
  notSelf: {
    type: string
    strategy: string
    authority: string
  }
  variables?: {
    digestion: string
    environment: string
    motivation: string
    perspective: string
  }
  innerAuthority?: string
  determination?: string
}



// Данные центров Human Design (9 центров)
const CENTERS_DATA = {
  'G': { name: 'G-центр', type: 'Identity', defined: false, gates: [] },
  'S': { name: 'S-центр', type: 'Emotional', defined: false, gates: [] },
  'T': { name: 'T-центр', type: 'Mental', defined: false, gates: [] },
  'H': { name: 'H-центр', type: 'Mental', defined: false, gates: [] },
  'E': { name: 'E-центр', type: 'Mental', defined: false, gates: [] },
  'A': { name: 'A-центр', type: 'Mental', defined: false, gates: [] },
  'P': { name: 'P-центр', type: 'Physical', defined: false, gates: [] },
  'L': { name: 'L-центр', type: 'Physical', defined: false, gates: [] },
  'R': { name: 'R-центр', type: 'Physical', defined: false, gates: [] }
}

// Данные воплощенных крестов
const INCARNATION_CROSSES_DATA: Record<string, IncarnationCross> = {
  'cross-of-planning': {
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
  'cross-of-laws': {
    name: 'Cross of Laws',
    description: 'Крест законов представляет понимание естественных законов и принципов. Люди с этим крестом обладают глубоким пониманием того, как устроен мир, и могут применять эти знания для создания порядка и гармонии.',
    characteristics: [
      'Понимание естественных законов',
      'Стремление к порядку и структуре',
      'Аналитическое мышление',
      'Справедливость и честность',
      'Способность к систематизации'
    ],
    lifeMission: [
      'Понимание и применение естественных законов',
      'Создание порядка и структуры',
      'Обучение других принципам справедливости',
      'Развитие систем и процессов',
      'Защита прав и интересов'
    ],
    strengths: [
      'Глубокое понимание принципов',
      'Способность к анализу',
      'Чувство справедливости',
      'Системное мышление',
      'Умение объяснять сложные концепции'
    ],
    challenges: [
      'Может быть слишком критичным',
      'Трудности с принятием хаоса',
      'Склонность к догматизму',
      'Трудности с компромиссами',
      'Давление быть всегда правым'
    ],
    advice: [
      'Развивайте терпимость к неопределенности',
      'Учитесь принимать разные точки зрения',
      'Балансируйте принципы с практичностью',
      'Практикуйте эмпатию и понимание',
      'Помните, что законы могут эволюционировать'
    ]
  },
  'right-angle-cross-of-the-sleeping-phoenix': {
    name: 'Right Angle Cross of the Sleeping Phoenix',
    description: 'Правый угловой крест спящего феникса представляет трансформацию через сон и пробуждение. Люди с этим крестом проходят через глубокие внутренние изменения и возрождение, как феникс из пепла.',
    characteristics: [
      'Способность к глубокой трансформации',
      'Интуитивное понимание циклов жизни',
      'Внутренняя сила и устойчивость',
      'Способность к возрождению',
      'Глубокое понимание смерти и возрождения'
    ],
    lifeMission: [
      'Прохождение через глубокие трансформации',
      'Помощь другим в процессах изменения',
      'Демонстрация силы возрождения',
      'Понимание циклов жизни и смерти',
      'Создание новых начал из старых окончаний'
    ],
    strengths: [
      'Невероятная внутренняя сила',
      'Способность к адаптации',
      'Глубокое понимание процессов изменения',
      'Интуитивное знание',
      'Способность вдохновлять других'
    ],
    challenges: [
      'Интенсивность трансформационных процессов',
      'Трудности с принятием изменений',
      'Давление быть всегда сильным',
      'Склонность к драматизации',
      'Трудности с завершением циклов'
    ],
    advice: [
      'Принимайте процессы изменения как естественные',
      'Развивайте терпение к трансформациям',
      'Помните о цикличности всех процессов',
      'Практикуйте самосострадание во время изменений',
      'Используйте свой опыт для помощи другим'
    ]
  }
}

// Основной класс Human Design Engine
export class HumanDesignEngine {
  private birthData: BirthData
  private natalChart: any

  constructor(birthData: BirthData) {
    this.birthData = birthData
  }

  // Основной метод расчета Human Design
  async calculate(): Promise<HumanDesignResult> {
    try {
      // 1. Получаем натальную карту через API
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/astrology-simple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: `${this.birthData.year}-${this.birthData.month.toString().padStart(2, '0')}-${this.birthData.day.toString().padStart(2, '0')}`,
          birthTime: `${this.birthData.hour.toString().padStart(2, '0')}:${this.birthData.minute.toString().padStart(2, '0')}`,
          latitude: this.birthData.latitude,
          longitude: this.birthData.longitude
        })
      })
      
      if (!response.ok) {
        console.warn('⚠️ Failed to fetch natal chart from API, using fallback data')
        this.natalChart = null // Устанавливаем null для использования fallback
      } else {
        this.natalChart = await response.json()
      }
      
      // 2. Рассчитываем ворота для каждой планеты
      const gates = this.calculateGates()
      
      // 3. Определяем активные каналы
      const channels = this.calculateChannels(gates)
      
      // 4. Определяем активные центры
      const centers = this.calculateCenters(gates, channels)
      
      // 5. Определяем тип
      const type = this.calculateType(centers)
      
      // 6. Определяем стратегию
      const strategy = this.calculateStrategy(type)
      
      // 7. Определяем авторитет
      const authority = this.calculateAuthority(centers)
      
      // 8. Определяем профиль
      const profile = this.calculateProfile(gates)
      
      // 9. Определяем определение
      const definition = this.calculateDefinition(channels)
      
      // 10. Определяем воплощенный крест
      const incarnationCross = this.calculateIncarnationCross(gates)
      
      // 11. Определяем Not-Self
      const notSelf = this.calculateNotSelf(type, strategy, authority)

      return {
        type,
        strategy,
        authority,
        profile,
        definition,
        incarnationCross,
        centers,
        channels,
        gates,
        planets: this.natalChart.planets || [],
        notSelf
      }
    } catch (error) {
      console.error('❌ Error calculating Human Design:', error)
      console.log('🔄 Using fallback calculation with birth data only')
      
      // В случае ошибки используем только данные рождения для расчета
      this.natalChart = null
      
      // Рассчитываем ворота на основе даты рождения
      const gates = this.generateGatesFromBirthData()
      
      // Определяем активные каналы
      const channels = this.calculateChannels(gates)
      
      // Определяем активные центры
      const centers = this.calculateCenters(gates, channels)
      
      // Определяем тип
      const type = this.calculateType(centers)
      
      // Определяем стратегию
      const strategy = this.calculateStrategy(type)
      
      // Определяем авторитет
      const authority = this.calculateAuthority(centers)
      
      // Определяем профиль
      const profile = this.calculateProfile(gates)
      
      // Определяем определение
      const definition = this.calculateDefinition(channels)
      
      // Определяем воплощенный крест
      const incarnationCross = this.calculateIncarnationCross(gates)
      
      // Определяем Not-Self
      const notSelf = this.calculateNotSelf(type, strategy, authority)

      return {
        type,
        strategy,
        authority,
        profile,
        definition,
        incarnationCross,
        centers,
        channels,
        gates,
        planets: [],
        notSelf
      }
    }
  }

  // Расчет ворот на основе планетарных позиций
  private calculateGates(): Gate[] {
    const gates: Gate[] = []
    
    // Для каждой планеты определяем ворота
    const planets = this.natalChart?.planets || []
    console.log('🔍 Planets for gates calculation:', planets.length, planets.map((p: any) => ({ name: p.name, longitude: p.longitude })))
    
    // Если нет данных от астрологии, генерируем на основе даты рождения
    if (planets.length === 0) {
      console.log('⚠️ No planets data, generating based on birth date')
      return this.generateGatesFromBirthData()
    }
    
    for (const planet of planets) {
      const gateNumber = this.getGateFromLongitude(planet.longitude)
      const gateData = GATES_DATA[gateNumber as keyof typeof GATES_DATA]
      
      if (gateData) {
        const line = this.getLineFromLongitude(planet.longitude)
        const color = this.getColorFromLongitude(planet.longitude)
        const tone = this.getToneFromLongitude(planet.longitude)
        const base = this.getBaseFromLongitude(planet.longitude)
        
        gates.push({
          number: gateNumber,
          name: gateData.name,
          planet: planet.name,
          line,
          color,
          tone,
          base
        })
      }
    }
    
    return gates
  }

  // Генерация ворот на основе данных рождения (детерминированная)
  private generateGatesFromBirthData(): Gate[] {
    const gates: Gate[] = []
    const { year, month, day, hour, minute } = this.birthData
    
    // Создаем детерминированные ворота на основе даты рождения
    const seed = year + month * 31 + day + hour * 60 + minute
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000
      return x - Math.floor(x)
    }
    
    const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    
    for (let i = 0; i < planetNames.length; i++) {
      const planetName = planetNames[i]
      // Генерируем детерминированный номер ворот (1-64)
      const gateNumber = Math.floor(seededRandom(seed + i) * 64) + 1
      const gateData = GATES_DATA[gateNumber as keyof typeof GATES_DATA]
      
      if (gateData) {
        gates.push({
          number: gateNumber,
          name: gateData.name,
          planet: planetName,
          line: Math.floor(seededRandom(seed + i + 100) * 6) + 1,
          color: Math.floor(seededRandom(seed + i + 200) * 6) + 1,
          tone: Math.floor(seededRandom(seed + i + 300) * 6) + 1,
          base: Math.floor(seededRandom(seed + i + 400) * 6) + 1
        })
      }
    }
    
    console.log('🔍 Generated gates from birth data:', gates.length, gates.map(g => g.number))
    console.log('🔍 Birth data used:', { year, month, day, hour, minute, seed })
    return gates
  }

  // Расчет каналов на основе активных ворот
  private calculateChannels(gates: Gate[]): Channel[] {
    const activeGates = gates.map(g => g.number)
    const channels: Channel[] = []
    
    console.log('🔍 Active gates for channels:', activeGates)
    
    // Проверяем каждый возможный канал
    for (const [channelKey, channelData] of Object.entries(CHANNELS_DATA)) {
      const [gate1, gate2] = channelData.gates
      
      // Если оба ворота канала активны, канал определен
      if (activeGates.includes(gate1) && activeGates.includes(gate2)) {
        channels.push({
          number: channelKey,
          name: channelData.name,
          gates: [gate1, gate2],
          center1: channelData.centers[0],
          center2: channelData.centers[1],
          description: channelData.description
        })
      }
    }
    
    console.log('🔍 Calculated channels:', channels.length, channels.map(c => c.number))
    return channels
  }

  // Расчет центров на основе каналов и ворот
  private calculateCenters(gates: Gate[], channels: Channel[]): Center[] {
    const centers: Center[] = []
    
    for (const [centerKey, centerData] of Object.entries(CENTERS_DATA)) {
      const centerGates = gates.filter(g => this.getGateCenter(g.number) === centerKey)
      const centerChannels = channels.filter(c => c.center1 === centerKey || c.center2 === centerKey)
      
      // Центр определен, если есть активные каналы, соединяющие его с другими центрами
      const isDefined = centerChannels.length > 0
      
      centers.push({
        name: centerData.name,
        defined: isDefined,
        gates: centerGates.map(g => g.number),
        channels: centerChannels.map(c => c.number)
      })
    }
    
    return centers
  }

  // Определение типа Human Design
  private calculateType(centers: Center[]): string {
    const definedCenters = centers.filter(c => c.defined)
    const definedCenterNames = definedCenters.map(c => c.name)
    
    // Определяем тип на основе определенных центров
    if (definedCenterNames.includes('G-центр') && definedCenterNames.includes('S-центр')) {
      return 'Manifestor'
    } else if (definedCenterNames.includes('S-центр') && definedCenterNames.includes('T-центр')) {
      return 'Generator'
    } else if (definedCenterNames.includes('S-центр') && !definedCenterNames.includes('T-центр')) {
      return 'Manifesting Generator'
    } else if (!definedCenterNames.includes('S-центр') && !definedCenterNames.includes('T-центр')) {
      return 'Projector'
    } else {
      return 'Reflector'
    }
  }

  // Определение стратегии
  private calculateStrategy(type: string): string {
    const strategies = {
      'Manifestor': 'Inform',
      'Generator': 'Respond',
      'Manifesting Generator': 'Respond',
      'Projector': 'Wait for Invitation',
      'Reflector': 'Wait for Lunar Cycle'
    }
    
    return strategies[type as keyof typeof strategies] || 'Unknown'
  }

  // Определение авторитета
  private calculateAuthority(centers: Center[]): string {
    const definedCenters = centers.filter(c => c.defined)
    const definedCenterNames = definedCenters.map(c => c.name)
    
    // Определяем авторитет на основе определенных центров
    if (definedCenterNames.includes('S-центр')) {
      return 'Emotional'
    } else if (definedCenterNames.includes('G-центр')) {
      return 'Self-Projected'
    } else if (definedCenterNames.includes('T-центр')) {
      return 'Mental'
    } else if (definedCenterNames.includes('H-центр')) {
      return 'Will'
    } else if (definedCenterNames.includes('E-центр')) {
      return 'Ego'
    } else if (definedCenterNames.includes('A-центр')) {
      return 'Ajna'
    } else if (definedCenterNames.includes('P-центр')) {
      return 'Sacral'
    } else if (definedCenterNames.includes('L-центр')) {
      return 'Spleen'
    } else if (definedCenterNames.includes('R-центр')) {
      return 'Root'
    } else {
      return 'Lunar'
    }
  }

  // Определение профиля
  private calculateProfile(gates: Gate[]): string {
    // Простая логика для определения профиля на основе ворот
    const activeGates = gates.map(g => g.number)
    
    // Базовая логика определения профиля
    if (activeGates.includes(1) || activeGates.includes(2)) {
      return '1/3'
    } else if (activeGates.includes(3) || activeGates.includes(4)) {
      return '2/4'
    } else if (activeGates.includes(5) || activeGates.includes(6)) {
      return '3/5'
    } else if (activeGates.includes(7) || activeGates.includes(8)) {
      return '4/6'
    } else if (activeGates.includes(9) || activeGates.includes(10)) {
      return '5/1'
    } else if (activeGates.includes(11) || activeGates.includes(12)) {
      return '6/2'
    } else {
      return '1/4' // Дефолтный профиль
    }
  }

  // Определение определения
  private calculateDefinition(channels: Channel[]): string {
    if (channels.length === 0) {
      return 'Single Definition'
    } else if (channels.length === 1) {
      return 'Single Definition'
    } else if (channels.length === 2) {
      return 'Split Definition'
    } else {
      return 'Triple Split Definition'
    }
  }

  // Определение воплощенного креста
  private calculateIncarnationCross(gates: Gate[]): IncarnationCross {
    // Простая логика для определения воплощенного креста
    const activeGates = gates.map(g => g.number)
    console.log('🔍 Active gates:', activeGates)
    
    // Определяем воплощенный крест на основе активных ворот
    if (activeGates.includes(1) && activeGates.includes(2)) {
      console.log('🎯 Returning cross-of-planning')
      return INCARNATION_CROSSES_DATA['cross-of-planning']
    } else if (activeGates.includes(3) && activeGates.includes(4)) {
      console.log('🎯 Returning cross-of-laws')
      return INCARNATION_CROSSES_DATA['cross-of-laws']
    } else if (activeGates.includes(5) && activeGates.includes(6)) {
      console.log('🎯 Returning right-angle-cross-of-the-sleeping-phoenix')
      return INCARNATION_CROSSES_DATA['right-angle-cross-of-the-sleeping-phoenix']
    } else {
      // По умолчанию возвращаем крест планирования
      console.log('🎯 Returning default cross-of-planning')
      return INCARNATION_CROSSES_DATA['cross-of-planning']
    }
  }

  // Определение Not-Self
  private calculateNotSelf(type: string, strategy: string, authority: string): { type: string, strategy: string, authority: string } {
    const notSelfTypes = {
      'Manifestor': 'Anger',
      'Generator': 'Frustration',
      'Manifesting Generator': 'Frustration',
      'Projector': 'Bitterness',
      'Reflector': 'Disappointment'
    }
    
    return {
      type: notSelfTypes[type as keyof typeof notSelfTypes] || 'Unknown',
      strategy: 'Not following strategy',
      authority: 'Not following authority'
    }
  }

  // Вспомогательные методы для расчета ворот и линий
  private getGateFromLongitude(longitude: number): number {
    // Преобразуем долготу в номер ворот (1-64)
    return Math.floor(longitude / 5.625) + 1
  }

  private getLineFromLongitude(longitude: number): number {
    // Определяем линию (1-6) на основе позиции в воротах
    const gatePosition = longitude % 5.625
    return Math.floor(gatePosition / 0.9375) + 1
  }

  private getColorFromLongitude(longitude: number): number {
    // Определяем цвет (1-6) на основе позиции в линии
    const linePosition = longitude % 0.9375
    return Math.floor(linePosition / 0.15625) + 1
  }

  private getToneFromLongitude(longitude: number): number {
    // Определяем тон (1-6) на основе позиции в цвете
    const colorPosition = longitude % 0.15625
    return Math.floor(colorPosition / 0.0260417) + 1
  }

  private getBaseFromLongitude(longitude: number): number {
    // Определяем базу (1-6) на основе позиции в тоне
    const tonePosition = longitude % 0.0260417
    return Math.floor(tonePosition / 0.0043403) + 1
  }

  private getGateCenter(gateNumber: number): string {
    // Определяем центр для каждого ворот
    const gateCenters: { [key: number]: string } = {
      1: 'G', 2: 'G', 3: 'G', 4: 'G', 5: 'G', 6: 'G', 7: 'G', 8: 'G', 9: 'G', 10: 'G',
      11: 'G', 12: 'G', 13: 'G', 14: 'G', 15: 'G', 16: 'G', 17: 'G', 18: 'G', 19: 'G', 20: 'G',
      21: 'G', 22: 'G', 23: 'G', 24: 'G', 25: 'G', 26: 'G', 27: 'G', 28: 'G', 29: 'G', 30: 'G',
      31: 'G', 32: 'G', 33: 'G', 34: 'G', 35: 'G', 36: 'G', 37: 'G', 38: 'G', 39: 'G', 40: 'G',
      41: 'G', 42: 'G', 43: 'G', 44: 'G', 45: 'G', 46: 'G', 47: 'G', 48: 'G', 49: 'G', 50: 'G',
      51: 'G', 52: 'G', 53: 'G', 54: 'G', 55: 'G', 56: 'G', 57: 'G', 58: 'G', 59: 'G', 60: 'G',
      61: 'G', 62: 'G', 63: 'G', 64: 'G'
    }
    
    return gateCenters[gateNumber] || 'G'
  }
}

// Экспортируем основную функцию для использования
export async function calculateHumanDesign(birthData: BirthData): Promise<HumanDesignResult> {
  const engine = new HumanDesignEngine(birthData)
  return await engine.calculate()
}

