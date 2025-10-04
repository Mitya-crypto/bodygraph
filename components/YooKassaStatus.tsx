// components/YooKassaStatus.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, AlertCircle, Settings, Loader2 } from 'lucide-react'

interface YooKassaConfig {
  configured: boolean
  shopId: string
  hasSecretKey: boolean
  testMode: boolean
}

export default function YooKassaStatus() {
  const [config, setConfig] = useState<YooKassaConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkYooKassaStatus = async () => {
      try {
        const response = await fetch('/api/yookassa/status')
        const data = await response.json()
        
        if (data.success) {
          setConfig(data.config)
        } else {
          console.error('Failed to check YooKassa status:', data.error)
        }
      } catch (error) {
        console.error('Error checking YooKassa status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkYooKassaStatus()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 text-cosmic-400 animate-spin" />
    }
    
    if (config?.configured) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    return <AlertCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusColor = () => {
    if (isLoading) return 'border-cosmic-500/30'
    if (config?.configured) return 'border-green-500/30'
    return 'border-red-500/30'
  }

  const getStatusText = () => {
    if (isLoading) return 'Проверка конфигурации...'
    if (config?.configured) return 'YooKassa настроен'
    return 'YooKassa не настроен'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cosmic-card p-6 border ${getStatusColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cosmic-600/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-cosmic-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cosmic-100">
              YooKassa Платежи
            </h3>
            <p className="text-sm text-cosmic-400">
              Система обработки платежей
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-cosmic-200">
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Configuration Details */}
      {config && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cosmic-900/50 rounded-lg p-3">
              <div className="text-xs text-cosmic-400 mb-1">Shop ID</div>
              <div className="text-sm text-cosmic-200 font-mono">
                {config.shopId ? `${config.shopId.substring(0, 8)}...` : 'Не настроен'}
              </div>
            </div>
            
            <div className="bg-cosmic-900/50 rounded-lg p-3">
              <div className="text-xs text-cosmic-400 mb-1">Secret Key</div>
              <div className="text-sm text-cosmic-200">
                {config.hasSecretKey ? '✓ Настроен' : '✗ Не настроен'}
              </div>
            </div>
          </div>

          <div className="bg-cosmic-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-cosmic-400 mb-1">Режим</div>
                <div className="text-sm text-cosmic-200">
                  {config.testMode ? 'Тестовый' : 'Продакшен'}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                config.testMode 
                  ? 'bg-yellow-900/30 text-yellow-300' 
                  : 'bg-green-900/30 text-green-300'
              }`}>
                {config.testMode ? 'TEST' : 'LIVE'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-cosmic-800">
        {!config?.configured ? (
          <div className="space-y-3">
            <div className="flex items-start space-x-2 text-sm text-cosmic-300">
              <Settings className="w-4 h-4 text-cosmic-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-cosmic-200 mb-1">
                  Настройка YooKassa
                </p>
                <p className="text-cosmic-400">
                  Для активации платежей необходимо настроить переменные окружения:
                </p>
                <ul className="mt-2 space-y-1 text-cosmic-400">
                  <li>• YOOKASSA_SHOP_ID</li>
                  <li>• YOOKASSA_SECRET_KEY</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-cosmic-900/30 rounded-lg p-3">
              <p className="text-xs text-cosmic-400 mb-2">
                Подробные инструкции:
              </p>
              <a 
                href="/YOOKASSA_SETUP.md" 
                target="_blank"
                className="text-sm text-cosmic-400 hover:text-cosmic-300 underline"
              >
                📖 Открыть руководство по настройке
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>Платежи готовы к работе</span>
            </div>
            
            {config.testMode && (
              <div className="text-xs text-yellow-300 bg-yellow-900/20 rounded p-2">
                ⚠️ Включен тестовый режим. Для продакшена измените NODE_ENV на production
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}



