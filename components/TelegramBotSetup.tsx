// components/TelegramBotSetup.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Settings } from 'lucide-react'

interface BotInfo {
  id: number
  is_bot: boolean
  first_name: string
  username: string
  can_join_groups: boolean
  can_read_all_group_messages: boolean
  supports_inline_queries: boolean
}

interface WebhookInfo {
  url: string
  has_custom_certificate: boolean
  pending_update_count: number
  last_error_date?: number
  last_error_message?: string
  max_connections?: number
  allowed_updates: string[]
}

interface TelegramSetupResponse {
  success: boolean
  message: string
  botInfo: BotInfo
  webhook: any
  commands: any
  webhookUrl: string
  botUrl: string
}

export function TelegramBotSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null)
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null)
  const [setupResult, setSetupResult] = useState<TelegramSetupResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')

  // Проверяем статус бота при загрузке
  useEffect(() => {
    checkBotStatus()
  }, [])

  const checkBotStatus = async () => {
    try {
      const response = await fetch('/api/telegram/setup')
      const data = await response.json()
      
      if (response.ok) {
        setBotInfo(data.botInfo)
        setWebhookInfo(data.webhookInfo)
        setError(null)
      } else {
        setError(data.error || 'Failed to get bot info')
      }
    } catch (error) {
      console.error('Error checking bot status:', error)
      setError('Failed to connect to Telegram API')
    }
  }

  const setupBot = async () => {
    if (!token.trim()) {
      setError('Please enter your bot token')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Сначала устанавливаем токен в конфигурации (это временное решение)
      // В продакшене токен должен быть в переменных окружения
      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()
      
      if (response.ok) {
        setSetupResult(data)
        setBotInfo(data.botInfo)
        setError(null)
      } else {
        setError(data.error || 'Failed to setup bot')
      }
    } catch (error) {
      console.error('Error setting up bot:', error)
      setError('Failed to setup Telegram bot')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Можно добавить уведомление об успешном копировании
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="cosmic-card">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-8 h-8 text-cosmic-400" />
          <h2 className="cosmic-title text-2xl">Telegram Bot Setup</h2>
        </div>

        {/* Инструкции */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Инструкции по настройке
          </h3>
          <ol className="text-sm text-cosmic-300 space-y-1 ml-4">
            <li>1. Создайте нового бота через @BotFather в Telegram</li>
            <li>2. Получите токен бота (формат: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)</li>
            <li>3. Введите токен ниже и нажмите "Настроить бота"</li>
            <li>4. Бот автоматически настроит webhook и команды</li>
          </ol>
        </div>

        {/* Ввод токена */}
        <div className="mb-6">
          <label className="block text-cosmic-300 font-medium mb-2">
            Bot Token
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Введите токен бота..."
              className="flex-1 cosmic-input"
            />
            <button
              onClick={setupBot}
              disabled={isLoading || !token.trim()}
              className="cosmic-button bg-cosmic-600 hover:bg-cosmic-700 disabled:opacity-50"
            >
              {isLoading ? 'Настройка...' : 'Настроить бота'}
            </button>
          </div>
        </div>

        {/* Статус ошибки */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Ошибка</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Информация о боте */}
        {botInfo && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Бот настроен</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cosmic-400">Имя:</span>
                <span className="text-cosmic-300">{botInfo.first_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cosmic-400">Username:</span>
                <span className="text-cosmic-300">@{botInfo.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cosmic-400">ID:</span>
                <span className="text-cosmic-300">{botInfo.id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Webhook информация */}
        {webhookInfo && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Webhook</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cosmic-400">URL:</span>
                <span className="text-cosmic-300 font-mono text-xs">
                  {webhookInfo.url || 'Не настроен'}
                </span>
                {webhookInfo.url && (
                  <button
                    onClick={() => copyToClipboard(webhookInfo.url)}
                    className="text-cosmic-500 hover:text-cosmic-400"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cosmic-400">Ожидающие обновления:</span>
                <span className="text-cosmic-300">{webhookInfo.pending_update_count}</span>
              </div>
              {webhookInfo.last_error_message && (
                <div className="flex items-center gap-2">
                  <span className="text-cosmic-400">Последняя ошибка:</span>
                  <span className="text-red-400 text-xs">{webhookInfo.last_error_message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Результат настройки */}
        {setupResult && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Настройка завершена</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-green-300 text-sm mb-2">
                  Ваш бот готов к работе! Ссылка на бота:
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={setupResult.botUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cosmic-button bg-green-600 hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Открыть бота в Telegram
                  </a>
                  <button
                    onClick={() => copyToClipboard(setupResult.botUrl)}
                    className="text-cosmic-500 hover:text-cosmic-400"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка обновления */}
        <div className="flex justify-end">
          <button
            onClick={checkBotStatus}
            className="cosmic-button bg-space-700 hover:bg-space-600"
          >
            Обновить статус
          </button>
        </div>
      </div>
    </motion.div>
  )
}



