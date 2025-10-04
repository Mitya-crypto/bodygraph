// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { TELEGRAM_CONFIG, validateTelegramToken } from '@/lib/telegramConfig'

export async function POST(request: NextRequest) {
  try {
    // Проверяем токен
    if (!validateTelegramToken()) {
      console.error('❌ Invalid Telegram bot token')
      return NextResponse.json({ error: 'Invalid bot token' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📨 Telegram webhook received:', body)

    // Проверяем, что это сообщение от пользователя
    if (!body.message || !body.message.from) {
      return NextResponse.json({ ok: true })
    }

    const message = body.message
    const chatId = message.chat.id
    const text = message.text
    const userId = message.from.id
    const username = message.from.username || message.from.first_name

    console.log(`👤 User ${username} (${userId}) sent: ${text}`)

    // Обрабатываем команды
    if (text?.startsWith('/start')) {
      await sendMessage(chatId, TELEGRAM_CONFIG.messages.welcome, getMainMenu())
    } 
    else if (text?.startsWith('/help')) {
      await sendMessage(chatId, TELEGRAM_CONFIG.messages.help)
    }
    else if (text?.startsWith('/profile')) {
      await handleProfileCommand(chatId, userId)
    }
    else if (text?.startsWith('/numerology')) {
      await handleNumerologyCommand(chatId, userId)
    }
    else if (text?.startsWith('/astrology')) {
      await handleAstrologyCommand(chatId, userId)
    }
    else if (text?.startsWith('/humandesign')) {
      await handleHumanDesignCommand(chatId, userId)
    }
    else if (text === '🔢 Нумерология') {
      await handleNumerologyCommand(chatId, userId)
    }
    else if (text === '♈ Астрология') {
      await handleAstrologyCommand(chatId, userId)
    }
    else if (text === '🧬 Human Design') {
      await handleHumanDesignCommand(chatId, userId)
    }
    else {
      // Неизвестная команда
      await sendMessage(chatId, '❓ Неизвестная команда. Используйте /help для справки.')
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('❌ Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Функция для отправки сообщения
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  try {
    const response = await fetch(`${TELEGRAM_CONFIG.botToken.replace('bot', 'https://api.telegram.org/bot')}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      }),
    })

    if (!response.ok) {
      console.error('❌ Failed to send message:', await response.text())
    } else {
      console.log('✅ Message sent successfully')
    }
  } catch (error) {
    console.error('❌ Error sending message:', error)
  }
}

// Функция для создания главного меню
function getMainMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🔢 Нумерология', callback_data: 'numerology' },
        { text: '♈ Астрология', callback_data: 'astrology' }
      ],
      [
        { text: '🧬 Human Design', callback_data: 'humandesign' }
      ],
      [
        { text: '👤 Профиль', callback_data: 'profile' },
        { text: '❓ Помощь', callback_data: 'help' }
      ]
    ]
  }
}

// Обработчики команд
async function handleProfileCommand(chatId: number, userId: number) {
  const message = `👤 Управление профилем

Для создания профиля перейдите в веб-приложение:
${TELEGRAM_CONFIG.webAppUrl}

Там вы сможете:
• Ввести дату и время рождения
• Указать место рождения
• Сохранить свои данные

После создания профиля вернитесь в бот для получения анализов!`
  
  await sendMessage(chatId, message, {
    inline_keyboard: [
      [{ text: '🌐 Открыть веб-приложение', url: TELEGRAM_CONFIG.webAppUrl }],
      [{ text: '🔙 Назад', callback_data: 'main_menu' }]
    ]
  })
}

async function handleNumerologyCommand(chatId: number, userId: number) {
  const message = `🔢 Нумерологический анализ

Для получения нумерологического анализа:
1. Перейдите в веб-приложение
2. Создайте профиль (если еще не создан)
3. Выберите модуль "Нумерология"

Вы узнаете:
• Число жизненного пути
• Число выражения
• Число души
• Число личности
• Биоритмы`

  await sendMessage(chatId, message, {
    inline_keyboard: [
      [{ text: '🌐 Открыть нумерологию', url: `${TELEGRAM_CONFIG.webAppUrl}/?module=numerology` }],
      [{ text: '🔙 Назад', callback_data: 'main_menu' }]
    ]
  })
}

async function handleAstrologyCommand(chatId: number, userId: number) {
  const message = `♈ Астрологический анализ

Для получения астрологического анализа:
1. Перейдите в веб-приложение
2. Создайте профиль (если еще не создан)
3. Выберите модуль "Астрология"

Вы получите:
• Натальную карту
• Позиции планет
• Знаки зодиака
• Дома и аспекты
• Подробные интерпретации`

  await sendMessage(chatId, message, {
    inline_keyboard: [
      [{ text: '🌐 Открыть астрологию', url: `${TELEGRAM_CONFIG.webAppUrl}/?module=astrology` }],
      [{ text: '🔙 Назад', callback_data: 'main_menu' }]
    ]
  })
}

async function handleHumanDesignCommand(chatId: number, userId: number) {
  const message = `🧬 Human Design анализ

Для получения Human Design анализа:
1. Перейдите в веб-приложение
2. Создайте профиль (если еще не создан)
3. Выберите модуль "Human Design"

Вы узнаете:
• Ваш тип (Генератор, Проектор и т.д.)
• Стратегию и авторитет
• Профиль
• Центры и каналы
• Ворота и линии`

  await sendMessage(chatId, message, {
    inline_keyboard: [
      [{ text: '🌐 Открыть Human Design', url: `${TELEGRAM_CONFIG.webAppUrl}/?module=humandesign` }],
      [{ text: '🔙 Назад', callback_data: 'main_menu' }]
    ]
  })
}

// Обработка GET запросов (для проверки webhook)
export async function GET() {
  return NextResponse.json({ 
    message: 'Telegram webhook endpoint is working',
    timestamp: new Date().toISOString()
  })
}



