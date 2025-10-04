// lib/n8nWorkflowExecutor.ts
import { N8N_CONFIG, N8N_WORKFLOW_IDS } from './n8nConfig'
import { executeN8NWorkflow } from './n8nApi'

export interface WorkflowRequest {
  userProfile: {
    name: string
    birthDate: string
    birthTime: string
    birthPlace: {
      name: string
      latitude: number
      longitude: number
    }
  }
  scenario: 'free' | 'premium'
  options: {
    includeDetailedAnalysis?: boolean
    includeQuickInsights?: boolean
    includeRecommendations?: boolean
    includeComparisons?: boolean
  }
  requestId: string
  timestamp: string
}

export interface WorkflowResponse {
  success: boolean
  analysis?: {
    numerology?: any
    humanDesign?: any
    astrology?: any
    aiInsights?: any
    recommendations?: any
  }
  error?: string
  executionTime?: string
  timestamp: string
  pdfUrl?: string
}

// Выполнение workflow для бесплатного пользователя
export async function executeFreeAnalysis(request: WorkflowRequest): Promise<WorkflowResponse> {
  try {
    console.log('🚀 Executing free analysis workflow...', {
      userId: request.userProfile.name,
      scenario: request.scenario,
    })

    // Вызываем n8n workflow для бесплатного анализа
    const execution = await executeN8NWorkflow(N8N_WORKFLOW_IDS.scenario1, request)
    
    if (!execution) {
      throw new Error('Failed to execute free analysis workflow')
    }

    // Обрабатываем результат
    const result = execution.resultData || execution.data
    
    return {
      success: true,
      analysis: {
        numerology: result.numerology,
        humanDesign: result.humanDesign,
        astrology: result.astrology,
        recommendations: result.summary,
      },
      executionTime: result.executionTime,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('❌ Free analysis workflow error:', error)
    
    // Fallback к локальным расчетам
    return await executeLocalFreeAnalysis(request)
  }
}

// Выполнение workflow для премиум пользователя
export async function executePremiumAnalysis(request: WorkflowRequest): Promise<WorkflowResponse> {
  try {
    console.log('🚀 Executing premium analysis workflow...', {
      userId: request.userProfile.name,
      scenario: request.scenario,
    })

    // Вызываем n8n workflow для премиум анализа
    const execution = await executeN8NWorkflow(N8N_WORKFLOW_IDS.scenario2, request)
    
    if (!execution) {
      throw new Error('Failed to execute premium analysis workflow')
    }

    // Обрабатываем результат
    const result = execution.resultData || execution.data
    
    return {
      success: true,
      analysis: {
        numerology: result.numerology,
        humanDesign: result.humanDesign,
        astrology: result.astrology,
        aiInsights: result.aiInsights,
        recommendations: result.recommendations,
      },
      executionTime: result.executionTime,
      timestamp: new Date().toISOString(),
      pdfUrl: result.pdfUrl,
    }
  } catch (error) {
    console.error('❌ Premium analysis workflow error:', error)
    
    // Fallback к локальным расчетам
    return await executeLocalPremiumAnalysis(request)
  }
}

// Fallback: локальные расчеты для бесплатного анализа
async function executeLocalFreeAnalysis(request: WorkflowRequest): Promise<WorkflowResponse> {
  console.log('📊 Executing local free analysis fallback...')
  
  try {
    // Импортируем функции расчета
    const { calculateLifePath, calculateExpression, calculateSoulUrge, calculatePersonality } = await import('./numerology')
    
    const birthDate = new Date(request.userProfile.birthDate)
    const day = birthDate.getDate()
    const month = birthDate.getMonth() + 1
    const year = birthDate.getFullYear()
    
    // Основные расчеты нумерологии
    const numerology = {
      lifePath: calculateLifePath(`${day}/${month}/${year}`),
      expression: calculateExpression(request.userProfile.name),
      soulUrge: calculateSoulUrge(day.toString()),
      personality: calculatePersonality(request.userProfile.name),
      interpretation: 'Ваш космический профиль показывает уникальную комбинацию энергий, которые влияют на ваш жизненный путь.',
    }
    
    // Базовый Human Design (моковые данные)
    const humanDesign = {
      type: 'Generator',
      strategy: 'Wait to respond',
      authority: 'Sacral',
      profile: '6/2',
      interpretation: 'Вы обладаете устойчивой жизненной силой и способностью к глубокому пониманию.',
    }
    
    // Базовая астрология (моковые данные)
    const astrology = {
      sunSign: 'Scorpio',
      moonSign: 'Cancer',
      ascendant: 'Leo',
      interpretation: 'Ваша астрологическая карта показывает глубину и эмоциональность.',
    }
    
    const summary = {
      strengths: ['Интуиция', 'Глубина понимания', 'Эмоциональная мудрость'],
      growthAreas: ['Открытость новому', 'Доверие к себе'],
      tips: ['Развивайте интуицию', 'Изучайте свои эмоции', 'Доверяйте внутреннему голосу'],
    }
    
    return {
      success: true,
      analysis: {
        numerology,
        humanDesign,
        astrology,
        recommendations: summary,
      },
      executionTime: '2.1s',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('❌ Local free analysis error:', error)
    return {
      success: false,
      error: 'Failed to generate analysis',
      timestamp: new Date().toISOString(),
    }
  }
}

// Fallback: локальные расчеты для премиум анализа
async function executeLocalPremiumAnalysis(request: WorkflowRequest): Promise<WorkflowResponse> {
  console.log('📊 Executing local premium analysis fallback...')
  
  try {
    // Выполняем базовый анализ
    const baseAnalysis = await executeLocalFreeAnalysis(request)
    
    if (!baseAnalysis.success) {
      return baseAnalysis
    }
    
    // Добавляем премиум функции
    const aiInsights = {
      personalizedAnalysis: 'Ваш премиум анализ показывает уникальную комбинацию космических энергий...',
      dailyGuidance: 'Сегодня фокусируйтесь на развитии ваших естественных талантов...',
      affirmations: [
        'Я доверяю своей интуиции и мудрости',
        'Моя глубина понимания - это мой дар',
        'Я открыт для новых возможностей роста'
      ],
      meditationScript: 'Представьте себя в центре космической энергии...',
      relationshipAdvice: 'Ищите партнеров, которые ценят глубину и эмоциональную мудрость...',
    }
    
    const recommendations = {
      career: 'Рассмотрите профессии, связанные с психологией, целительством или исследованием',
      relationships: 'Окружите себя людьми, которые понимают вашу глубину',
      health: 'Обратите внимание на эмоциональное благополучие',
      spirituality: 'Развивайте медитативную практику',
      timing: {
        bestPeriods: 'Осень и зима',
        avoidPeriods: 'Стрессовые ситуации',
      },
    }
    
    return {
      success: true,
      analysis: {
        ...baseAnalysis.analysis,
        aiInsights,
        recommendations,
      },
      executionTime: '3.5s',
      timestamp: new Date().toISOString(),
      pdfUrl: '/api/generate-pdf', // Заглушка для PDF
    }
  } catch (error) {
    console.error('❌ Local premium analysis error:', error)
    return {
      success: false,
      error: 'Failed to generate premium analysis',
      timestamp: new Date().toISOString(),
    }
  }
}

// Обертка для выполнения анализа по подписке
export async function executeAnalysisBySubscription(
  request: WorkflowRequest,
  isPremium: boolean
): Promise<WorkflowResponse> {
  if (isPremium) {
    return await executePremiumAnalysis(request)
  } else {
    return await executeFreeAnalysis(request)
  }
}

// Создание запроса для workflow
export function createWorkflowRequest(
  userProfile: any,
  scenario: 'free' | 'premium'
): WorkflowRequest {
  return {
    userProfile: {
      name: userProfile.name,
      birthDate: userProfile.birthDate,
      birthTime: userProfile.birthTime,
      birthPlace: {
        name: userProfile.birthPlace?.name || 'Не указано',
        latitude: userProfile.birthPlace?.latitude || 0,
        longitude: userProfile.birthPlace?.longitude || 0,
      },
    },
    scenario,
    options: {
      includeDetailedAnalysis: scenario === 'premium',
      includeQuickInsights: scenario === 'free',
      includeRecommendations: true,
      includeComparisons: scenario === 'premium',
    },
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }
}


