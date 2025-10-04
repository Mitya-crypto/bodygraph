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
  numerologyData: any
  sections: {
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
  footer: string
}

export class PDFGenerator {
  private static generateHTML(content: PDFContent): string {
    const currentDate = new Date().toLocaleDateString('ru-RU')
    
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
    
    <div class="section">
        <div class="section-title">Число Жизненного Пути</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(content.sections.lifePath.number) ? 'master-number' : ''}">${content.sections.lifePath.number}</div>
            <div class="number-label">Число Жизненного Пути</div>
        </div>
        <div class="description">${content.sections.lifePath.description}</div>
        <div class="detailed-description">${content.sections.lifePath.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Выражения</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(content.sections.expression.number) ? 'master-number' : ''}">${content.sections.expression.number}</div>
            <div class="number-label">Число Выражения</div>
        </div>
        <div class="description">${content.sections.expression.description}</div>
        <div class="detailed-description">${content.sections.expression.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Души</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(content.sections.soulUrge.number) ? 'master-number' : ''}">${content.sections.soulUrge.number}</div>
            <div class="number-label">Число Души</div>
        </div>
        <div class="description">${content.sections.soulUrge.description}</div>
        <div class="detailed-description">${content.sections.soulUrge.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Число Личности</div>
        <div class="number-display">
            <div class="main-number ${this.isMasterNumber(content.sections.personality.number) ? 'master-number' : ''}">${content.sections.personality.number}</div>
            <div class="number-label">Число Личности</div>
        </div>
        <div class="description">${content.sections.personality.description}</div>
        <div class="detailed-description">${content.sections.personality.detailedDescription}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Дополнительные Числа</div>
        <div class="additional-numbers">
            <div class="additional-number">
                <div class="additional-number-value">${content.sections.additionalNumbers.dayNumber}</div>
                <div class="additional-number-label">Число Дня</div>
            </div>
            <div class="additional-number">
                <div class="additional-number-value">${content.sections.additionalNumbers.monthNumber}</div>
                <div class="additional-number-label">Число Месяца</div>
            </div>
            <div class="additional-number">
                <div class="additional-number-value">${content.sections.additionalNumbers.yearNumber}</div>
                <div class="additional-number-label">Число Года</div>
            </div>
        </div>
        <div class="description">
            <p><strong>Число дня (${content.sections.additionalNumbers.dayNumber}):</strong> ${content.sections.additionalNumbers.descriptions.day}</p>
            <p><strong>Число месяца (${content.sections.additionalNumbers.monthNumber}):</strong> ${content.sections.additionalNumbers.descriptions.month}</p>
            <p><strong>Число года (${content.sections.additionalNumbers.yearNumber}):</strong> ${content.sections.additionalNumbers.descriptions.year}</p>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Биоритмы</div>
        <div class="biorythms">
            <div class="biorythm">
                <div class="biorythm-value">${content.sections.biorythms.physical.toFixed(1)}%</div>
                <div class="biorythm-label">Физический</div>
            </div>
            <div class="biorythm">
                <div class="biorythm-value">${content.sections.biorythms.emotional.toFixed(1)}%</div>
                <div class="biorythm-label">Эмоциональный</div>
            </div>
            <div class="biorythm">
                <div class="biorythm-value">${content.sections.biorythms.intellectual.toFixed(1)}%</div>
                <div class="biorythm-label">Интеллектуальный</div>
            </div>
        </div>
        <div class="description">${content.sections.biorythms.description}</div>
    </div>
    
    <div class="footer">
        <p>${content.footer}</p>
        <p>Отчет сгенерирован ${currentDate}</p>
    </div>
</body>
</html>
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



