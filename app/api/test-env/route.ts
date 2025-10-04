import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasN8NToken: !!process.env.N8N_API_TOKEN,
    hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
    n8NTokenPrefix: process.env.N8N_API_TOKEN?.substring(0, 10) + '...',
    telegramTokenPrefix: process.env.TELEGRAM_BOT_TOKEN?.substring(0, 10) + '...',
  })
}



