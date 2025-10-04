'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ChatGPTTest() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/chatgpt/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          isPremium,
          context: {},
          userProfile: {
            name: 'Тестовый пользователь',
            birthDate: '1990-01-01',
            birthTime: '12:00',
          },
        }),
      })

      const data = await res.json()
      setResponse(data.response || data.error || 'Нет ответа')
    } catch (error) {
      setResponse('Ошибка: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card p-6 space-y-4"
    >
      <h3 className="text-xl font-bold text-cosmic-100">
        🤖 Тест ChatGPT ассистента
      </h3>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="rounded border-cosmic-600 bg-space-800 text-cosmic-600 focus:ring-cosmic-500"
          />
          <span className="text-cosmic-300">Премиум режим (GPT-4)</span>
        </label>
      </div>

      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите ваш вопрос..."
          className="w-full bg-space-800 border border-cosmic-700 rounded-lg px-3 py-2 text-cosmic-100 placeholder-cosmic-500 resize-none focus:outline-none focus:border-cosmic-500"
          rows={3}
        />
        
        <button
          onClick={sendMessage}
          disabled={!message.trim() || isLoading}
          className="bg-cosmic-600 text-white px-4 py-2 rounded-lg hover:bg-cosmic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>

      {response && (
        <div className="bg-space-800 border border-cosmic-700 rounded-lg p-4">
          <h4 className="text-cosmic-200 font-medium mb-2">Ответ AI:</h4>
          <div className="text-cosmic-100 whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </motion.div>
  )
}



