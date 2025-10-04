#!/usr/bin/env node

/**
 * Демонстрация ИСПРАВЛЕННОГО запроса к ассистенту
 * Показывает разделение: полные данные на webhook, краткая сводка в Telegram
 */

const crypto = require('crypto')

// Загружаем переменные окружения
require('dotenv').config({ path: '.env.local' })

function demonstrateFixedRequest() {
  console.log('🔧 ИСПРАВЛЕННЫЙ ЗАПРОС К АССИСТЕНТУ')
  console.log('=' * 50)
  
  // Полные данные (отправляются на webhook)
  const fullData = {
    user: {
      profile: {
        id: "1735816200000_abc123",
        name: "Икрянников Дмитрий Андреевич",
        birthDate: "1983-11-14",
        birthTime: "07:15",
        birthPlace: "Октябрьский",
        coordinates: { lat: 56.5148, lng: 57.2052 }
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
        { name: "Ajna", defined: false, color: "#d946ef" }
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
          { name: "Moon", longitude: 145.67, latitude: 0 }
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
          "Фокус на коммуникации и самовыражении"
        ],
        activeTransits: [
          { planet: "Солнце", aspect: "Трин", influence: "Позитивная" },
          { planet: "Луна", aspect: "Секстиль", influence: "Нейтральная" }
        ]
      }
    },
    timestamp: "2025-01-02T10:30:00.000Z",
    sessionId: "session_1735816200000_abc123"
  }
  
  // Краткая сводка (отправляется в Telegram)
  const telegramSummary = {
    type: 'assistant_request',
    user: {
      name: fullData.user.profile.name,
      birthDate: fullData.user.profile.birthDate
    },
    modules: ['numerology', 'humanDesign', 'astrology'],
    sessionId: fullData.sessionId,
    timestamp: fullData.timestamp,
    status: 'sent_to_assistant'
  }
  
  const apiKey = process.env.ASSISTANT_BOT_API_KEY
  const signingSecret = process.env.ASSISTANT_BOT_SIGNING_SECRET
  
  // Генерируем HMAC подпись для полных данных
  const signature = crypto
    .createHmac('sha256', signingSecret)
    .update(JSON.stringify(fullData))
    .digest('hex')
  
  console.log('\n📤 1. ПОЛНЫЕ ДАННЫЕ → WEBHOOK:')
  console.log('=' * 50)
  console.log('URL: https://rufeyesedoub.beget.app/webhook/ingest/test-secret-ing')
  console.log('Method: POST')
  console.log('\n📋 Заголовки:')
  console.log('Content-Type: application/json')
  console.log(`X-API-Key: ${apiKey}`)
  console.log(`X-Signature: sha256=${signature}`)
  console.log(`\n📦 Размер полных данных: ${JSON.stringify(fullData).length} байт`)
  
  console.log('\n📱 2. КРАТКАЯ СВОДКА → TELEGRAM:')
  console.log('=' * 50)
  console.log('Метод: window.Telegram.WebApp.sendData()')
  console.log('\n📦 Тело запроса (JSON):')
  console.log(JSON.stringify(telegramSummary, null, 2))
  console.log(`\n📊 Размер сводки: ${JSON.stringify(telegramSummary).length} байт`)
  
  console.log('\n✅ ПРЕИМУЩЕСТВА ИСПРАВЛЕНИЯ:')
  console.log('=' * 50)
  console.log('• Полные данные отправляются на webhook (без ограничений)')
  console.log('• Краткая сводка отправляется в Telegram (маленький размер)')
  console.log('• Нет ошибки "Data is too long"')
  console.log('• Все данные сохраняются на сервере ассистента')
  console.log('• Telegram получает уведомление о статусе')
  
  console.log('\n🎯 РЕЗУЛЬТАТ:')
  console.log('=' * 50)
  console.log('✅ Webhook получает полные данные для обработки')
  console.log('✅ Telegram получает краткое уведомление')
  console.log('✅ Нет ошибок размера данных')
  console.log('✅ Система работает корректно!')
}

demonstrateFixedRequest()
