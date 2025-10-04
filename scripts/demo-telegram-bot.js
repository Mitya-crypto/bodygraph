require('dotenv').config({ path: '.env.local' })

function generateTelegramBotRequest() {
  console.log('🤖 ДЕМОНСТРАЦИЯ ОТПРАВКИ В TELEGRAM BOT API')
  console.log('=' * 50)
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8296309758:AAFgJTxZ_Sc6qmOTGMwjab9V6LvkhhTlYm4'
  const chatId = 123456789 // Telegram ID пользователя
  
  // Данные, которые собираются при нажатии кнопки ассистента
  const assistantData = {
    user: {
      profile: {
        id: "1735816200000_abc123",
        name: "Икрянников Дмитрий Андреевич",
        birthDate: "1983-11-14",
        birthTime: "07:15",
        birthPlace: "Октябрьский",
        coordinates: {
          lat: 56.5148,
          lng: 57.2052
        },
        telegramId: chatId  // ← Telegram ID пользователя
      }
    },
    numerology: {
      lifePathNumber: 5,
      expressionNumber: 3,
      soulUrgeNumber: 2,
      personalityNumber: 1,
      dailyMetrics: {
        dayNumber: 4,
        personalDayNumber: 9,
        energyLevel: 98,
        favorableNumbers: [2, 3, 5],
        recommendedColors: ["Зеленый", "Коричневый", "Темно-синий"],
        bestTimes: ["08:00-10:00", "16:00-18:00"],
        weeklyEnergy: [68, 62, 74, 86, 74, 86, 98],
        todayScore: 98,
        moodScore: 85,
        creativityScore: 92,
        socialScore: 78
      }
    },
    humanDesign: {
      type: "Reflector",
      strategy: "Wait for the Lunar Cycle",
      authority: "Environmental",
      profile: "1/3",
      definition: "No Definition",
      centers: [
        { name: "Head", defined: false, color: "#0ea5e9" },
        { name: "Ajna", defined: false, color: "#d946ef" },
        { name: "Throat", defined: false, color: "#fbbf24" },
        { name: "G-Center", defined: false, color: "#ef4444" },
        { name: "Heart", defined: false, color: "#8b5cf6" },
        { name: "Solar Plexus", defined: false, color: "#06b6d4" },
        { name: "Sacral", defined: false, color: "#10b981" },
        { name: "Root", defined: false, color: "#f59e0b" },
        { name: "Spleen", defined: false, color: "#ec4899" }
      ],
      channels: [],
      gates: [],
      incarnationCross: {
        name: "Cross of Service",
        description: "Фокус на служении другим"
      }
    },
    astrology: {
      sunSign: "Близнецы",
      moonSign: "Лев",
      risingSign: "Скорпион",
      natalChart: {
        planets: [
          { name: "Sun", longitude: 191.32, latitude: 0 },
          { name: "Moon", longitude: 145.67, latitude: 0 },
          { name: "Mercury", longitude: 178.45, latitude: 0 },
          { name: "Venus", longitude: 203.89, latitude: 0 },
          { name: "Mars", longitude: 156.78, latitude: 0 },
          { name: "Jupiter", longitude: 234.56, latitude: 0 },
          { name: "Saturn", longitude: 267.89, latitude: 0 },
          { name: "Uranus", longitude: 298.12, latitude: 0 },
          { name: "Neptune", longitude: 312.45, latitude: 0 },
          { name: "Pluto", longitude: 289.67, latitude: 0 }
        ],
        houses: [
          { cusp: 0 }, { cusp: 30 }, { cusp: 60 }, { cusp: 90 },
          { cusp: 120 }, { cusp: 150 }, { cusp: 180 }, { cusp: 210 },
          { cusp: 240 }, { cusp: 270 }, { cusp: 300 }, { cusp: 330 }
        ],
        ascendant: 151.67,
        mc: 117.8
      },
      transits: {
        totalTransits: 9,
        majorTransits: 3,
        overallInfluence: "moderate",
        keyThemes: ["творчество", "коммуникация", "интуиция"],
        recommendations: [
          "Благоприятное время для новых начинаний",
          "Фокус на коммуникации и самовыражении",
          "Доверьтесь интуиции при принятии решений"
        ],
        activeTransits: [
          { planet: "Солнце", aspect: "Трин", influence: "Позитивная" },
          { planet: "Луна", aspect: "Секстиль", influence: "Нейтральная" },
          { planet: "Меркурий", aspect: "Квадрат", influence: "Сложная" }
        ]
      }
    },
    timestamp: "2025-01-02T10:30:00.000Z",
    sessionId: "session_1735816200000_abc123"
  }
  
  console.log('📤 HTTP ЗАПРОС К TELEGRAM BOT API:')
  console.log('=' * 50)
  console.log(`URL: https://api.telegram.org/bot${botToken}/sendMessage`)
  console.log(`Method: POST`)
  console.log('')
  
  console.log('📋 Заголовки:')
  console.log('Content-Type: application/json')
  console.log('')
  
  // Формируем сообщение для Telegram
  const message = `🤖 <b>Данные пользователя получены!</b>

👤 <b>Профиль:</b>
• Имя: ${assistantData.user.profile.name}
• Дата рождения: ${assistantData.user.profile.birthDate}
• Время: ${assistantData.user.profile.birthTime}
• Место: ${assistantData.user.profile.birthPlace}
• Telegram ID: ${assistantData.user.profile.telegramId}

📊 <b>Нумерология:</b>
• Число жизненного пути: ${assistantData.numerology.lifePathNumber}
• Число выражения: ${assistantData.numerology.expressionNumber}
• Число души: ${assistantData.numerology.soulUrgeNumber}
• Число личности: ${assistantData.numerology.personalityNumber}
• Энергия дня: ${assistantData.numerology.dailyMetrics.energyLevel}%

🧬 <b>Human Design:</b>
• Тип: ${assistantData.humanDesign.type}
• Стратегия: ${assistantData.humanDesign.strategy}
• Авторитет: ${assistantData.humanDesign.authority}
• Профиль: ${assistantData.humanDesign.profile}

⭐ <b>Астрология:</b>
• Солнце: ${assistantData.astrology.sunSign}
• Луна: ${assistantData.astrology.moonSign}
• Восходящий: ${assistantData.astrology.risingSign}
• Транзиты: ${assistantData.astrology.transits.totalTransits} активных

🕐 <b>Время сессии:</b> ${new Date(assistantData.timestamp).toLocaleString('ru-RU')}
🆔 <b>ID сессии:</b> ${assistantData.sessionId}

<i>Все данные успешно получены и обработаны!</i>`
  
  console.log('📦 Тело запроса (JSON):')
  console.log(JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML'
  }, null, 2))
  
  console.log('')
  console.log('📱 Форматированное сообщение для Telegram:')
  console.log('=' * 50)
  console.log(message)
  
  console.log('')
  console.log('📊 Статистика:')
  console.log(`Размер данных: ${JSON.stringify(assistantData).length} байт`)
  console.log(`Размер сообщения: ${message.length} символов`)
  console.log(`Количество полей: 6`)
  console.log(`Модули данных: numerology, humanDesign, astrology`)
  
  console.log('')
  console.log('🎯 Что происходит при нажатии кнопки:')
  console.log('1. Собираются все данные пользователя')
  console.log('2. Рассчитываются метрики всех модулей')
  console.log('3. Формируется HTML сообщение для Telegram')
  console.log('4. Отправляется POST запрос в Telegram Bot API')
  console.log('5. Пользователь получает сообщение в Telegram')
  
  console.log('')
  console.log('🔗 Telegram Bot API Endpoint:')
  console.log(`https://api.telegram.org/bot${botToken}/sendMessage`)
  
  console.log('')
  console.log('📋 Параметры запроса:')
  console.log(`chat_id: ${chatId} (Telegram ID пользователя)`)
  console.log('text: HTML сообщение с данными')
  console.log('parse_mode: HTML')
}

generateTelegramBotRequest()
