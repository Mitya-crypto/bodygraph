'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { ArrowLeft, Bot } from 'lucide-react'
import { calculateNumerology } from '@/lib/numerology'
import { NumerologyDisplay } from './NumerologyDisplay'
import { HumanDesignDisplay } from './HumanDesignDisplay'
import { AstrologyDisplay } from './AstrologyDisplay'
import { SynastryDisplay } from './SynastryDisplay'
import { collectAllAssistantData, sendDataToAssistant } from '@/lib/assistantDataCollector'

interface ResultsScreenProps {
  selectedModule?: string
}

export function ResultsScreen({ selectedModule: propSelectedModule }: ResultsScreenProps = {}) {
  const { selectedModule: storeSelectedModule, userProfile, language } = useAppStore()
  const selectedModule = propSelectedModule || storeSelectedModule
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [assistantMessage, setAssistantMessage] = useState('')
  const position = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartTime = useRef<number>(0)
  
  console.log('ResultsScreen rendered with selectedModule:', selectedModule)
  console.log('🔍 ResultsScreen userProfile:', userProfile)
  console.log('🔍 ResultsScreen userProfile type:', typeof userProfile)
  console.log('🔍 ResultsScreen userProfile name:', userProfile?.name)
  console.log('🔍 ResultsScreen userProfile birthDate:', userProfile?.birthDate)

  const getModuleTitle = () => {
    switch (selectedModule) {
      case 'numerology':
        return language === 'ru' ? 'Нумерология' : 'Numerology'
      case 'human-design':
        return language === 'ru' ? 'Human Design' : 'Human Design'
      case 'astrology':
        return language === 'ru' ? 'Астрология' : 'Astrology'
      case 'synastry':
        return language === 'ru' ? 'Синастрия' : 'Synastry'
      default:
        return language === 'ru' ? 'Анализ' : 'Analysis'
    }
  }

  const getModuleDescription = () => {
    switch (selectedModule) {
      case 'numerology':
        return language === 'ru' 
          ? 'Ваши числа судьбы и жизненного пути' 
          : 'Your destiny and life path numbers'
      case 'human-design':
        return language === 'ru' 
          ? 'Ваш энергетический тип и стратегия' 
          : 'Your energy type and strategy'
      case 'astrology':
        return language === 'ru' 
          ? 'Ваша натальная карта, планеты и транзиты' 
          : 'Your natal chart, planets and transits'
      case 'synastry':
        return language === 'ru' 
          ? 'Анализ совместимости по натальным картам' 
          : 'Compatibility analysis through natal charts'
      default:
        return language === 'ru' ? 'Результаты анализа' : 'Analysis results'
    }
  }

  // Функция для отправки данных ассистенту
  const handleAssistantClick = async () => {
    if (!userProfile) {
      alert(language === 'ru' ? 'Профиль не найден.' : 'Profile not found.')
      return
    }
    
    setIsAssistantLoading(true)
    setAssistantMessage('')
    
    try {
      console.log('🤖 Collecting all data for assistant...')
      
      // Собираем все данные
      const allData = await collectAllAssistantData(userProfile as any)
      
      console.log('📤 Sending data to assistant...')
      
      // Отправляем данные ассистенту
      const result = await sendDataToAssistant(allData)
      
      setAssistantMessage(
        language === 'ru' 
          ? '✅ Все данные отправлены ассистенту! Ожидайте ответа.' 
          : '✅ All data sent to assistant! Please wait for response.'
      )
      
      // Отправляем данные в Telegram WebApp
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        // Отправляем краткую сводку в Telegram (из-за ограничений размера)
        const summary = {
          type: 'assistant_request',
          user: {
            name: allData.user.profile.name,
            birthDate: allData.user.profile.birthDate
          },
          modules: ['numerology', 'humanDesign', 'astrology'],
          sessionId: allData.sessionId,
          timestamp: allData.timestamp,
          status: 'sent_to_assistant'
        }
        
        const message = JSON.stringify(summary)
        console.log('📤 Sending summary to Telegram:', message.length, 'bytes')
        ;(window as any).Telegram.WebApp.sendData(message)
      }
      
    } catch (error) {
      console.error('❌ Error sending data to assistant:', error)
      setAssistantMessage(
        language === 'ru' 
          ? '❌ Ошибка отправки данных ассистенту.' 
          : '❌ Error sending data to assistant.'
      )
    } finally {
      setIsAssistantLoading(false)
    }
  }

  // Обработчики для перетаскивания
  const handlePointerDown = () => {
    dragStartTime.current = Date.now()
    setIsDragging(false)
  }

  const handlePointerUp = () => {
    const holdTime = Date.now() - dragStartTime.current
    
    if (holdTime < 1000) {
      // Короткое нажатие - отправляем данные
      handleAssistantClick()
    }
    // Долгое нажатие уже обрабатывается через onDragStart
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: any, info: any) => {
    position.current = { x: info.point.x - 40, y: info.point.y - 40 }
    
    // Сохраняем позицию в localStorage
    localStorage.setItem('assistant-button-position', JSON.stringify(position.current))
    setIsDragging(false)
  }

  // Загружаем сохраненную позицию кнопки
  useEffect(() => {
    const savedPosition = localStorage.getItem('assistant-button-position')
    if (savedPosition) {
      position.current = JSON.parse(savedPosition)
    }
  }, [])

  const handleAssistantSend = async () => {
    if (!userProfile) {
      alert(language === 'ru' ? 'Профиль не найден.' : 'Profile not found.')
      return
    }
    
    setIsAssistantLoading(true)
    setAssistantMessage('')
    
    try {
      console.log('🤖 Collecting all data for assistant...')
      
      // Собираем все данные
      const allData = await collectAllAssistantData(userProfile as any)
      
      console.log('📤 Sending data to assistant...')
      
      // Отправляем данные ассистенту
      const result = await sendDataToAssistant(allData)
      
      setAssistantMessage(
        language === 'ru' 
          ? '✅ Все данные отправлены ассистенту! Ожидайте ответа.' 
          : '✅ All data sent to assistant! Please wait for response.'
      )
      
      // Отправляем данные в Telegram WebApp
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        // Отправляем краткую сводку в Telegram (из-за ограничений размера)
        const summary = {
          type: 'assistant_request',
          user: {
            name: allData.user.profile.name,
            birthDate: allData.user.profile.birthDate
          },
          modules: ['numerology', 'humanDesign', 'astrology'],
          sessionId: allData.sessionId,
          timestamp: allData.timestamp,
          status: 'sent_to_assistant'
        }
        
        const message = JSON.stringify(summary)
        console.log('📤 Sending summary to Telegram:', message.length, 'bytes')
        ;(window as any).Telegram.WebApp.sendData(message)
      }
      
    } catch (error) {
      console.error('❌ Error sending data to assistant:', error)
      setAssistantMessage(
        language === 'ru' 
          ? '❌ Ошибка отправки данных ассистенту.' 
          : '❌ Error sending data to assistant.'
      )
    } finally {
      setIsAssistantLoading(false)
    }
  }

  // Long-press logic for draggable toggle
  const [isDraggable, setIsDraggable] = React.useState(false)
  const pressTimerRef = React.useRef<number | null>(null)
  const didDragRef = React.useRef(false)

  const onPointerDownAssist = () => {
    didDragRef.current = false
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = window.setTimeout(() => {
      setIsDraggable(true)
    }, 1000)
  }

  const onPointerUpAssist = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
    // If not entered drag mode and not dragged -> treat as click
    if (!isDraggable && !didDragRef.current) {
      handleAssistantSend()
    }
    // If was in drag mode, disable it after release
    if (isDraggable) setIsDraggable(false)
  }

  const onDragStartAssist = () => {
    didDragRef.current = true
  }

  const onPointerCancelAssist = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
    if (isDraggable) setIsDraggable(false)
  }

  // Persist floating button position
  const [assistPos, setAssistPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('assistantButtonPos') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          setAssistPos({ x: parsed.x, y: parsed.y })
        }
      }
    } catch {}
  }, [])

  const onDragEndAssist = (_: any, info: { offset: { x: number; y: number } }) => {
    const newX = assistPos.x + (info?.offset?.x || 0)
    const newY = assistPos.y + (info?.offset?.y || 0)
    const next = { x: newX, y: newY }
    setAssistPos(next)
    try {
      localStorage.setItem('assistantButtonPos', JSON.stringify(next))
    } catch {}
  }

  return (
    <>
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="cosmic-title text-3xl mb-4">
            {getModuleTitle()}
          </h1>
          <p className="cosmic-text">
            {getModuleDescription()}
          </p>
        </motion.div>

        {/* Results Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {selectedModule === 'numerology' && userProfile && (
            <NumerologyDisplay userProfile={userProfile} language={language} />
          )}
          
          {selectedModule === 'human-design' && userProfile && (
            <HumanDesignDisplay userProfile={userProfile} language={language} />
          )}
          
          {selectedModule === 'astrology' && userProfile && (
            <AstrologyDisplay userProfile={userProfile} language={language} />
          )}
          
          {selectedModule === 'synastry' && (
            <SynastryDisplay />
          )}
        </motion.div>

        {/* Assistant Message */}
        {assistantMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-green-400" />
              <p className="text-green-300 font-medium">{assistantMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/modules"
            className="cosmic-button bg-space-700 hover:bg-space-600 flex items-center justify-center gap-2 text-center"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ru' ? 'Выбрать другой модуль' : 'Choose Another Module'}
          </a>
        </div>
      </div>
      {/* Floating Draggable Assistant Button */}
      <motion.button
        onPointerDown={onPointerDownAssist}
        onPointerUp={onPointerUpAssist}
        onPointerCancel={onPointerCancelAssist}
        onDragStart={onDragStartAssist}
        onDragEnd={onDragEndAssist}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 h-16 w-16 sm:w-auto sm:px-6 rounded-full shadow-2xl transition-colors text-sm sm:text-base whitespace-nowrap pointer-events-auto ${
          isAssistantLoading 
            ? 'bg-yellow-500 hover:bg-yellow-600 cursor-wait' 
            : isDraggable 
              ? 'bg-green-500 hover:bg-green-600 cursor-move' 
              : 'bg-green-500 hover:bg-green-600 cursor-pointer'
        }`}
        aria-label={language === 'ru' ? 'Ассистент' : 'Assistant'}
        title={language === 'ru' ? 'Ассистент' : 'Assistant'}
        drag={isDraggable}
        dragMomentum={false}
        whileTap={{ scale: 0.95 }}
        style={{ x: assistPos.x, y: assistPos.y }}
      >
        {isAssistantLoading ? (
          <>
            <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold hidden sm:inline">
              {language === 'ru' ? 'Отправка...' : 'Sending...'}
            </span>
          </>
        ) : (
          <>
            <Bot className="w-7 h-7 shrink-0" />
            <span className="font-semibold hidden sm:inline">{language === 'ru' ? 'Ассистент' : 'Assistant'}</span>
          </>
        )}
      </motion.button>
    </div>
    
    
    </>
  )
}