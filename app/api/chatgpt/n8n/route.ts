import { NextRequest, NextResponse } from 'next/server'
import { executeN8NWorkflow } from '@/lib/n8nApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, isPremium, userProfile } = body

    console.log('🤖 ChatGPT n8n request:', {
      message: message?.substring(0, 100) + '...',
      isPremium,
      hasProfile: !!userProfile,
    })

    // Подготавливаем данные для n8n workflow
    const workflowData = {
      message: message || 'Привет',
      isPremium: isPremium || false,
      userProfile: userProfile || null,
      context: context || {},
      timestamp: new Date().toISOString(),
    }

    // Определяем ID workflow для ChatGPT
    const workflowId = isPremium ? 'chatgpt-premium-workflow' : 'chatgpt-basic-workflow'

    // Выполняем n8n workflow
    const execution = await executeN8NWorkflow(workflowId, workflowData)

    if (!execution) {
      throw new Error('Failed to execute ChatGPT workflow')
    }

    // Получаем ответ из результата workflow
    const response = execution.resultData?.response || 
                    execution.data?.response || 
                    getFallbackResponse(isPremium)

    console.log('✅ ChatGPT n8n response generated')

    return NextResponse.json({
      success: true,
      response,
      model: isPremium ? 'gpt-4-via-n8n' : 'gpt-3.5-via-n8n',
      isPremium,
      executionId: execution.id,
    })

  } catch (error) {
    console.error('❌ ChatGPT n8n error:', error)
    
    // Fallback response
    const fallbackResponse = getFallbackResponse(false)
    
    return NextResponse.json({
      success: false,
      response: fallbackResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      isFallback: true,
    })
  }
}

function getFallbackResponse(isPremium: boolean): string {
  const basicResponses = [
    "Привет! Я ваш AI ассистент. К сожалению, сейчас у меня технические проблемы с подключением к n8n. Попробуйте позже или обратитесь к разделам нумерологии и астрологии.",
    "Добро пожаловать! Временно использую упрощенный режим. Для полного анализа обратитесь к основным разделам приложения.",
  ]

  const premiumResponses = [
    "Добро пожаловать в премиум режим! К сожалению, ChatGPT-5 через n8n временно недоступен. Рекомендую использовать детальные разделы анализа.",
    "Здравствуйте! Ваш персональный AI ассистент временно недоступен. Используйте расширенные возможности нумерологии и Human Design.",
  ]

  const responses = isPremium ? premiumResponses : basicResponses
  return responses[Math.floor(Math.random() * responses.length)]
}



