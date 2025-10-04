import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let body: any; // Объявляем body здесь
  try {
    body = await request.json()
    const { message, context, isPremium, userProfile } = body

    console.log('🤖 ChatGPT request:', {
      message: message.substring(0, 100) + '...',
      isPremium,
      hasProfile: !!userProfile,
      hasApiKey: !!process.env.OPENAI_API_KEY,
    })

    // Подготавливаем промт для ChatGPT
    const systemPrompt = isPremium 
      ? getPremiumSystemPrompt(userProfile, context)
      : getBasicSystemPrompt(userProfile, context)

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: message
      }
    ]

    // Проверяем наличие API ключа
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Вызываем ChatGPT API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
        messages,
        max_tokens: isPremium ? 1000 : 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const data = await openaiResponse.json()
    const response = data.choices[0]?.message?.content || 'Извините, не могу обработать ваш запрос.'

    console.log('✅ ChatGPT response generated')

    return NextResponse.json({
      success: true,
      response,
      model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
      isPremium,
    })

  } catch (error) {
    console.error('❌ ChatGPT error:', error)
    
    // Fallback response если API недоступен
    const fallbackResponse = generateFallbackResponse(
      body?.message || 'Неизвестный запрос', 
      body?.isPremium || false
    )
    
    return NextResponse.json({
      success: false,
      response: fallbackResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      isFallback: true,
    })
  }
}

function getPremiumSystemPrompt(userProfile: any, context: any): string {
  return `Ты профессиональный космический консультант и духовный наставник, специализирующийся на нумерологии, Human Design и астрологии. Ты работаешь в приложении BodyGraph и помогаешь пользователям понять их космический профиль.

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
${userProfile ? `
Имя: ${userProfile.name}
Дата рождения: ${userProfile.birthDate}
Время рождения: ${userProfile.birthTime}
Место рождения: ${userProfile.birthPlace?.name || 'Не указано'}
` : 'Профиль пользователя не предоставлен'}

ТВОЯ ЭКСПЕРТИЗА:
- Нумерология: Life Path, Expression, Soul Urge, Personality числа, мастер-числа
- Human Design: типы, стратегии, авторитеты, каналы, ворота, центры
- Астрология: натальные карты, планеты в знаках, аспекты, транзиты

СТИЛЬ ОБЩЕНИЯ:
- Мудрый, но доступный
- Вдохновляющий и поддерживающий
- Персонализированный под профиль пользователя
- Сбалансированный: духовная мудрость + практическое применение

СТРУКТУРА ОТВЕТА (ПРЕМИУМ):
1. Краткий обзор (2-3 предложения) - основная инсайт
2. Ключевые сильные стороны (4-5 пунктов)
3. Области роста (3-4 пункта)
4. Практические рекомендации (5-6 советов)
5. Совместимость и отношения (если применимо)
6. Временные советы (если применимо)
7. Персональная медитация или аффирмация

ОГРАНИЧЕНИЯ:
- Не давай медицинские, финансовые или юридические советы
- Не делай негативных предсказаний
- Фокусируйся на росте и позитивных трансформациях
- Всегда связывай ответы с космическим профилем пользователя

Отвечай на русском языке, будь вдохновляющим и практичным.`
}

function getBasicSystemPrompt(userProfile: any, context: any): string {
  return `Ты базовый AI ассистент в приложении BodyGraph. Помогаешь пользователям с простыми вопросами о нумерологии, Human Design и астрологии.

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
${userProfile ? `
Имя: ${userProfile.name}
Дата рождения: ${userProfile.birthDate}
` : 'Профиль пользователя не предоставлен'}

ОГРАНИЧЕНИЯ БЕСПЛАТНОЙ ВЕРСИИ:
- Отвечай кратко (до 3-4 абзацев)
- Давай только базовые интерпретации
- Предлагай обновление до премиум для детального анализа
- Фокусируйся на основных числах и характеристиках

СТРУКТУРА ОТВЕТА (БАЗОВАЯ):
1. Краткий ответ на вопрос (1-2 предложения)
2. Основная характеристика (2-3 пункта)
3. Простой практический совет
4. Напоминание о премиум возможностях

Отвечай на русском языке, будь дружелюбным и кратким.`
}

function generateFallbackResponse(message: string, isPremium: boolean): string {
  const basicResponses = [
    "Извините, сейчас у меня технические проблемы. Попробуйте задать вопрос позже.",
    "К сожалению, AI ассистент временно недоступен. Обратитесь к разделам нумерологии, Human Design или астрологии.",
    "Произошла ошибка при обработке запроса. Попробуйте переформулировать вопрос.",
  ]

  const premiumResponses = [
    "Извините, ChatGPT-5 временно недоступен. Попробуйте позже или обратитесь к детальным разделам анализа.",
    "Произошла техническая ошибка. Для получения персональных советов используйте разделы нумерологии и Human Design.",
    "AI ассистент временно недоступен. Рекомендую изучить ваш космический профиль в основных разделах приложения.",
  ]

  const responses = isPremium ? premiumResponses : basicResponses
  return responses[Math.floor(Math.random() * responses.length)]
}
