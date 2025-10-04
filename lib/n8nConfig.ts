// lib/n8nConfig.ts
export const N8N_CONFIG = {
  baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  apiToken: process.env.N8N_API_TOKEN || '',
  timeout: 30000, // 30 seconds
  retries: 3,
}

export const N8N_ENDPOINTS = {
  workflows: '/api/v1/workflows',
  executions: '/api/v1/executions',
  webhooks: '/api/v1/webhooks',
  users: '/api/v1/users',
  me: '/api/v1/me',
}

export const N8N_WORKFLOW_IDS = {
  // Основные сценарии анализа
  scenario1: 'scenario-1-workflow-id',
  scenario2: 'scenario-2-workflow-id',
  
  // ChatGPT workflow'ы
  chatgptBasic: 'chatgpt-basic-workflow',
  chatgptPremium: 'chatgpt-premium-workflow',
}

export const N8N_MESSAGES = {
  success: 'n8n workflow executed successfully',
  error: 'Failed to execute n8n workflow',
  noToken: 'n8n API token not configured',
  connectionError: 'Cannot connect to n8n instance',
}
