'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ScenarioManagerProps {
  onScenarioSelect: (scenario: 'scenario1' | 'scenario2', data: any) => void
  isLoading?: boolean
}

export default function ScenarioManager({ onScenarioSelect, isLoading = false }: ScenarioManagerProps) {
  const [selectedScenario, setSelectedScenario] = useState<'scenario1' | 'scenario2' | null>(null)

  const scenarios = {
    scenario1: {
      id: 'scenario1',
      title: 'Сценарий 1: Классический подход',
      description: 'Традиционный путь анализа с детальными расчетами',
      icon: '🔮',
      features: [
        'Полный нумерологический анализ',
        'Детальная астрологическая карта',
        'Расширенная интерпретация Human Design',
        'Персональные рекомендации',
      ],
    },
    scenario2: {
      id: 'scenario2',
      title: 'Сценарий 2: Быстрый анализ',
      description: 'Ускоренный путь с ключевыми инсайтами',
      icon: '⚡',
      features: [
        'Основные нумерологические числа',
        'Упрощенная астрология',
        'Ключевые элементы Human Design',
        'Краткие рекомендации',
      ],
    },
  }

  const handleScenarioSelect = (scenario: 'scenario1' | 'scenario2') => {
    setSelectedScenario(scenario)
    
    // Подготавливаем данные для выбранного сценария
    const scenarioData = {
      scenario,
      timestamp: new Date().toISOString(),
      options: {
        includeDetailedAnalysis: scenario === 'scenario1',
        includeQuickInsights: scenario === 'scenario2',
        includeRecommendations: true,
        includeComparisons: scenario === 'scenario1',
      },
    }

    onScenarioSelect(scenario, scenarioData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card p-6 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cosmic-100 mb-2">
          🎯 Выберите сценарий анализа
        </h2>
        <p className="text-cosmic-400">
          Выберите подходящий вариант для получения персонализированного анализа
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(scenarios).map((scenario) => (
          <motion.div
            key={scenario.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedScenario === scenario.id
                ? 'border-cosmic-500 bg-cosmic-900/30'
                : 'border-cosmic-700 bg-space-900/50 hover:border-cosmic-600'
            }`}
            onClick={() => handleScenarioSelect(scenario.id as 'scenario1' | 'scenario2')}
          >
            {selectedScenario === scenario.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-cosmic-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
            )}

            <div className="text-4xl mb-4 text-center">
              {scenario.icon}
            </div>

            <h3 className="text-xl font-bold text-cosmic-100 mb-3 text-center">
              {scenario.title}
            </h3>

            <p className="text-cosmic-400 mb-4 text-center">
              {scenario.description}
            </p>

            <div className="space-y-2">
              <div className="text-sm font-medium text-cosmic-300 mb-2">
                Включает:
              </div>
              <ul className="space-y-1">
                {scenario.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-cosmic-400">
                    <span className="text-cosmic-500">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-cosmic-700">
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  selectedScenario === scenario.id
                    ? 'bg-cosmic-600 text-white'
                    : 'bg-cosmic-800 text-cosmic-300 hover:bg-cosmic-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleScenarioSelect(scenario.id as 'scenario1' | 'scenario2')
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Выполняется...</span>
                  </div>
                ) : (
                  'Выбрать сценарий'
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedScenario && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-cosmic-900/30 border border-cosmic-700 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-cosmic-400">Выбран:</span>
            <span className="font-medium text-cosmic-100">
              {scenarios[selectedScenario].title}
            </span>
          </div>
          <p className="text-sm text-cosmic-400">
            {scenarios[selectedScenario].description}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}



