// app/api/telegram/setup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { TELEGRAM_CONFIG, validateTelegramToken } from '@/lib/telegramConfig'

export async function POST(request: NextRequest) {
  try {
    // Проверяем токен
    if (!validateTelegramToken()) {
      return NextResponse.json({ 
        error: 'Invalid bot token. Please set TELEGRAM_BOT_TOKEN in your environment variables.',
        token: TELEGRAM_CONFIG.botToken 
      }, { status: 401 })
    }

    const botApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}`
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3001'}/api/telegram/webhook`

    console.log('🤖 Setting up Telegram bot...')
    console.log('📡 Webhook URL:', webhookUrl)

    // Устанавливаем webhook
    const webhookResponse = await fetch(`${botApiUrl}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query']
      }),
    })

    const webhookResult = await webhookResponse.json()
    console.log('📡 Webhook setup result:', webhookResult)

    // Устанавливаем команды бота
    const commandsResponse = await fetch(`${botApiUrl}/setMyCommands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commands: TELEGRAM_CONFIG.commands
      }),
    })

    const commandsResult = await commandsResponse.json()
    console.log('📋 Commands setup result:', commandsResult)

    // Получаем информацию о боте
    const botInfoResponse = await fetch(`${botApiUrl}/getMe`)
    const botInfo = await botInfoResponse.json()
    console.log('🤖 Bot info:', botInfo)

    return NextResponse.json({
      success: true,
      message: 'Telegram bot setup completed successfully',
      botInfo: botInfo.result,
      webhook: webhookResult,
      commands: commandsResult,
      webhookUrl,
      botUrl: `https://t.me/${botInfo.result?.username}`
    })

  } catch (error) {
    console.error('❌ Telegram bot setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to setup Telegram bot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!validateTelegramToken()) {
      return NextResponse.json({ 
        error: 'Invalid bot token',
        instructions: [
          '1. Create a new bot with @BotFather',
          '2. Get your bot token',
          '3. Set TELEGRAM_BOT_TOKEN environment variable',
          '4. Call POST /api/telegram/setup to configure the bot'
        ]
      }, { status: 401 })
    }

    const botApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}`
    
    // Получаем информацию о боте
    const botInfoResponse = await fetch(`${botApiUrl}/getMe`)
    const botInfo = await botInfoResponse.json()

    // Получаем информацию о webhook
    const webhookInfoResponse = await fetch(`${botApiUrl}/getWebhookInfo`)
    const webhookInfo = await webhookInfoResponse.json()

    return NextResponse.json({
      botInfo: botInfo.result,
      webhookInfo: webhookInfo.result,
      commands: TELEGRAM_CONFIG.commands,
      config: {
        botName: TELEGRAM_CONFIG.botName,
        botDescription: TELEGRAM_CONFIG.botDescription,
        webAppUrl: TELEGRAM_CONFIG.webAppUrl
      }
    })

  } catch (error) {
    console.error('❌ Error getting bot info:', error)
    return NextResponse.json({ 
      error: 'Failed to get bot information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



