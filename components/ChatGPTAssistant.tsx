'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hasFeatureAccess, getUserFeatureAccess } from '@/lib/subscriptionManager'
import { useAppStore } from '@/store/appStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPremium?: boolean
}

interface ChatGPTAssistantProps {
  userId: string
  userProfile?: any
  onClose: () => void
}

export default function ChatGPTAssistant({ userId, userProfile: propUserProfile, onClose }: ChatGPTAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userProfile: storeUserProfile } = useAppStore()
  const userProfile = propUserProfile || storeUserProfile

  useEffect(() => {
    // Проверяем статус подписки
    if (userProfile) {
      const featureAccess = getUserFeatureAccess(userProfile.id)
      setIsPremium(featureAccess.aiAssistant.advanced)
    }
    
    // Добавляем приветственное сообщение
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: isPremium 
        ? `🌟 Добро пожаловать! Я ваш персональный AI ассистент ChatGPT-5. Готов помочь вам раскрыть тайны вашего космического профиля. Что вас интересует?`
        : `👋 Привет! Я ваш базовый AI ассистент. Могу ответить на простые вопросы о вашем космическом профиле. Для расширенных возможностей обновите план.`,
      timestamp: new Date(),
      isPremium
    }
    
    setMessages([welcomeMessage])
  }, [userId, isPremium])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Подготавливаем контекст для AI
      const context = prepareContext(userMessage.content)
      
      // Вызываем API для ChatGPT через n8n
      const response = await fetch('/api/chatgpt/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context,
          isPremium,
          userProfile: userProfile,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date(),
        isPremium
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз.',
        timestamp: new Date(),
        isPremium
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const prepareContext = (message: string): any => {
    const context: any = {
      userProfile: userProfile,
      message,
      isPremium,
      timestamp: new Date().toISOString(),
    }

    // Добавляем космические данные если есть профиль
    if (userProfile) {
      const profile = userProfile
      context.cosmicData = {
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        birthPlace: profile.birthPlace,
        name: profile.name,
        // Здесь можно добавить рассчитанные данные нумерологии, HD, астрологии
      }
    }

    return context
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-space-900 border border-cosmic-700 rounded-xl w-full max-w-2xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cosmic-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cosmic-100">
                {isPremium ? 'ChatGPT-5 Ассистент' : 'AI Ассистент'}
              </h3>
              <p className="text-sm text-cosmic-400">
                {isPremium ? 'Премиум версия' : 'Бесплатная версия'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cosmic-400 hover:text-cosmic-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-cosmic-600 text-white'
                      : 'bg-space-800 text-cosmic-100 border border-cosmic-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-space-800 text-cosmic-100 border border-cosmic-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>AI думает...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cosmic-700">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isPremium ? "Задайте любой вопрос о вашем космическом профиле..." : "Задайте простой вопрос..."}
              className="flex-1 bg-space-800 border border-cosmic-700 rounded-lg px-3 py-2 text-cosmic-100 placeholder-cosmic-500 resize-none focus:outline-none focus:border-cosmic-500"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-cosmic-600 text-white px-4 py-2 rounded-lg hover:bg-cosmic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Отправить
            </button>
          </div>

          {!isPremium && (
            <div className="mt-2 text-center">
              <button
                onClick={() => {/* Логика обновления до премиум */}}
                className="text-cosmic-400 hover:text-cosmic-300 text-sm underline"
              >
                Обновить до премиум для расширенных возможностей
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
