// lib/n8nApi.ts
import { N8N_CONFIG, N8N_ENDPOINTS, N8N_MESSAGES } from './n8nConfig'

export interface N8NWorkflow {
  id: string
  name: string
  active: boolean
  nodes: any[]
  connections: any
  settings?: any
  staticData?: any
  meta?: any
  pinData?: any
  versionId?: string
  tags?: string[]
  triggerCount?: number
  updatedAt: string
  createdAt: string
}

export interface N8NExecution {
  id: string
  finished: boolean
  mode: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  workflowData: N8NWorkflow
  data: any
  status: 'running' | 'success' | 'error' | 'waiting'
  resultData?: any
}

export interface N8NUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isOwner: boolean
  isPending: boolean
  apiKey?: string
  personalizationAnswers?: any
  globalRole: {
    id: string
    name: string
    scope: string
  }
}

export interface N8NApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// Проверка подключения к n8n
export async function checkN8NConnection(): Promise<boolean> {
  try {
    if (!N8N_CONFIG.apiToken) {
      console.log('❌ n8n API token not configured')
      return false
    }

    const response = await fetch(`${N8N_CONFIG.baseUrl}${N8N_ENDPOINTS.me}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(N8N_CONFIG.timeout),
    })

    if (response.ok) {
      console.log('✅ n8n connection successful')
      return true
    } else {
      console.log(`❌ n8n connection failed: ${response.status} ${response.statusText}`)
      return false
    }
  } catch (error) {
    console.error('❌ n8n connection error:', error)
    return false
  }
}

// Получение информации о пользователе
export async function getN8NUserInfo(): Promise<N8NUser | null> {
  try {
    const response = await fetch(`${N8N_CONFIG.baseUrl}${N8N_ENDPOINTS.me}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(N8N_CONFIG.timeout),
    })

    if (response.ok) {
      const user = await response.json()
      console.log('✅ n8n user info retrieved')
      return user
    } else {
      console.log(`❌ Failed to get n8n user info: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error('❌ n8n user info error:', error)
    return null
  }
}

// Получение списка workflow'ов
export async function getN8NWorkflows(): Promise<N8NWorkflow[]> {
  try {
    const response = await fetch(`${N8N_CONFIG.baseUrl}${N8N_ENDPOINTS.workflows}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(N8N_CONFIG.timeout),
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Retrieved ${data.data?.length || 0} n8n workflows`)
      return data.data || []
    } else {
      console.log(`❌ Failed to get n8n workflows: ${response.status}`)
      return []
    }
  } catch (error) {
    console.error('❌ n8n workflows error:', error)
    return []
  }
}

// Выполнение workflow по ID
export async function executeN8NWorkflow(
  workflowId: string, 
  inputData?: any
): Promise<N8NExecution | null> {
  try {
    const response = await fetch(`${N8N_CONFIG.baseUrl}${N8N_ENDPOINTS.executions}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowId,
        data: inputData,
      }),
      signal: AbortSignal.timeout(N8N_CONFIG.timeout),
    })

    if (response.ok) {
      const execution = await response.json()
      console.log(`✅ n8n workflow ${workflowId} executed successfully`)
      return execution.data
    } else {
      console.log(`❌ Failed to execute n8n workflow ${workflowId}: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`❌ n8n workflow ${workflowId} execution error:`, error)
    return null
  }
}

// Получение результата выполнения
export async function getN8NExecutionResult(executionId: string): Promise<N8NExecution | null> {
  try {
    const response = await fetch(`${N8N_CONFIG.baseUrl}${N8N_ENDPOINTS.executions}/${executionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(N8N_CONFIG.timeout),
    })

    if (response.ok) {
      const execution = await response.json()
      console.log(`✅ Retrieved n8n execution ${executionId}`)
      return execution.data
    } else {
      console.log(`❌ Failed to get n8n execution ${executionId}: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`❌ n8n execution ${executionId} error:`, error)
    return null
  }
}

// Создание webhook URL для workflow
export function createN8NWebhookUrl(workflowId: string, webhookId?: string): string {
  const webhookPath = webhookId ? `/webhook/${webhookId}` : `/webhook-test/${workflowId}`
  return `${N8N_CONFIG.baseUrl}${webhookPath}`
}

// Проверка статуса n8n API
export async function checkN8NApiStatus(): Promise<{
  connected: boolean
  user?: N8NUser
  workflowsCount: number
  error?: string
}> {
  try {
    const connected = await checkN8NConnection()
    if (!connected) {
      return {
        connected: false,
        workflowsCount: 0,
        error: N8N_MESSAGES.connectionError,
      }
    }

    const user = await getN8NUserInfo()
    const workflows = await getN8NWorkflows()

    return {
      connected: true,
      user: user || undefined,
      workflowsCount: workflows.length,
    }
  } catch (error) {
    return {
      connected: false,
      workflowsCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Получение информации о плане n8n
export function getN8NPlanInfo(): {
  name: string
  features: string[]
  limitations: string[]
} {
  return {
    name: 'Self-hosted n8n',
    features: [
      'Unlimited workflows',
      'Unlimited executions',
      'Custom integrations',
      'API access',
      'Webhook support',
    ],
    limitations: [
      'Requires self-hosting',
      'Manual setup required',
    ],
  }
}



