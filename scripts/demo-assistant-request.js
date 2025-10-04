#!/usr/bin/env node

/**
 * Демонстрация запроса к ассистенту
 * Показывает точный формат данных, которые отправляются при нажатии кнопки
 */

const crypto = require('crypto')

// Загружаем переменные окружения
require('dotenv').config({ path: '.env.local' })

function generateAssistantRequest() {
  console.log('🤖 ДЕМОНСТРАЦИЯ ЗАПРОСА К АССИСТЕНТУ')
  console.log('=' * 50)
  
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
        telegramId: 123456789  // ← Telegram ID пользователя
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
        houses: Array.from({ length: 12 }, (_, i) => ({ cusp: i * 30 })),
        ascendant: 151.67,
        mc: 117.80
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
  
  const requestBody = JSON.stringify(assistantData, null, 2)
  const apiKey = process.env.ASSISTANT_BOT_API_KEY
  const signingSecret = process.env.ASSISTANT_BOT_SIGNING_SECRET
  
  // Генерируем HMAC подпись
  const signature = crypto
    .createHmac('sha256', signingSecret)
    .update(JSON.stringify(assistantData))
    .digest('hex')
  
  console.log('\n📤 HTTP ЗАПРОС К АССИСТЕНТУ:')
  console.log('=' * 50)
  console.log('URL: https://rufeyesedoub.beget.app/webhook/ingest/test-secret-ing')
  console.log('Method: POST')
  console.log('\n📋 Заголовки:')
  console.log('Content-Type: application/json')
  console.log(`X-API-Key: ${apiKey}`)
  console.log(`X-Signature: sha256=${signature}`)
  
  console.log('\n📦 Тело запроса (JSON):')
  console.log('=' * 50)
  console.log(requestBody)
  
  console.log('\n📊 Статистика:')
  console.log(`Размер данных: ${requestBody.length} байт`)
  console.log(`Количество полей: ${Object.keys(assistantData).length}`)
  console.log(`Модули данных: ${Object.keys(assistantData).filter(k => k !== 'user' && k !== 'timestamp' && k !== 'sessionId').join(', ')}`)
  
  console.log('\n🎯 Что происходит при нажатии кнопки:')
  console.log('1. Собираются все данные пользователя')
  console.log('2. Рассчитываются метрики всех модулей')
  console.log('3. Формируется JSON с полными данными')
  console.log('4. Отправляется POST запрос на ваш webhook')
  console.log('5. Показывается статус отправки пользователю')
}

generateAssistantRequest()
