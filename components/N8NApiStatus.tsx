'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { checkN8NApiStatus, getN8NPlanInfo } from '@/lib/n8nApi'

export default function N8NApiStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    user?: any
    workflowsCount: number
    error?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true)
      try {
        const apiStatus = await checkN8NApiStatus()
        setStatus(apiStatus)
      } catch (error) {
        console.error('Error fetching n8n status:', error)
        setStatus({
          connected: false,
          workflowsCount: 0,
          error: 'Failed to check n8n status',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [])

  const planInfo = getN8NPlanInfo()

  if (isLoading) {
    return (
      <div className="cosmic-card p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-cosmic-400">Проверка подключения к n8n...</span>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="cosmic-card p-4">
        <div className="text-red-400">
          ❌ Не удалось получить статус n8n
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-cosmic-100">
          🔗 n8n Integration
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          status.connected 
            ? 'bg-green-900/50 text-green-400 border border-green-700' 
            : 'bg-red-900/50 text-red-400 border border-red-700'
        }`}>
          {status.connected ? '✅ Подключено' : '❌ Отключено'}
        </div>
      </div>

      {status.connected ? (
        <div className="space-y-3">
          {status.user && (
            <div className="bg-space-800/50 p-3 rounded-lg">
              <div className="text-sm text-cosmic-300">Пользователь:</div>
              <div className="font-medium text-cosmic-100">
                {status.user.firstName} {status.user.lastName}
              </div>
              <div className="text-sm text-cosmic-400">{status.user.email}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-space-800/50 p-3 rounded-lg">
              <div className="text-sm text-cosmic-300">Workflow'ов:</div>
              <div className="text-2xl font-bold text-cosmic-100">
                {status.workflowsCount}
              </div>
            </div>
            <div className="bg-space-800/50 p-3 rounded-lg">
              <div className="text-sm text-cosmic-300">Статус:</div>
              <div className="text-lg font-medium text-green-400">
                Активен
              </div>
            </div>
          </div>

          <div className="bg-space-800/50 p-3 rounded-lg">
            <div className="text-sm text-cosmic-300 mb-2">Возможности:</div>
            <ul className="text-sm text-cosmic-400 space-y-1">
              {planInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-red-900/20 border border-red-700 p-4 rounded-lg">
            <div className="text-red-400 font-medium mb-2">
              ❌ Подключение к n8n не установлено
            </div>
            {status.error && (
              <div className="text-red-300 text-sm">
                {status.error}
              </div>
            )}
          </div>

          <div className="bg-space-800/50 p-4 rounded-lg">
            <div className="text-cosmic-300 text-sm mb-3">
              Для настройки n8n:
            </div>
            <ol className="text-sm text-cosmic-400 space-y-2">
              <li>1. Убедитесь, что n8n запущен на порту 5678</li>
              <li>2. Создайте API токен в настройках n8n</li>
              <li>3. Добавьте токен в переменные окружения</li>
              <li>4. Перезапустите приложение</li>
            </ol>
          </div>
        </div>
      )}
    </motion.div>
  )
}



