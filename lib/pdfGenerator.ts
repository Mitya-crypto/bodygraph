// lib/pdfGenerator.ts

// import { NumerologyData } from '@/components/NumerologyDisplay'
import { UserProfile } from '@/store/appStore'

export interface PDFContent {
  title: string
  subtitle: string
  userInfo: {
    name: string
    birthDate: string
    birthTime: string
    birthPlace: string
  }
  numerologyData?: any
  humanDesignData?: any
  astrologyData?: any
  sections?: {
    lifePath: {
      number: number
      description: string
      detailedDescription: string
    }
    expression: {
      number: number
      description: string
      detailedDescription: string
    }
    soulUrge: {
      number: number
      description: string
      detailedDescription: string
    }
    personality: {
      number: number
      description: string
      detailedDescription: string
    }
    additionalNumbers: {
      dayNumber: number
      monthNumber: number
      yearNumber: number
      descriptions: {
        day: string
        month: string
        year: string
      }
    }
    biorythms: {
      physical: number
      emotional: number
      intellectual: number
      description: string
    }
  }
  humanDesignSections?: {
    type: string
    strategy: string
    authority: string
    profile: string
    definition: string
    incarnationCross: {
      name: string
      description: string
    }
    channels: Array<{
      number: string
      name: string
      description: string
    }>
    gates: Array<{
      number: number
      name: string
      planet: string
    }>
    centers: Array<{
      name: string
      defined: boolean
    }>
  }
  astrologySections?: {
    sun: {
      sign: string
      degree: number
      house: number
      description: string
    }
    moon: {
      sign: string
      degree: number
      house: number
      description: string
    }
    ascendant: {
      sign: string
      degree: number
      description: string
    }
    planets: Array<{
      name: string
      sign: string
      degree: number
      house: number
      description: string
    }>
    houses: Array<{
      number: number
      sign: string
      cusp: number
      description: string
    }>
  }
  footer: string
}

export class PDFGenerator {
  private static generateHTML(content: PDFContent): string {
    const currentDate = new Date().toLocaleDateString('ru-RU')
    
    // Определяем тип отчета
    const isNumerology = content.sections !== undefined
    const isHumanDesign = content.humanDesignSections !== undefined
    const isAstrology = content.astrologySections !== undefined
    
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .subtitle {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 20px;
        }
        
        .user-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .user-info h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 18px;
        }
        
        .user-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        .number-display {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .main-number {
            font-size: 48px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .number-label {
            font-size: 16px;
            color: #2c3e50;
            font-weight: bold;
        }
        
        .description {
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 10px;
        }
        
        .detailed-description {
            font-size: 13px;
            line-height: 1.6;
            color: #555;
            margin-top: 10px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
        }
        
        .additional-numbers {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        
        .additional-number {
            text-align: center;
            padding: 15px;
            background-color: #ecf0f1;
            border-radius: 8px;
            flex: 1;
            margin: 0 5px;
        }
        
        .additional-number-value {
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 5px;
        }
        
        .additional-number-label {
            font-size: 12px;
            color: #2c3e50;
        }
        
        .biorythms {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        
        .biorythm {
            text-align: center;
            padding: 15px;
            background-color: #ecf0f1;
            border-radius: 8px;
            flex: 1;
            margin: 0 5px;
        }
        
        .biorythm-value {
            font-size: 20px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 5px;
        }
        
        .biorythm-label {
            font-size: 12px;
            color: #2c3e50;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
        }
        
        .master-number {
            color: #8e44ad !important;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .channel-item, .gate-item, .planet-item, .house-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
        }
        
        .channel-number, .gate-number, .planet-name, .house-number {
            font-weight: bold;
            color: #2c3e50;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .channel-name, .gate-name {
            color: #e74c3c;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .channel-description, .gate-planet, .planet-position, .house-sign {
            color: #555;
            font-size: 13px;
            margin-bottom: 5px;
        }
        
        .planet-description, .house-description {
            color: #666;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .centers-grid, .channels-grid, .gates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .center-item {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #28a745;
        }
        
        .center-item.defined {
            border-left-color: #28a745;
        }
        
        .center-name {
            font-weight: bold;
            color: #495057;
            margin-bottom: 5px;
        }
        
        .center-description {
            color: #6c757d;
            font-size: 0.9em;
        }
        
        .no-data {
            color: #6c757d;
            font-style: italic;
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${content.title}</div>
        <div class="subtitle">${content.subtitle}</div>
    </div>
    
    <div class="user-info">
        <h3>Информация о пользователе</h3>
        <p><strong>Имя:</strong> ${content.userInfo.name}</p>
        <p><strong>Дата рождения:</strong> ${content.userInfo.birthDate}</p>
        <p><strong>Время рождения:</strong> ${content.userInfo.birthTime}</p>
        <p><strong>Место рождения:</strong> ${content.userInfo.birthPlace}</p>
    </div>
    
    ${isNumerology ? this.generateNumerologySections(content.sections!) : ''}
    ${isHumanDesign ? this.generateHumanDesignSections(content.humanDesignSections!) : ''}
    ${isAstrology ? this.generateAstrologySections(content.astrologySections!) : ''}
    
    <div class="footer">
        <p>${content.footer}</p>
        <p>Отчет сгенерирован ${currentDate}</p>
    </div>
</body>
</html>
    `
  }

  private static generateNumerologySections(sections: any): string {
    return `
    <div class="section">
        <div class="section-title">Число Жизненного Пути</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(sections.lifePath.number) ? 'master-number' : ''}">${sections.lifePath.number}</div>
            <div class="number-label">Число Жизненного Пути</div>
        </div>
        <div class="description">${sections.lifePath.description}</div>
        <div class="detailed-description">${sections.lifePath.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Выражения</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(sections.expression.number) ? 'master-number' : ''}">${sections.expression.number}</div>
            <div class="number-label">Число Выражения</div>
        </div>
        <div class="description">${sections.expression.description}</div>
        <div class="detailed-description">${sections.expression.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Души</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(sections.soulUrge.number) ? 'master-number' : ''}">${sections.soulUrge.number}</div>
            <div class="number-label">Число Души</div>
        </div>
        <div class="description">${sections.soulUrge.description}</div>
        <div class="detailed-description">${sections.soulUrge.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Личности</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(sections.personality.number) ? 'master-number' : ''}">${sections.personality.number}</div>
            <div class="number-label">Число Личности</div>
        </div>
        <div class="description">${sections.personality.description}</div>
        <div class="detailed-description">${sections.personality.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Дополнительные Числа</div>
        <div class="additional-numbers">
            <div class="additional-number">
                <div class="additional-number-value">${sections.additionalNumbers.dayNumber}</div>
                <div class="additional-number-label">Число Дня</div>
            </div>
            <div class="additional-number">
                <div class="additional-number-value">${sections.additionalNumbers.monthNumber}</div>
                <div class="additional-number-label">Число Месяца</div>
            </div>
            <div class="additional-number">
                <div class="additional-number-value">${sections.additionalNumbers.yearNumber}</div>
                <div class="additional-number-label">Число Года</div>
            </div>
        </div>
        <div class="description">
            <p><strong>Число дня (${sections.additionalNumbers.dayNumber}):</strong> ${sections.additionalNumbers.descriptions.day}</p>
            <p><strong>Число месяца (${sections.additionalNumbers.monthNumber}):</strong> ${sections.additionalNumbers.descriptions.month}</p>
            <p><strong>Число года (${sections.additionalNumbers.yearNumber}):</strong> ${sections.additionalNumbers.descriptions.year}</p>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Биоритмы</div>
        <div class="biorythms">
            <div class="biorythm">
                <div class="biorythm-value">${sections.biorythms.physical.toFixed(1)}%</div>
                <div class="biorythm-label">Физический</div>
            </div>
            <div class="biorythm">
                <div class="biorythm-value">${sections.biorythms.emotional.toFixed(1)}%</div>
                <div class="biorythm-label">Эмоциональный</div>
            </div>
            <div class="biorythm">
                <div class="biorythm-value">${sections.biorythms.intellectual.toFixed(1)}%</div>
                <div class="biorythm-label">Интеллектуальный</div>
            </div>
        </div>
        <div class="description">${sections.biorythms.description}</div>
    </div>
    `
  }

  private static generateHumanDesignSections(sections: any): string {
    return `
    <div class="section">
        <div class="section-title">Энергетический Тип</div>
        <div class="number-display">
            <div class="main-number">${sections.type}</div>
            <div class="number-label">Ваш тип в системе Human Design</div>
        </div>
        <div class="description">${this.getTypeDescription(sections.type)}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Стратегия</div>
        <div class="number-display">
            <div class="main-number">${sections.strategy}</div>
            <div class="number-label">Ваша стратегия принятия решений</div>
        </div>
        <div class="description">${this.getStrategyDescription(sections.strategy)}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Авторитет</div>
        <div class="number-display">
            <div class="main-number">${sections.authority}</div>
            <div class="number-label">Ваш внутренний авторитет</div>
        </div>
        <div class="description">${this.getAuthorityDescription(sections.authority)}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Профиль</div>
        <div class="number-display">
            <div class="main-number">${sections.profile}</div>
            <div class="number-label">Ваш жизненный профиль</div>
        </div>
        <div class="description">${this.getProfileDescription(sections.profile)}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Определение</div>
        <div class="number-display">
            <div class="main-number">${sections.definition}</div>
            <div class="number-label">Тип вашего определения</div>
        </div>
        <div class="description">${this.getDefinitionDescription(sections.definition)}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Инкарнационный Крест</div>
        <div class="number-display">
            <div class="main-number">${sections.incarnationCross.name}</div>
            <div class="number-label">Ваша жизненная миссия</div>
        </div>
        <div class="description">${sections.incarnationCross.description}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Определенные Центры</div>
        ${sections.centers.length > 0 ? `
        <div class="centers-grid">
            ${sections.centers.map((center: any) => `
            <div class="center-item defined">
                <div class="center-name">${center.name}</div>
                <div class="center-description">${this.getCenterDescription(center.name)}</div>
            </div>
            `).join('')}
        </div>
        ` : '<p class="no-data">У вас нет определенных центров</p>'}
    </div>
    
    ${sections.channels.length > 0 ? `
    <div class="section">
        <div class="section-title">Активированные Каналы</div>
        <div class="channels-grid">
        ${sections.channels.map((channel: any) => `
        <div class="channel-item">
            <div class="channel-number">Канал ${channel.number}</div>
            <div class="channel-name">${channel.name}</div>
            <div class="channel-description">${channel.description}</div>
        </div>
        `).join('')}
        </div>
    </div>
    ` : `
    <div class="section">
        <div class="section-title">Активированные Каналы</div>
        <p class="no-data">У вас нет активированных каналов</p>
    </div>
    `}
    
    ${sections.gates.length > 0 ? `
    <div class="section">
        <div class="section-title">Активированные Ворота</div>
        <div class="gates-grid">
        ${sections.gates.map((gate: any) => `
        <div class="gate-item">
            <div class="gate-number">Ворота ${gate.number}</div>
            <div class="gate-name">${gate.name}</div>
            <div class="gate-planet">Планета: ${gate.planet}</div>
        </div>
        `).join('')}
        </div>
    </div>
    ` : `
    <div class="section">
        <div class="section-title">Активированные Ворота</div>
        <p class="no-data">У вас нет активированных ворот</p>
    </div>
    `}
    `
  }

  private static generateAstrologySections(sections: any): string {
    return `
    <div class="section">
        <div class="section-title">Солнце</div>
        <div class="number-display">
            <div class="main-number">${sections.sun.sign}</div>
            <div class="number-label">${sections.sun.degree.toFixed(1)}° в ${sections.sun.house} доме</div>
        </div>
        <div class="description">${sections.sun.description}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Луна</div>
        <div class="number-display">
            <div class="main-number">${sections.moon.sign}</div>
            <div class="number-label">${sections.moon.degree.toFixed(1)}° в ${sections.moon.house} доме</div>
        </div>
        <div class="description">${sections.moon.description}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Асцендент</div>
        <div class="number-display">
            <div class="main-number">${sections.ascendant.sign}</div>
            <div class="number-label">${sections.ascendant.degree.toFixed(1)}°</div>
        </div>
        <div class="description">${sections.ascendant.description}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Планеты</div>
        ${sections.planets.map((planet: any) => `
        <div class="planet-item">
            <div class="planet-name">${planet.name}</div>
            <div class="planet-position">${planet.sign} ${planet.degree.toFixed(1)}° в ${planet.house} доме</div>
            <div class="planet-description">${planet.description}</div>
        </div>
        `).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Дома</div>
        ${sections.houses.map((house: any) => `
        <div class="house-item">
            <div class="house-number">${house.number} дом</div>
            <div class="house-sign">${house.sign} ${house.degree ? house.degree.toFixed(1) : '0.0'}°</div>
            <div class="house-description">${house.description}</div>
        </div>
        `).join('')}
    </div>
    `
  }

  private static isMasterNumber(number: number): boolean {
    return [11, 22, 33].includes(number)
  }

  static async generateNumerologyPDF(
    userProfile: UserProfile,
    numerologyData: any
  ): Promise<Blob> {
    const content: PDFContent = {
      title: 'Нумерологический Анализ',
      subtitle: 'Полный отчет по нумерологии',
      userInfo: {
        name: userProfile.name || 'Не указано',
        birthDate: userProfile.birthDate || 'Не указано',
        birthTime: userProfile.birthTime || 'Не указано',
        birthPlace: userProfile.birthPlace || 'Не указано'
      },
      numerologyData,
      sections: {
        lifePath: {
          number: numerologyData.lifePath,
          description: this.getLifePathDescription(numerologyData.lifePath),
          detailedDescription: this.getLifePathDetailedDescription(numerologyData.lifePath)
        },
        expression: {
          number: numerologyData.expression,
          description: this.getExpressionDescription(numerologyData.expression),
          detailedDescription: this.getExpressionDetailedDescription(numerologyData.expression)
        },
        soulUrge: {
          number: numerologyData.soulUrge,
          description: this.getSoulUrgeDescription(numerologyData.soulUrge),
          detailedDescription: this.getSoulUrgeDetailedDescription(numerologyData.soulUrge)
        },
        personality: {
          number: numerologyData.personality,
          description: this.getPersonalityDescription(numerologyData.personality),
          detailedDescription: this.getPersonalityDetailedDescription(numerologyData.personality)
        },
        additionalNumbers: {
          dayNumber: numerologyData.dayNumber,
          monthNumber: numerologyData.monthNumber,
          yearNumber: numerologyData.yearNumber,
          descriptions: {
            day: this.getDayNumberDescription(numerologyData.dayNumber),
            month: this.getMonthNumberDescription(numerologyData.monthNumber),
            year: this.getYearNumberDescription(numerologyData.yearNumber)
          }
        },
        biorythms: {
          physical: numerologyData.biorythms.physical,
          emotional: numerologyData.biorythms.emotional,
          intellectual: numerologyData.biorythms.intellectual,
          description: 'Биоритмы показывают ваше текущее состояние в различных сферах жизни. Положительные значения указывают на благоприятные периоды для активности в соответствующей области.'
        }
      },
      footer: 'Данный отчет создан с помощью BodyGraph - приложения для космического анализа личности.'
    }

    const html = this.generateHTML(content)
    
    // Создаем Blob с HTML содержимым
    const blob = new Blob([html], { type: 'text/html' })
    
    return blob
  }

  static async generateHumanDesignPDF(
    userProfile: UserProfile,
    humanDesignData: any
  ): Promise<Blob> {
    // Обрабатываем центры для PDF
    const definedCenters = humanDesignData.centers?.filter((center: any) => center.defined) || []
    const undefinedCenters = humanDesignData.centers?.filter((center: any) => !center.defined) || []
    
    const content: PDFContent = {
      title: 'Human Design Анализ',
      subtitle: 'Полный отчет по системе Human Design',
      userInfo: {
        name: userProfile.name || 'Не указано',
        birthDate: userProfile.birthDate || 'Не указано',
        birthTime: userProfile.birthTime || 'Не указано',
        birthPlace: userProfile.birthPlace || 'Не указано'
      },
      humanDesignData,
      humanDesignSections: {
        type: humanDesignData.type || 'Не определено',
        strategy: humanDesignData.strategy || 'Не определена',
        authority: humanDesignData.authority || 'Не определен',
        profile: humanDesignData.profile || 'Не определен',
        definition: humanDesignData.definition || 'Не определено',
        incarnationCross: {
          name: humanDesignData.incarnationCross?.name || 'Не определен',
          description: humanDesignData.incarnationCross?.description || 'Описание будет добавлено в ближайшее время.'
        },
        channels: humanDesignData.channels || [],
        gates: humanDesignData.gates || [],
        centers: definedCenters.map((center: any) => ({
          name: center.name,
          defined: center.defined
        }))
      },
      footer: 'Данный отчет создан с помощью BodyGraph - приложения для космического анализа личности.'
    }

    const html = this.generateHTML(content)
    const blob = new Blob([html], { type: 'text/html' })
    return blob
  }

  static async generateAstrologyPDF(
    userProfile: UserProfile,
    astrologyData: any
  ): Promise<Blob> {
    const content: PDFContent = {
      title: 'Астрологический Анализ',
      subtitle: 'Полный отчет по натальной карте',
      userInfo: {
        name: userProfile.name || 'Не указано',
        birthDate: userProfile.birthDate || 'Не указано',
        birthTime: userProfile.birthTime || 'Не указано',
        birthPlace: userProfile.birthPlace || 'Не указано'
      },
      astrologyData,
      astrologySections: {
        sun: {
          sign: astrologyData.sun?.sign || 'Неизвестно',
          degree: astrologyData.sun?.degree || 0,
          house: astrologyData.sun?.house || 0,
          description: astrologyData.sun?.description || 'Описание Солнца'
        },
        moon: {
          sign: astrologyData.moon?.sign || 'Неизвестно',
          degree: astrologyData.moon?.degree || 0,
          house: astrologyData.moon?.house || 0,
          description: astrologyData.moon?.description || 'Описание Луны'
        },
        ascendant: {
          sign: astrologyData.ascendant?.sign || 'Неизвестно',
          degree: astrologyData.ascendant?.degree || 0,
          description: astrologyData.ascendant?.description || 'Описание Асцендента'
        },
        planets: astrologyData.planets || [],
        houses: astrologyData.houses || []
      },
      footer: 'Данный отчет создан с помощью BodyGraph - приложения для космического анализа личности.'
    }

    const html = this.generateHTML(content)
    const blob = new Blob([html], { type: 'text/html' })
    return blob
  }

  // Методы для получения описаний Human Design
  private static getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'Generator': 'Генератор - создатель и строитель мира. Ваша энергия направлена на создание и созидание.',
      'Manifesting Generator': 'Манифестирующий Генератор - создатель и инициатор. Вы можете и создавать, и инициировать.',
      'Manifestor': 'Манифестор - инициатор и лидер. Ваша энергия направлена на инициацию и лидерство.',
      'Projector': 'Проектор - гид и стратег. Ваша сила в направлении и управлении энергией других.',
      'Reflector': 'Рефлектор - мудрец и зеркало. Вы отражаете энергию окружающих и являетесь мудрым наблюдателем.'
    }
    return descriptions[type] || 'Описание типа будет добавлено в ближайшее время.'
  }

  private static getStrategyDescription(strategy: string): string {
    const descriptions: Record<string, string> = {
      'Respond': 'Отвечайте на жизненные запросы. Ждите, пока жизнь не предложит вам что-то, на что можно ответить.',
      'Initiate': 'Инициируйте и действуйте. Вы можете начинать действия и влиять на окружающий мир.',
      'Wait for invitation': 'Ждите приглашения. Ваша стратегия - ждать, пока вас не пригласят.',
      'Wait for lunar cycle': 'Ждите лунный цикл. Принимайте важные решения только после лунного цикла.'
    }
    return descriptions[strategy] || 'Описание стратегии будет добавлено в ближайшее время.'
  }

  private static getAuthorityDescription(authority: string): string {
    const descriptions: Record<string, string> = {
      'Sacral': 'Сакральный авторитет - это ваша внутренняя мудрость, которая знает, что правильно для вас через звуки и ощущения.',
      'Solar Plexus': 'Авторитет солнечного сплетения - это эмоциональная мудрость, которая требует времени для принятия решений.',
      'Lunar': 'Лунный авторитет - это эмоциональная мудрость, которая требует ожидания лунного цикла для принятия решений.',
      'Spleen': 'Спленный авторитет - это интуитивная мудрость, которая работает мгновенно для вашего выживания.',
      'Heart': 'Сердечный авторитет - это мудрость эго, которая знает ваше истинное направление.',
      'Lunar': 'Лунный авторитет - это мудрость лунного цикла, которая требует 28 дней для принятия решений.',
      'Environmental': 'Авторитет окружающей среды - это мудрость окружения, которая реагирует на среду.'
    }
    return descriptions[authority] || 'Описание авторитета будет добавлено в ближайшее время.'
  }

  private static getCenterDescription(centerName: string): string {
    const descriptions: Record<string, string> = {
      'G-центр': 'Центр идентичности и направления. Определяет вашу самоидентификацию и жизненный путь.',
      'S-центр': 'Сакральный центр - источник жизненной силы и творческой энергии.',
      'T-центр': 'Теменная центр - центр вдохновения и ментального давления.',
      'H-центр': 'Сердечный центр - центр силы воли и эго.',
      'E-центр': 'Эмоциональный центр - центр эмоциональной системы.',
      'A-центр': 'Адреналовая центр - центр двигательной системы.',
      'P-центр': 'Селезеночный центр - центр инстинктивного осознания.',
      'L-центр': 'Лимбический центр - центр логического осознания.',
      'R-центр': 'Корневой центр - центр давления и трансформации.'
    }
    return descriptions[centerName] || 'Описание центра будет добавлено в ближайшее время.'
  }

  private static getProfileDescription(profile: string): string {
    const descriptions: Record<string, string> = {
      '1/3': 'Профиль 1/3 - Исследователь/Мученик. Вы изучаете основы и учитесь на ошибках.',
      '1/4': 'Профиль 1/4 - Исследователь/Оппортунист. Вы изучаете основы и делитесь знаниями с друзьями.',
      '2/4': 'Профиль 2/4 - Отшельник/Оппортунист. Вы обладаете природными талантами и делитесь ими с друзьями.',
      '2/5': 'Профиль 2/5 - Отшельник/Еретик. Вы обладаете природными талантами и можете вдохновлять массы.',
      '3/5': 'Профиль 3/5 - Мученик/Еретик. Вы учитесь на ошибках и можете вдохновлять массы.',
      '3/6': 'Профиль 3/6 - Мученик/Роль Модели. Вы учитесь на ошибках и становитесь мудрым наставником.',
      '4/6': 'Профиль 4/6 - Оппортунист/Роль Модели. Вы делитесь знаниями с друзьями и становитесь мудрым наставником.',
      '4/1': 'Профиль 4/1 - Оппортунист/Исследователь. Вы делитесь знаниями с друзьями и изучаете основы.',
      '5/1': 'Профиль 5/1 - Еретик/Исследователь. Вы можете вдохновлять массы и изучаете основы.',
      '5/2': 'Профиль 5/2 - Еретик/Отшельник. Вы можете вдохновлять массы и обладаете природными талантами.',
      '6/2': 'Профиль 6/2 - Роль Модели/Отшельник. Вы становитесь мудрым наставником и обладаете природными талантами.',
      '6/3': 'Профиль 6/3 - Роль Модели/Мученик. Вы становитесь мудрым наставником и учитесь на ошибках.'
    }
    return descriptions[profile] || 'Описание профиля будет добавлено в ближайшее время.'
  }

  private static getDefinitionDescription(definition: string): string {
    const descriptions: Record<string, string> = {
      'Single Definition': 'Единое определение означает, что все ваши определенные центры соединены между собой. Это дает вам последовательность и стабильность в принятии решений.',
      'Split Definition': 'Разделенное определение означает, что ваши определенные центры разделены на две группы. Это создает внутреннее напряжение и потребность в других людях для завершения.',
      'Triple Split Definition': 'Тройное разделенное определение означает, что ваши определенные центры разделены на три группы. Это создает сложную внутреннюю динамику.',
      'Quadruple Split Definition': 'Четверное разделенное определение означает, что ваши определенные центры разделены на четыре группы. Это создает очень сложную внутреннюю динамику.',
      'No Definition': 'Без определения означает, что у вас нет определенных центров. Вы являетесь чистым рефлектором.'
    }
    return descriptions[definition] || 'Описание определения будет добавлено в ближайшее время.'
  }

  // Методы для получения описаний (заглушки, в реальном проекте здесь должны быть полные описания)
  private static getLifePathDescription(number: number): string {
    return `Число жизненного пути ${number} определяет основную цель вашей жизни и путь, который вам предназначено пройти.`
  }

  private static getLifePathDetailedDescription(number: number): string {
    const descriptions: Record<number, string> = {
      1: 'Вы прирожденный лидер с сильным стремлением к независимости и оригинальности. Ваша энергия направлена на создание нового и ведение других к успеху. Вам свойственны инициативность, смелость и способность принимать решения. Вы не боитесь идти первым и брать на себя ответственность. Ваша задача - развивать лидерские качества, быть примером для других и не бояться выделяться из толпы.',
      2: 'Вы обладаете природной дипломатичностью и способностью к сотрудничеству. Ваша сила в умении работать в команде, слушать других и находить компромиссы. Вы чувствительны к потребностям окружающих и умеете создавать гармонию в отношениях. Ваша задача - развивать терпение, дипломатичность и способность к сотрудничеству.',
      3: 'Вы творческая личность с ярким воображением и способностью к самовыражению. Ваша энергия направлена на творчество, общение и радость жизни. Вы умеете вдохновлять других своим энтузиазмом и оптимизмом. Ваша задача - развивать творческие способности, делиться радостью с окружающими и не бояться самовыражения.',
      4: 'Вы практичный человек с сильным чувством ответственности и дисциплины. Ваша сила в способности строить прочные основы и доводить дела до конца. Вы надежны, терпеливы и умеете работать систематически. Ваша задача - развивать терпение, организованность и способность к долгосрочному планированию.',
      5: 'Вы свободолюбивая личность с жаждой приключений и новых впечатлений. Ваша энергия направлена на исследование мира и поиск новых возможностей. Вы адаптивны, любознательны и умеете находить выход из любой ситуации. Ваша задача - развивать гибкость, открытость новому опыту и способность к адаптации.',
      6: 'Вы заботливая личность с сильным чувством ответственности за других. Ваша сила в способности создавать уют, заботиться о близких и поддерживать гармонию в отношениях. Вы надежны, терпеливы и умеете находить баланс между личными потребностями и потребностями других. Ваша задача - развивать заботу о близких, создавать гармонию в отношениях и находить баланс в жизни.',
      7: 'Вы духовная личность с глубокой потребностью в понимании смысла жизни. Ваша энергия направлена на поиск истины, самопознание и духовное развитие. Вы интуитивны, мудры и умеете видеть суть вещей. Ваша задача - развивать духовность, интуицию и способность к глубокому анализу.',
      8: 'Вы амбициозная личность с сильным стремлением к материальному успеху. Ваша сила в способности организовывать, управлять и достигать поставленных целей. Вы практичны, решительны и умеете принимать сложные решения. Ваша задача - развивать лидерские качества, организаторские способности и умение достигать целей.',
      9: 'Вы гуманитарная личность с широким кругозором и способностью к состраданию. Ваша энергия направлена на служение человечеству, помощь другим и духовное развитие. Вы мудры, терпимы и умеете видеть общую картину. Ваша задача - развивать сострадание, мудрость и способность служить другим.',
      11: 'Вы обладаете особой духовной силой и способностью к просветлению. Как мастер-число, 11 дает вам повышенную чувствительность, интуицию и способность вдохновлять других. Вы призваны быть духовным наставником и примером для окружающих. Ваша задача - развивать духовность, интуицию и способность вдохновлять других.',
      22: 'Вы обладаете способностью воплощать великие идеи в реальность. Как мастер-число, 22 дает вам практическую мудрость, способность к строительству и созданию чего-то значительного. Вы призваны строить прочные основы для будущего. Ваша задача - развивать практическую мудрость, способность к строительству и созданию долгосрочных проектов.',
      33: 'Вы обладаете высшей духовной силой и способностью к исцелению. Как мастер-число, 33 дает вам способность служить человечеству, исцелять других и быть примером духовного развития. Вы призваны быть духовным лидером и исцелителем. Ваша задача - развивать способность к исцелению, служению человечеству и духовному лидерству.'
    }
    
    return descriptions[number] || 'Описание для данного числа будет добавлено в ближайшее время.'
  }

  private static getExpressionDescription(number: number): string {
    return `Число выражения ${number} показывает, как вы проявляете себя в мире и какие таланты вам даны для реализации.`
  }

  private static getExpressionDetailedDescription(number: number): string {
    return this.getLifePathDetailedDescription(number) // Используем те же описания для упрощения
  }

  private static getSoulUrgeDescription(number: number): string {
    return `Число души ${number} раскрывает ваши внутренние желания и то, что действительно движет вами изнутри.`
  }

  private static getSoulUrgeDetailedDescription(number: number): string {
    return this.getLifePathDetailedDescription(number) // Используем те же описания для упрощения
  }

  private static getPersonalityDescription(number: number): string {
    return `Число личности ${number} показывает, как вас воспринимают окружающие и какое впечатление вы производите.`
  }

  private static getPersonalityDetailedDescription(number: number): string {
    return this.getLifePathDetailedDescription(number) // Используем те же описания для упрощения
  }

  private static getDayNumberDescription(number: number): string {
    return `Число дня ${number} влияет на вашу повседневную активность и то, как вы проявляете себя в обычной жизни.`
  }

  private static getMonthNumberDescription(number: number): string {
    return `Число месяца ${number} связано с вашими эмоциональными проявлениями и способностью к адаптации.`
  }

  private static getYearNumberDescription(number: number): string {
    return `Число года ${number} отражает ваши долгосрочные цели и общее направление развития.`
  }
}

export default PDFGenerator



