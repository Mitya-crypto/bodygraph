'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Star, Zap, User, Brain, Target, TrendingUp, Activity, Heart, Shield, Clock, Palette } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    )
  }

  const toggleWidget = (widget: string) => {
    setExpandedWidget(expandedWidget === widget ? null : widget)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-cosmic-500 to-cosmic-700 rounded-full flex items-center justify-center">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-2 border-2 border-cosmic-400 border-dashed rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
              </div>
            </div>
            <h1 className="cosmic-title text-4xl mb-4">Космический Бодиграф</h1>
            <p className="cosmic-text text-lg">Откройте тайны вашей космической сущности через нумерологию, Human Design и астрологию</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {/* Нумерология Виджет */}
            <div className="cosmic-card">
              <div className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">📊 Нумерология</h3>
                        <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
                      </div>
                    </div>
                    <button 
                      className="w-8 h-8 bg-cosmic-600/30 rounded-lg flex items-center justify-center hover:bg-cosmic-600/50 transition-colors"
                      onClick={() => toggleWidget('numerology')}
                    >
                      <svg className={`w-4 h-4 text-cosmic-300 transition-transform ${expandedWidget === 'numerology' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-3 border border-purple-500/20">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white mb-1">5</div>
                        <div className="text-xs text-cosmic-300">Число дня</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white mb-1">1</div>
                        <div className="text-xs text-cosmic-300">Персональное число</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-cosmic-300 font-medium">Энергия дня</span>
                      <span className="text-sm text-white font-bold">66%</span>
                    </div>
                    <div className="relative w-full h-3 bg-space-700/50 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full shadow-lg" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-cosmic-400" />
                      <span className="text-sm font-medium text-cosmic-300">Энергия за неделю</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[36, 37, 38, 39, 40, 41, 42].map((height, index) => (
                        <div key={index} className="bg-gradient-to-t from-cosmic-600 to-cosmic-400 rounded-t flex-1" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                      <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${expandedWidget === 'numerology' ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-space-700">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Показатели дня</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Настроение</span>
                              <span className="text-xs text-white font-bold">56%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                            </div>
                          </div>
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Креативность</span>
                              <span className="text-xs text-white font-bold">46%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '46%' }}></div>
                            </div>
                          </div>
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Социальность</span>
                              <span className="text-xs text-white font-bold">51%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '51%' }}></div>
                            </div>
                          </div>
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Активность</span>
                              <span className="text-xs text-white font-bold">66%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Благоприятные числа</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center text-sm font-bold text-cosmic-100">5</div>
                          <div className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center text-sm font-bold text-cosmic-100">1</div>
                          <div className="w-8 h-8 bg-cosmic-600 rounded-full flex items-center justify-center text-sm font-bold text-cosmic-100">6</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Рекомендуемые цвета</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">Зеленый</div>
                          <div className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">Синий</div>
                          <div className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">Фиолетовый</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Лучшее время</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">08:00-10:00</div>
                          <div className="px-3 py-1 bg-space-700 rounded-full text-xs text-cosmic-300">14:00-16:00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-sm py-2 mt-4"
                    onClick={() => toggleWidget('numerology')}
                  >
                    {expandedWidget === 'numerology' ? 'Свернуть детали' : 'Развернуть детали'}
                  </button>
                </div>
              </div>
            </div>

            {/* Human Design Виджет */}
            <div className="cosmic-card">
              <div className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">🧬 Human Design</h3>
                        <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
                      </div>
                    </div>
                    <button 
                      className="w-8 h-8 bg-cosmic-600/30 rounded-lg flex items-center justify-center hover:bg-cosmic-600/50 transition-colors"
                      onClick={() => toggleWidget('human-design')}
                    >
                      <svg className={`w-4 h-4 text-cosmic-300 transition-transform ${expandedWidget === 'human-design' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Стратегия дня</h4>
                      </div>
                      <p className="text-cosmic-200 text-sm mb-2">Wait for the Lunar Cycle</p>
                      <p className="text-cosmic-400 text-xs">Используйте свою стратегию</p>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Авторитет в действии</h4>
                      </div>
                      <p className="text-cosmic-200 text-sm mb-2">Environmental</p>
                      <p className="text-cosmic-400 text-xs">Лучшее время: в подходящем месте</p>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cosmic-300 font-medium">Уровень энергии</span>
                        <span className="text-cosmic-400 text-sm">54/100</span>
                      </div>
                      <div className="w-full bg-space-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Лунная фаза</h4>
                      </div>
                      <p className="text-cosmic-200 text-sm mb-1">Убывающая луна</p>
                      <p className="text-cosmic-400 text-xs">Время для действий</p>
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${expandedWidget === 'human-design' ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-space-700">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Состояние центров</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Эмоции</span>
                              <span className="text-xs text-white font-bold">99%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                            </div>
                          </div>
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Мышление</span>
                              <span className="text-xs text-white font-bold">59%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '59%' }}></div>
                            </div>
                          </div>
                          <div className="bg-space-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-cosmic-300">Тело</span>
                              <span className="text-xs text-white font-bold">49%</span>
                            </div>
                            <div className="w-full bg-space-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '49%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Энергия по часам</span>
                        </div>
                        <div className="bg-space-800/50 rounded-lg p-3">
                          <div className="flex items-end gap-1 h-16">
                            {[59, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((height, index) => (
                              <div key={index} className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t flex-1" style={{ height: `${height}%` }}></div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                            <span>0:00</span><span>2:00</span><span>4:00</span><span>6:00</span><span>8:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span><span>22:00</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-cosmic-300">Вызовы</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Избегайте импульсивных решений</div>
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Не торопитесь с выводами</div>
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Слушайте свой внутренний голос</div>
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Доверяйте процессу</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-cosmic-300">Возможности</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Отличное время для планирования</div>
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Благоприятный период для общения</div>
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Время для творчества</div>
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Возможности для роста</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-sm py-2 mt-4"
                    onClick={() => toggleWidget('human-design')}
                  >
                    {expandedWidget === 'human-design' ? 'Свернуть детали' : 'Развернуть детали'}
                  </button>
                </div>
              </div>
            </div>

            {/* Астрология Виджет */}
            <div className="cosmic-card">
              <div className="relative overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-cosmic-500/20 rounded-2xl p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">♈ Астрология</h3>
                        <p className="text-cosmic-300 text-xs">Ежедневные метрики</p>
                      </div>
                    </div>
                    <button 
                      className="w-8 h-8 bg-cosmic-600/30 rounded-lg flex items-center justify-center hover:bg-cosmic-600/50 transition-colors"
                      onClick={() => toggleWidget('astrology')}
                    >
                      <svg className={`w-4 h-4 text-cosmic-300 transition-transform ${expandedWidget === 'astrology' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Луна в Лев</h4>
                      </div>
                      <p className="text-cosmic-200 text-sm mb-1">Творческий и гордый</p>
                      <p className="text-cosmic-400 text-xs">Доверьтесь внутреннему голосу</p>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Активные транзиты</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-cosmic-300">Солнце</span>
                          <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-300">Оппозиция</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-cosmic-300">Луна</span>
                          <span className="px-2 py-1 rounded text-xs bg-yellow-900/30 text-yellow-300">Оппозиция</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-cosmic-300">Меркурий</span>
                          <span className="px-2 py-1 rounded text-xs bg-red-900/30 text-red-300">Оппозиция</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cosmic-300 font-medium">Благоприятный день</span>
                        <span className="text-cosmic-400 text-sm">59/100</span>
                      </div>
                      <div className="w-full bg-space-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '59%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-space-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-cosmic-400" />
                        <h4 className="font-semibold text-cosmic-300">Лунная фаза</h4>
                      </div>
                      <p className="text-cosmic-200 text-sm mb-1">Убывающая луна</p>
                      <p className="text-cosmic-400 text-xs">Время для действий</p>
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${expandedWidget === 'astrology' ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-space-700">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Планетарные часы</span>
                        </div>
                        <div className="bg-space-800/50 rounded-lg p-3">
                          <div className="flex items-end gap-1 h-16">
                            {[59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70].map((height, index) => (
                              <div key={index} className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t flex-1" style={{ height: `${height}%` }}></div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                            <span>0:00</span><span>2:00</span><span>4:00</span><span>6:00</span><span>8:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span><span>22:00</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-cosmic-400" />
                          <span className="text-sm font-medium text-cosmic-300">Ретроградные планеты</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-cosmic-200 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-2">
                            <span className="text-red-400">Меркурий</span> - Замедление коммуникации
                          </div>
                          <div className="text-cosmic-200 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-2">
                            <span className="text-red-400">Венера</span> - Замедление коммуникации
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-cosmic-300">Рекомендации</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Доверьтесь внутреннему голосу</div>
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Избегайте важных решений</div>
                            <div className="text-xs text-cosmic-300 bg-green-900/20 border border-green-500/30 rounded-lg p-2">Фокус на творчестве</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-cosmic-300">Вызовы</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Избегайте конфликтов</div>
                            <div className="text-xs text-cosmic-300 bg-red-900/20 border border-red-500/30 rounded-lg p-2">Не принимайте поспешных решений</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-sm py-2 mt-4"
                    onClick={() => toggleWidget('astrology')}
                  >
                    {expandedWidget === 'astrology' ? 'Свернуть детали' : 'Развернуть детали'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <a 
              href="/modules" 
              className="cosmic-button bg-cosmic-500 hover:bg-cosmic-600 text-white text-xl px-8 py-4 w-full rounded-xl transition-colors cursor-pointer inline-block text-center"
            >
              Начать путешествие
            </a>
            <button 
              className="cosmic-button bg-space-700 hover:bg-space-600 text-cosmic-200 text-lg px-6 py-3 w-full flex items-center justify-center gap-2"
              onClick={() => router.push('/profile')}
            >
              <User className="w-5 h-5" />
              Управление профилями
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

