import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    console.log('🤖 Simple ChatGPT request:', { message })

    // Проверяем наличие API ключа
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured',
      }, { status: 500 })
    }

    // Простой запрос к OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Ты помогаешь пользователям с вопросами о нумерологии. Отвечай кратко и дружелюбно на русском языке.'
          },
          {
            role: 'user',
            content: message || 'Привет'
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errorText)
      
      return NextResponse.json({
        success: false,
        error: `OpenAI API error: ${openaiResponse.status}`,
        details: errorText,
      }, { status: 500 })
    }

    const data = await openaiResponse.json()
    const response = data.choices[0]?.message?.content || 'Нет ответа'

    console.log('✅ Simple ChatGPT response generated')

    return NextResponse.json({
      success: true,
      response,
      model: 'gpt-3.5-turbo',
    })

  } catch (error) {
    console.error('❌ Simple ChatGPT error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}



