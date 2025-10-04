// components/AstrologyApiStatus.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Star, Info } from 'lucide-react'
import { checkAstrologyApiStatus, getAstrologyPlanInfo } from '@/lib/astrologyApi'

interface AstrologyApiStatusProps {
  language: 'en' | 'ru'
}

export function AstrologyApiStatus({ language }: AstrologyApiStatusProps) {
  const [status, setStatus] = useState<{
    isAvailable: boolean
    apiType: 'swiss-ephemeris' | 'mock' | 'none'
    error?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      // Проверяем статус API через новую функцию
      const apiStatus = checkAstrologyApiStatus()
      
      setStatus({
        isAvailable: apiStatus.available,
        apiType: apiStatus.available ? 'swiss-ephemeris' : 'mock'
      })
    } catch (error) {
      console.error('Error checking API status:', error)
      setStatus({
        isAvailable: false,
        apiType: 'none',
        error: 'Failed to check API status'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cosmic-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 border-2 border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="cosmic-subtitle text-lg">
            {language === 'ru' ? 'Проверка API...' : 'Checking API...'}
          </h3>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card"
    >
      <div className="flex items-center gap-3 mb-4">
        {status?.isAvailable ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
        <h3 className="cosmic-subtitle text-lg">
          {language === 'ru' ? 'Статус Астрологического API' : 'Astrology API Status'}
        </h3>
      </div>

      {/* Статус API */}
      <div className="mb-4">
        {status?.isAvailable ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">
              {language === 'ru' ? 'API доступен' : 'API Available'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">
              {language === 'ru' ? 'API недоступен' : 'API Unavailable'}
            </span>
            {status?.error && (
              <span className="text-xs text-cosmic-500 ml-2">
                ({status.error})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Информация о типе API */}
      <div className="bg-space-800/50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-cosmic-400" />
          <h4 className="text-cosmic-300 font-medium">
            {language === 'ru' ? 'Тип API' : 'API Type'}
          </h4>
        </div>
        
        {status?.apiType === 'swiss-ephemeris' && (
          <div className="text-green-400 font-semibold mb-1">
            ✅ Swiss Ephemeris API
          </div>
        )}
        
        {status?.apiType === 'mock' && (
          <div className="text-yellow-400 font-semibold mb-1">
            {language === 'ru' ? 'Моковые данные' : 'Mock Data'}
          </div>
        )}
        
        {status?.apiType === 'none' && (
          <div className="text-red-400 font-semibold mb-1">
            {language === 'ru' ? 'API недоступен' : 'API Unavailable'}
          </div>
        )}
        
        <div className="text-sm text-cosmic-500">
          {status?.apiType === 'swiss-ephemeris' && (
            language === 'ru' 
              ? '✅ Точные астрономические расчеты с использованием Swiss Ephemeris'
              : '✅ Accurate astronomical calculations using Swiss Ephemeris'
          )}
          
          {status?.apiType === 'mock' && (
            language === 'ru' 
              ? 'Демонстрационные данные для тестирования интерфейса'
              : 'Demo data for testing the interface'
          )}
          
          {status?.apiType === 'none' && (
            language === 'ru' 
              ? 'Нет доступа к астрологическим расчетам'
              : 'No access to astrological calculations'
          )}
        </div>
      </div>

      {/* Информация о Swiss Ephemeris */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
      >
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">
              {language === 'ru' ? 'Swiss Ephemeris' : 'Swiss Ephemeris'}
            </h4>
            <p className="text-sm text-cosmic-300 mb-2">
              {language === 'ru' 
                ? 'Swiss Ephemeris - это открытая библиотека для точного расчета астрономических данных:'
                : 'Swiss Ephemeris is an open library for accurate astronomical calculations:'
              }
            </p>
            <ul className="text-sm text-cosmic-400 space-y-1 ml-4">
              <li>• {language === 'ru' ? 'Позиции планет с высокой точностью' : 'High-precision planetary positions'}</li>
              <li>• {language === 'ru' ? 'Расчет домов и аспектов' : 'Houses and aspects calculation'}</li>
              <li>• {language === 'ru' ? 'Покрытие периода 13,201 г. до н.э. - 17,191 г. н.э.' : 'Coverage from 13,201 BCE to 17,191 CE'}</li>
              <li>• {language === 'ru' ? 'Основано на данных NASA JPL' : 'Based on NASA JPL data'}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Предупреждение о моковых данных */}
      {status?.apiType === 'mock' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">
                {language === 'ru' ? 'Внимание!' : 'Warning!'}
              </h4>
              <p className="text-sm text-cosmic-300">
                {language === 'ru' 
                  ? 'В данный момент используются демонстрационные данные. Для получения точных астрологических расчетов необходимо интегрировать Swiss Ephemeris API.'
                  : 'Currently using demo data. For accurate astrological calculations, Swiss Ephemeris API integration is required.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Кнопка обновления */}
      <div className="flex justify-end mt-4">
        <button
          onClick={checkStatus}
          className="cosmic-button bg-space-700 hover:bg-space-600 text-sm"
        >
          {language === 'ru' ? 'Обновить статус' : 'Refresh Status'}
        </button>
      </div>
    </motion.div>
  )
}
