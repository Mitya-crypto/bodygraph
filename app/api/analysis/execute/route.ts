import { NextRequest, NextResponse } from 'next/server'
import { 
  executeAnalysisBySubscription, 
  createWorkflowRequest,
  type WorkflowRequest 
} from '@/lib/n8nWorkflowExecutor'
import { hasFeatureAccess } from '@/lib/subscriptionManager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, scenario, userId } = body

    console.log('🔮 Analysis execution request:', {
      userId,
      scenario,
      hasProfile: !!userProfile,
    })

    // Проверяем валидность данных
    if (!userProfile || !userId) {
      return NextResponse.json(
        { error: 'User profile and user ID are required' },
        { status: 400 }
      )
    }

    // Проверяем доступ к функциям
    const isPremium = hasFeatureAccess(userId, 'aiAssistant', 'basic')
    
    // Определяем сценарий
    const analysisScenario = isPremium ? 'premium' : 'free'
    
    // Создаем запрос для workflow
    const workflowRequest = createWorkflowRequest(userProfile, analysisScenario)
    
    // Выполняем анализ
    const result = await executeAnalysisBySubscription(workflowRequest, isPremium)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Analysis failed',
          details: 'Failed to generate analysis'
        },
        { status: 500 }
      )
    }

    console.log('✅ Analysis completed successfully:', {
      scenario: analysisScenario,
      executionTime: result.executionTime,
      hasPdf: !!result.pdfUrl,
    })

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      executionTime: result.executionTime,
      timestamp: result.timestamp,
      pdfUrl: result.pdfUrl,
      scenario: analysisScenario,
      isPremium,
    })

  } catch (error) {
    console.error('❌ Analysis execution error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const requestId = searchParams.get('requestId')

    if (!userId || !requestId) {
      return NextResponse.json(
        { error: 'User ID and request ID are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Getting analysis status:', { userId, requestId })

    // Здесь можно добавить логику получения статуса выполнения
    // Пока возвращаем заглушку
    
    return NextResponse.json({
      success: true,
      status: 'completed',
      message: 'Analysis completed successfully',
    })

  } catch (error) {
    console.error('❌ Analysis status error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get analysis status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}



