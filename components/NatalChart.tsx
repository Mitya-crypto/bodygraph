// components/NatalChart.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ChartData {
  ascendant: number
  mc: number
  houses: number[]
  planets: Array<{
    name: string
    longitude: number
    latitude: number
  }>
}

interface NatalChartProps {
  chartData: ChartData
}

export function NatalChart({ chartData }: NatalChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !chartData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Устанавливаем размеры canvas на весь блок
    const containerWidth = canvas.parentElement?.clientWidth || 900
    const size = Math.min(containerWidth, 900)
    canvas.width = size
    canvas.height = size
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.46

    // Очищаем canvas
    ctx.clearRect(0, 0, size, size)

    // Цвета
    const colors = {
      background: 'transparent',
      outerCircle: '#5ab3ff',
      zodiacRing: '#2d3e50',
      houses: '#708090',
      planets: '#fff',
      signs: '#c5d9e8',
      text: '#e8f0f7',
      grid: '#3d4f61'
    }

    // Рисуем тени для глубины
    ctx.shadowColor = 'rgba(90, 179, 255, 0.3)'
    ctx.shadowBlur = 10

    // Рисуем внешний круг (граница знаков зодиака)
    ctx.strokeStyle = colors.outerCircle
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.shadowBlur = 0

    // Рисуем кольцо знаков зодиака (узкое)
    const zodiacRingOuter = radius * 0.98
    const zodiacRingInner = radius * 0.88  // Сделали уже (было 0.7, стало 0.88)
    
    ctx.strokeStyle = colors.zodiacRing
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, zodiacRingInner, 0, 2 * Math.PI)
    ctx.stroke()

    // Рисуем линии разделения знаков зодиака
    ctx.strokeStyle = colors.grid
    ctx.lineWidth = 1.5
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const x1 = centerX + Math.cos(angle) * zodiacRingInner
      const y1 = centerY + Math.sin(angle) * zodiacRingInner
      const x2 = centerX + Math.cos(angle) * zodiacRingOuter
      const y2 = centerY + Math.sin(angle) * zodiacRingOuter
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Рисуем внутренний круг (домов) - увеличиваем центральную площадь
    const housesCircle = radius * 0.85  // Увеличили центральную площадь (было 0.7, стало 0.85)
    ctx.strokeStyle = colors.houses
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(112, 128, 144, 0.4)'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(centerX, centerY, housesCircle, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Рисуем линии домов (от центра до внутреннего круга)
    ctx.strokeStyle = colors.houses
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.6
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const x1 = centerX + Math.cos(angle) * (radius * 0.15)  // От центра
      const y1 = centerY + Math.sin(angle) * (radius * 0.15)
      const x2 = centerX + Math.cos(angle) * housesCircle
      const y2 = centerY + Math.sin(angle) * housesCircle
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Рисуем центральный круг (земля)
    ctx.fillStyle = 'rgba(45, 62, 80, 0.3)'
    ctx.strokeStyle = colors.outerCircle
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Рисуем знаки зодиака в узком кольце
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
    const signNames = {
      ru: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'],
      en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    }

    // Рисуем знаки в узком кольце
    ctx.font = 'bold 26px Arial'
    ctx.fillStyle = colors.signs
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(197, 217, 232, 0.5)'
    ctx.shadowBlur = 4

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 + 15 - 90) * (Math.PI / 180)  // Центрируем в секторе
      const signRadius = (zodiacRingOuter + zodiacRingInner) / 2  // Центр узкого кольца
      const x = centerX + Math.cos(angle) * signRadius
      const y = centerY + Math.sin(angle) * signRadius
      
      ctx.fillText(signs[i], x, y)
    }
    ctx.shadowBlur = 0

    // Рисуем планеты
    const planetSymbols: { [key: string]: string } = {
      Sun: '☉',
      Moon: '☽',
      Mercury: '☿',
      Venus: '♀',
      Mars: '♂',
      Jupiter: '♃',
      Saturn: '♄',
      Uranus: '♅',
      Neptune: '♆',
      Pluto: '♇',
      Ascendant: 'AC',
      Midheaven: 'MC'
    }

    const planetColors: { [key: string]: string } = {
      Sun: '#FFD700',
      Moon: '#C0C0C0',
      Mercury: '#87CEEB',
      Venus: '#FFC0CB',
      Mars: '#FF6347',
      Jupiter: '#DAA520',
      Saturn: '#708090',
      Uranus: '#00CED1',
      Neptune: '#4169E1',
      Pluto: '#8B008B',
      Ascendant: '#FF4500',
      Midheaven: '#FF4500'
    }

    // Рисуем основные планеты в увеличенной центральной области
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    
    mainPlanets.forEach(planetName => {
      const planet = chartData.planets.find(p => p.name === planetName)
      if (planet) {
        const angle = (planet.longitude - 90) * (Math.PI / 180)
        const planetRadius = radius * 0.65  // Размещаем в увеличенной центральной области
        const x = centerX + Math.cos(angle) * planetRadius
        const y = centerY + Math.sin(angle) * planetRadius
        
        // Добавляем свечение для планет
        ctx.shadowColor = planetColors[planetName] || colors.planets
        ctx.shadowBlur = 12
        
        ctx.font = 'bold 32px Arial'
        ctx.fillStyle = planetColors[planetName] || colors.planets
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(planetSymbols[planetName] || planetName[0], x, y)
        
        ctx.shadowBlur = 0
        
        // Добавляем метку с градусом
        ctx.font = '11px Arial'
        ctx.fillStyle = colors.text
        const degreeText = `${Math.round(planet.longitude)}°`
        ctx.fillText(degreeText, x, y + 22)
      }
    })

    // Рисуем Асцендент и MC за пределами кольца знаков
    const ascendantAngle = (chartData.ascendant - 90) * (Math.PI / 180)
    const ascX = centerX + Math.cos(ascendantAngle) * (zodiacRingInner - 15)
    const ascY = centerY + Math.sin(ascendantAngle) * (zodiacRingInner - 15)
    
    ctx.shadowColor = planetColors.Ascendant
    ctx.shadowBlur = 10
    ctx.font = 'bold 20px Arial'
    ctx.fillStyle = planetColors.Ascendant
    ctx.fillText('AC', ascX, ascY)

    const mcAngle = (chartData.mc - 90) * (Math.PI / 180)
    const mcX = centerX + Math.cos(mcAngle) * (zodiacRingInner - 15)
    const mcY = centerY + Math.sin(mcAngle) * (zodiacRingInner - 15)
    
    ctx.fillText('MC', mcX, mcY)
    ctx.shadowBlur = 0

    // Рисуем номера домов ближе к знакам зодиака (по краям)
    ctx.font = 'bold 16px Arial'
    ctx.fillStyle = colors.text
    ctx.shadowColor = 'rgba(232, 240, 247, 0.4)'
    ctx.shadowBlur = 4
    
    for (let i = 1; i <= 12; i++) {
      const angle = ((i - 1) * 30 + 15 - 90) * (Math.PI / 180) // Центр каждого дома
      const houseRadius = zodiacRingInner - 25  // Размещаем близко к внутренней границе кольца знаков
      const x = centerX + Math.cos(angle) * houseRadius
      const y = centerY + Math.sin(angle) * houseRadius
      
      ctx.fillText(i.toString(), x, y)
    }
    ctx.shadowBlur = 0

    // Рисуем аспекты между планетами
    ctx.lineWidth = 2
    const aspectColors = {
      conjunction: '#FFD700',    // Золотой - соединение
      opposition: '#FF4500',     // Красный - оппозиция
      trine: '#00FF7F',          // Зеленый - трин
      square: '#FF6347',         // Томатный - квадрат
      sextile: '#87CEEB'         // Голубой - секстиль
    }

    // Получаем все планеты для расчета аспектов
    const allPlanets = chartData.planets.filter(p => 
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.name)
    )

    // Рисуем аспекты в увеличенной центральной области
    for (let i = 0; i < allPlanets.length; i++) {
      for (let j = i + 1; j < allPlanets.length; j++) {
        const planet1 = allPlanets[i]
        const planet2 = allPlanets[j]
        
        const angle1 = (planet1.longitude - 90) * (Math.PI / 180)
        const angle2 = (planet2.longitude - 90) * (Math.PI / 180)
        
        const planetRadius = radius * 0.65
        const x1 = centerX + Math.cos(angle1) * planetRadius
        const y1 = centerY + Math.sin(angle1) * planetRadius
        const x2 = centerX + Math.cos(angle2) * planetRadius
        const y2 = centerY + Math.sin(angle2) * planetRadius
        
        // Вычисляем угловое расстояние
        let angleDiff = Math.abs(planet1.longitude - planet2.longitude)
        if (angleDiff > 180) angleDiff = 360 - angleDiff
        
        // Определяем тип аспекта
        let aspectType = null
        let aspectColor = aspectColors.conjunction
        
        if (angleDiff <= 8) {
          aspectType = 'conjunction'
          aspectColor = aspectColors.conjunction
        } else if (Math.abs(angleDiff - 180) <= 8) {
          aspectType = 'opposition'
          aspectColor = aspectColors.opposition
        } else if (Math.abs(angleDiff - 120) <= 8) {
          aspectType = 'trine'
          aspectColor = aspectColors.trine
        } else if (Math.abs(angleDiff - 90) <= 8) {
          aspectType = 'square'
          aspectColor = aspectColors.square
        } else if (Math.abs(angleDiff - 60) <= 8) {
          aspectType = 'sextile'
          aspectColor = aspectColors.sextile
        }
        
        // Рисуем линию аспекта с эффектом свечения
        if (aspectType) {
          ctx.strokeStyle = aspectColor
          ctx.shadowColor = aspectColor
          ctx.shadowBlur = 6
          ctx.globalAlpha = 0.6
          
          // Рисуем пунктирную линию для оппозиции и квадрата
          if (aspectType === 'opposition') {
            ctx.setLineDash([8, 6])
          } else if (aspectType === 'square') {
            ctx.setLineDash([4, 4])
          } else {
            ctx.setLineDash([])
          }
          
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          
          ctx.setLineDash([])
          ctx.globalAlpha = 1
          ctx.shadowBlur = 0
        }
      }
    }


  }, [chartData])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center"
    >
      <canvas
        ref={canvasRef}
        className="w-full max-w-4xl"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Легенда аспектов */}
      <div className="mt-6 p-5 bg-space-800/40 rounded-xl w-full max-w-4xl border border-space-700/50">
        <h4 className="text-cosmic-200 font-semibold mb-4 text-center">
          Аспекты между планетами
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
            <span className="text-cosmic-300">Соединение (0°)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 border-dashed border-t-2 border-red-500"></div>
            <span className="text-cosmic-300">Оппозиция (180°)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-green-400 shadow-lg shadow-green-400/50"></div>
            <span className="text-cosmic-300">Трин (120°)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 border-dashed border-t-2 border-orange-400"></div>
            <span className="text-cosmic-300">Квадрат (90°)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-400 shadow-lg shadow-blue-400/50"></div>
            <span className="text-cosmic-300">Секстиль (60°)</span>
          </div>
        </div>
        <p className="text-cosmic-400 text-xs mt-3 text-center italic">
          Линии показывают взаимодействие планет. Цифры под планетами - градусы их положения
        </p>
      </div>
    </motion.div>
  )
}
