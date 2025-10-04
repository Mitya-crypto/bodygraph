import { NextRequest, NextResponse } from 'next/server'

interface AssistantData {
  user: {
    profile: {
      id: string
      name: string
      birthDate: string
      birthTime: string
      birthPlace: string
      coordinates: {
        lat: number
        lng: number
      }
    }
  }
  numerology: {
    lifePathNumber: number
    expressionNumber: number
    soulUrgeNumber: number
    personalityNumber: number
    dailyMetrics: {
      dayNumber: number
      personalDayNumber: number
      energyLevel: number
      favorableNumbers: number[]
      recommendedColors: string[]
      bestTimes: string[]
      weeklyEnergy: number[]
      todayScore: number
      moodScore: number
      creativityScore: number
      socialScore: number
    }
  }
  humanDesign: {
    type: string
    strategy: string
    authority: string
    profile: string
    definition: string
    centers: Array<{
      name: string
      defined: boolean
      color: string
    }>
    channels: Array<{
      number: string
      name: string
      gates: string[]
    }>
    gates: Array<{
      number: string
      name: string
      center: string
    }>
    incarnationCross: {
      name: string
      description: string
    }
  }
  astrology: {
    sunSign: string
    moonSign: string
    risingSign: string
    natalChart: {
      planets: Array<{
        name: string
        longitude: number
        latitude: number
      }>
      houses: Array<{
        cusp: number
      }>
      ascendant: number
      mc: number
    }
    transits: {
      totalTransits: number
      majorTransits: number
      overallInfluence: string
      keyThemes: string[]
      recommendations: string[]
      activeTransits: Array<{
        planet: string
        aspect: string
        influence: string
      }>
    }
  }
  timestamp: string
  sessionId: string
}

export async function POST(request: NextRequest) {
  try {
    const data: AssistantData = await request.json()
    
    console.log('🤖 Assistant data received:', {
      userId: data.user.profile.id,
      name: data.user.profile.name,
      module: 'all',
      timestamp: data.timestamp
    })

    // Пробуем отправить в Telegram Bot API
    console.log('📤 Sending data to Telegram Bot API...')
    let result
    try {
      result = await sendToTelegramBot(data)
      console.log('✅ Telegram Bot response:', result)
    } catch (error) {
      console.log('⚠️ Telegram API недоступен, сохраняем в файл:', error instanceof Error ? error.message : String(error))
      
      // Сохраняем данные в файл как fallback
      const fs = require('fs')
      const path = require('path')
      
      const fileName = `assistant_data_${data.sessionId}.json`
      const filePath = path.join(process.cwd(), 'assistant_data', fileName)
      
      // Создаем папку если не существует
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // Сохраняем данные
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      
      result = {
        success: true,
        message: 'Данные сохранены в файл (Telegram API недоступен)',
        filePath: filePath
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Данные успешно обработаны',
      data: {
        sessionId: data.sessionId,
        timestamp: data.timestamp,
        modules: ['numerology', 'humanDesign', 'astrology'],
        result: result
      }
    })

  } catch (error) {
    console.error('❌ Error sending data to assistant:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Ошибка отправки данных ассистенту',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Функция для отправки данных внешнему боту-ассистенту
async function sendToTelegramBot(data: AssistantData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = (data.user.profile as any).telegramId
  
  if (!botToken) {
    console.log('⚠️ Telegram bot token not configured')
    return { success: false, message: 'Telegram bot token not configured' }
  }
  
  if (!chatId) {
    console.log('⚠️ Telegram user ID not found in data')
    return { success: false, message: 'Telegram user ID not found' }
  }
  
  console.log('📤 Sending to Telegram Bot API:', {
    botToken: botToken.substring(0, 10) + '...',
    chatId: chatId,
    dataSize: JSON.stringify(data).length
  })
  
  try {
    // Формируем сообщение для Telegram
    const message = formatTelegramMessage(data)
    
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Telegram API responded with ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ Telegram bot response:', result)
    return { success: true, message: 'Data sent to Telegram bot successfully' }
    
  } catch (error) {
    console.error('❌ Error sending to Telegram bot:', error)
    throw error
  }
}

function formatTelegramMessage(data: AssistantData): string {
  const { user, numerology, humanDesign, astrology } = data
  
  return `🤖 <b>Данные пользователя получены!</b>

👤 <b>Профиль:</b>
• Имя: ${user.profile.name}
• Дата рождения: ${user.profile.birthDate}
• Время: ${user.profile.birthTime}
• Место: ${user.profile.birthPlace}
• Telegram ID: ${(user.profile as any).telegramId || 'N/A'}

📊 <b>Нумерология:</b>
• Число жизненного пути: ${numerology.lifePathNumber}
• Число выражения: ${numerology.expressionNumber}
• Число души: ${numerology.soulUrgeNumber}
• Число личности: ${numerology.personalityNumber}
• Энергия дня: ${numerology.dailyMetrics.energyLevel}%

🧬 <b>Human Design:</b>
• Тип: ${humanDesign.type}
• Стратегия: ${humanDesign.strategy}
• Авторитет: ${humanDesign.authority}
• Профиль: ${humanDesign.profile}

⭐ <b>Астрология:</b>
• Солнце: ${astrology.sunSign}
• Луна: ${astrology.moonSign}
• Восходящий: ${astrology.risingSign}
• Транзиты: ${astrology.transits.totalTransits} активных

🕐 <b>Время сессии:</b> ${new Date(data.timestamp).toLocaleString('ru-RU')}
🆔 <b>ID сессии:</b> ${data.sessionId}

<i>Все данные успешно получены и обработаны!</i>`
}
