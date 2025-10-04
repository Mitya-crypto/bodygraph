#!/usr/bin/env node

/**
 * Скрипт для автоматической настройки n8n workflow'ов
 * Использование: node scripts/setup-n8n-workflows.js
 */

const fs = require('fs')
const path = require('path')

// Конфигурация n8n
const N8N_CONFIG = {
  baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  apiToken: process.env.N8N_API_TOKEN || '',
}

// ChatGPT Basic Workflow
const chatgptBasicWorkflow = {
  name: 'ChatGPT Basic',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'chatgpt-basic',
        responseMode: 'responseNode',
        options: {}
      },
      id: 'webhook-trigger',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [240, 300],
      webhookId: 'chatgpt-basic-webhook'
    },
    {
      parameters: {
        model: 'gpt-3.5-turbo',
        options: {
          maxTokens: 300,
          temperature: 0.7,
          systemMessage: 'Ты базовый AI ассистент в приложении BodyGraph. Помогаешь пользователям с простыми вопросами о нумерологии, Human Design и астрологии.\n\nОтвечай кратко (до 3-4 абзацев), давай только базовые интерпретации. Фокусируйся на основных числах и характеристиках.\n\nОтвечай на русском языке, будь дружелюбным и кратким.'
        },
        messages: {
          values: [
            {
              role: 'system',
              content: '={{ $json.systemMessage }}'
            },
            {
              role: 'user', 
              content: '={{ $json.message }}'
            }
          ]
        }
      },
      id: 'openai-node',
      name: 'OpenAI GPT-3.5',
      type: 'n8n-nodes-base.openAi',
      typeVersion: 1,
      position: [460, 300]
    },
    {
      parameters: {
        options: {},
        respondWith: 'json',
        responseBody: '={{ { "success": true, "response": $json.choices[0].message.content, "model": "gpt-3.5-turbo", "timestamp": $now } }}'
      },
      id: 'response-node',
      name: 'Respond to Webhook',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1,
      position: [680, 300]
    }
  ],
  connections: {
    'Webhook': {
      main: [
        [
          {
            node: 'OpenAI GPT-3.5',
            type: 'main',
            index: 0
          }
        ]
      ]
    },
    'OpenAI GPT-3.5': {
      main: [
        [
          {
            node: 'Respond to Webhook',
            type: 'main',
            index: 0
          }
        ]
      ]
    }
  },
  active: true,
  settings: {},
  staticData: null,
  tags: ['chatgpt', 'basic', 'bodygraph']
}

// ChatGPT Premium Workflow
const chatgptPremiumWorkflow = {
  name: 'ChatGPT Premium',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'chatgpt-premium',
        responseMode: 'responseNode',
        options: {}
      },
      id: 'webhook-trigger-premium',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [240, 300],
      webhookId: 'chatgpt-premium-webhook'
    },
    {
      parameters: {
        model: 'gpt-4',
        options: {
          maxTokens: 800,
          temperature: 0.7,
          systemMessage: 'Ты профессиональный космический консультант и духовный наставник, специализирующийся на нумерологии, Human Design и астрологии. Ты работаешь в приложении BodyGraph.\n\nТВОЯ ЭКСПЕРТИЗА:\n- Нумерология: Life Path, Expression, Soul Urge, Personality числа, мастер-числа\n- Human Design: типы, стратегии, авторитеты, каналы, ворота, центры\n- Астрология: натальные карты, планеты в знаках, аспекты, транзиты\n\nСТИЛЬ ОБЩЕНИЯ:\n- Мудрый, но доступный\n- Вдохновляющий и поддерживающий\n- Персонализированный под профиль пользователя\n- Сбалансированный: духовная мудрость + практическое применение\n\nСТРУКТУРА ОТВЕТА (ПРЕМИУМ):\n1. Краткий обзор (2-3 предложения)\n2. Ключевые сильные стороны (4-5 пунктов)\n3. Области роста (3-4 пункта)\n4. Практические рекомендации (5-6 советов)\n5. Персональная медитация или аффирмация\n\nОтвечай на русском языке, будь вдохновляющим и практичным.'
        },
        messages: {
          values: [
            {
              role: 'system',
              content: '={{ $json.systemMessage }}'
            },
            {
              role: 'user',
              content: '={{ $json.message }}'
            }
          ]
        }
      },
      id: 'openai-node-premium',
      name: 'OpenAI GPT-4',
      type: 'n8n-nodes-base.openAi',
      typeVersion: 1,
      position: [460, 300]
    },
    {
      parameters: {
        options: {},
        respondWith: 'json',
        responseBody: '={{ { "success": true, "response": $json.choices[0].message.content, "model": "gpt-4", "timestamp": $now, "isPremium": true } }}'
      },
      id: 'response-node-premium',
      name: 'Respond to Webhook',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1,
      position: [680, 300]
    }
  ],
  connections: {
    'Webhook': {
      main: [
        [
          {
            node: 'OpenAI GPT-4',
            type: 'main',
            index: 0
          }
        ]
      ]
    },
    'OpenAI GPT-4': {
      main: [
        [
          {
            node: 'Respond to Webhook',
            type: 'main',
            index: 0
          }
        ]
      ]
    }
  },
  active: true,
  settings: {},
  staticData: null,
  tags: ['chatgpt', 'premium', 'bodygraph']
}

// Функция для создания workflow через API
async function createWorkflow(workflowData) {
  try {
    const response = await fetch(`${N8N_CONFIG.baseUrl}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${N8N_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Workflow "${workflowData.name}" создан успешно!`)
      console.log(`   ID: ${result.id}`)
      console.log(`   Webhook URL: ${N8N_CONFIG.baseUrl}/webhook/${workflowData.nodes[0].parameters.path}`)
      return result.id
    } else {
      const error = await response.text()
      console.error(`❌ Ошибка создания workflow "${workflowData.name}":`, error)
      return null
    }
  } catch (error) {
    console.error(`❌ Ошибка подключения к n8n:`, error.message)
    return null
  }
}

// Основная функция
async function setupWorkflows() {
  console.log('🚀 Настройка n8n workflow\'ов для BodyGraph...\n')

  // Проверяем конфигурацию
  if (!N8N_CONFIG.apiToken) {
    console.error('❌ N8N_API_TOKEN не найден в переменных окружения')
    console.log('   Добавьте N8N_API_TOKEN в .env.local')
    process.exit(1)
  }

  console.log(`🔗 Подключение к n8n: ${N8N_CONFIG.baseUrl}`)

  // Создаем workflow'ы
  const basicId = await createWorkflow(chatgptBasicWorkflow)
  console.log('')
  
  const premiumId = await createWorkflow(chatgptPremiumWorkflow)
  console.log('')

  // Генерируем обновленную конфигурацию
  if (basicId && premiumId) {
    const configUpdate = `
// Обновите lib/n8nConfig.ts с этими ID:
export const N8N_WORKFLOW_IDS = {
  // Основные сценарии анализа
  scenario1: 'scenario-1-workflow-id',
  scenario2: 'scenario-2-workflow-id',
  
  // ChatGPT workflow'ы
  chatgptBasic: '${basicId}',
  chatgptPremium: '${premiumId}',
}
`

    console.log('📋 Обновите конфигурацию:')
    console.log(configUpdate)

    // Сохраняем в файл
    fs.writeFileSync('n8n-workflow-ids.txt', configUpdate)
    console.log('💾 Конфигурация сохранена в n8n-workflow-ids.txt')
  }

  console.log('\n🎉 Настройка завершена!')
  console.log('📝 Следующие шаги:')
  console.log('   1. Обновите lib/n8nConfig.ts с новыми ID')
  console.log('   2. Перезапустите приложение')
  console.log('   3. Протестируйте ChatGPT ассистента')
}

// Запуск скрипта
if (require.main === module) {
  setupWorkflows().catch(console.error)
}

module.exports = { setupWorkflows, chatgptBasicWorkflow, chatgptPremiumWorkflow }



