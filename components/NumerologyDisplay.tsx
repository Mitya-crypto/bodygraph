// components/NumerologyDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Heart, User, Zap, TrendingUp, Calendar, Users, Download } from 'lucide-react'
import { UserProfile } from '@/store/appStore'
import { parseISO } from 'date-fns'
import { LifePathDescription } from './LifePathDescription'
import { ExpressionDescription } from './ExpressionDescription'
import { SoulUrgeDescription } from './SoulUrgeDescription'
import { PersonalityDescription } from './PersonalityDescription'
import { BiorythmsDescription } from './BiorythmsDescription'
import { AdditionalNumbersDescription } from './AdditionalNumbersDescription'
import { AdditionalNumbersBlockDescription } from './AdditionalNumbersBlockDescription'
import DailyNumerologyMetrics from './DailyNumerologyMetrics'
import PDFGenerator from '@/lib/pdfGenerator'

interface NumerologyDisplayProps {
  userProfile: UserProfile
  language: 'en' | 'ru'
}

interface NumerologyData {
  lifePath: number
  expression: number
  soulUrge: number
  personality: number
  dayNumber: number
  monthNumber: number
  yearNumber: number
  biorythms: {
    physical: number
    emotional: number
    intellectual: number
  }
  compatibility?: {
    partnerName: string
    score: number
    description: string
  }
}

export function NumerologyDisplay({ userProfile, language }: NumerologyDisplayProps) {
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState(userProfile.name || '')
  const [showLifePathDescription, setShowLifePathDescription] = useState(false)
  const [showExpressionDescription, setShowExpressionDescription] = useState(false)
  const [showSoulUrgeDescription, setShowSoulUrgeDescription] = useState(false)
  const [showPersonalityDescription, setShowPersonalityDescription] = useState(false)
  const [showDayNumberDescription, setShowDayNumberDescription] = useState(false)
  const [showMonthNumberDescription, setShowMonthNumberDescription] = useState(false)
  const [showYearNumberDescription, setShowYearNumberDescription] = useState(false)
  const [showBiorythmsDescription, setShowBiorythmsDescription] = useState(false)
  const [showAdditionalNumbersDescription, setShowAdditionalNumbersDescription] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  console.log('🔍 NumerologyDisplay received userProfile:', userProfile)
  console.log('🔍 NumerologyDisplay userProfile type:', typeof userProfile)
  console.log('🔍 NumerologyDisplay userProfile name:', userProfile?.name)
  console.log('🔍 NumerologyDisplay userProfile birthDate:', userProfile?.birthDate)

  const handleDownloadPDF = async () => {
    if (!numerologyData) {
      alert('Нет данных для генерации PDF')
      return
    }

    setIsGeneratingPDF(true)
    
    try {
      console.log('🔄 Generating PDF for numerology data:', numerologyData)
      
      // Генерируем PDF
      const pdfBlob = await PDFGenerator.generateNumerologyPDF(userProfile, numerologyData)
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `numerology-report-${userProfile.name || 'user'}-${new Date().toISOString().split('T')[0]}.html`
      
      // Добавляем ссылку в DOM, кликаем и удаляем
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Освобождаем память
      URL.revokeObjectURL(url)
      
      console.log('✅ PDF generated and downloaded successfully')
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error)
      alert('Ошибка при генерации PDF. Попробуйте еще раз.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Обновляем userName при изменении userProfile.name
  useEffect(() => {
    if (userProfile?.name && userProfile.name !== userName) {
      console.log('🔄 Updating userName from userProfile:', userProfile.name)
      setUserName(userProfile.name)
    }
  }, [userProfile])

  useEffect(() => {
    calculateNumerology()
  }, [userProfile, userName])


  const calculateNumerology = () => {
    setIsLoading(true)
    
    try {
      // Парсим дату рождения
      const birthDate = parseISO(userProfile.birthDate)
      const day = birthDate.getDate()
      const month = birthDate.getMonth() + 1
      const year = birthDate.getFullYear()
      
      // 1. Число жизненного пути (Life Path)
      const lifePath = calculateLifePath(day, month, year)
      
      // 2. Число выражения (Expression/Destiny)
      console.log('🔍 User profile name:', userProfile.name)
      console.log('🔍 Current userName:', userName)
      console.log('🔍 Name type:', typeof userName)
      console.log('🔍 Name length:', userName?.length)
      
      if (!userName || userName.trim() === '') {
        console.warn('⚠️ Имя пользователя пустое или не определено, используем значение по умолчанию')
        setUserName('Пользователь') // Значение по умолчанию
        return // Прерываем расчет, чтобы пересчитать с новым именем
      }
      
      if (!userProfile.birthDate) {
        console.warn('⚠️ Дата рождения не определена, используем текущую дату')
        userProfile.birthDate = new Date().toISOString().split('T')[0] // Текущая дата
      }
      
      const expression = calculateExpression(userName)
      console.log('Expression calculation for', userName, '=', expression)
      
      // 3. Число души (по дню рождения в русской традиции)
      const soulUrge = reduceToSingleDigit(day)
      console.log('Soul Urge (day of birth) calculation for', day, '=', soulUrge)
      
      // 4. Число личности (Personality)
      const personality = calculatePersonality(userName)
      console.log('Personality calculation for', userName, '=', personality)
      
      // 5. Числа дня, месяца, года
      const dayNumber = reduceToSingleDigit(day)
      const monthNumber = reduceToSingleDigit(month)
      const yearNumber = reduceToSingleDigit(year)
      
      // 6. Биоритмы
      console.log('🔍 Calling calculateBiorythms with userProfile.birthDate:', userProfile.birthDate)
      const biorythms = calculateBiorythms(birthDate)
      
      const data = {
        lifePath: lifePath || 0,
        expression: expression || 0,
        soulUrge: soulUrge || 0,
        personality: personality || 0,
        dayNumber: dayNumber || 0,
        monthNumber: monthNumber || 0,
        yearNumber: yearNumber || 0,
        biorythms: biorythms || { physical: 0, emotional: 0, intellectual: 0 }
      }
      
      console.log('🔢 Numerology data calculated:', data)
      console.log('📊 Expression number:', expression)
      console.log('📊 Expression type:', typeof expression)
      console.log('📊 Expression is NaN:', isNaN(expression))
      console.log('📊 Expression is undefined:', expression === undefined)
      console.log('📊 Expression is null:', expression === null)
      
      setNumerologyData(data)
    } catch (error) {
      console.error('❌ Error calculating numerology:', error)
      console.error('❌ Error details:', error)
      
      // Устанавливаем значения по умолчанию при ошибке
      const fallbackData = {
        lifePath: 0,
        expression: 0,
        soulUrge: 0,
        personality: 0,
        dayNumber: 0,
        monthNumber: 0,
        yearNumber: 0,
        biorythms: { physical: 0, emotional: 0, intellectual: 0 }
      }
      
      console.log('🔄 Using fallback data due to error:', fallbackData)
      setNumerologyData(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для сокращения числа до одной цифры или мастер-числа
  const reduceToSingleDigit = (num: number): number => {
    // Проверяем валидность входного числа
    if (isNaN(num) || num === null || num === undefined) {
      console.warn('⚠️ Invalid number in reduceToSingleDigit:', num)
      return 0
    }
    
    if (num === 11 || num === 22 || num === 33) return num // Мастер-числа
    if (num < 10) return num
    
    let sum = num
    let iterations = 0
    while (sum >= 10 && sum !== 11 && sum !== 22 && sum !== 33 && iterations < 10) {
      sum = sum.toString().split('').reduce((acc, digit) => {
        const digitNum = parseInt(digit)
        return isNaN(digitNum) ? acc : acc + digitNum
      }, 0)
      iterations++
    }
    
    console.log(`🔄 reduceToSingleDigit: ${num} → ${sum} (iterations: ${iterations})`)
    return sum
  }

  // Расчет числа жизненного пути
  const calculateLifePath = (day: number, month: number, year: number): number => {
    console.log(`📅 Расчет числа жизненного пути для: ${day}.${month}.${year}`)
    
    // Сокращаем день до одной цифры
    const dayReduced = reduceToSingleDigit(day)
    console.log(`   День: ${day} → ${dayReduced}`)
    
    // Сокращаем месяц до одной цифры или мастер-числа
    const monthReduced = reduceToSingleDigit(month)
    console.log(`   Месяц: ${month} → ${monthReduced}`)
    
    // Сокращаем год до одной цифры
    const yearReduced = reduceToSingleDigit(year)
    console.log(`   Год: ${year} → ${yearReduced}`)
    
    // Суммируем результаты
    const sum = dayReduced + monthReduced + yearReduced
    console.log(`   Сумма: ${dayReduced} + ${monthReduced} + ${yearReduced} = ${sum}`)
    
    // Финальное сокращение с сохранением мастер-чисел
    const finalResult = reduceToSingleDigit(sum)
    console.log(`   Итого: ${sum} → ${finalResult}`)
    console.log(`✅ Число жизненного пути: ${finalResult}`)
    
    return finalResult
  }

  // Расчет числа выражения
  const calculateExpression = (name: string): number => {
    // Проверяем валидность входного имени
    if (!name || typeof name !== 'string' || name.trim() === '') {
      console.warn('⚠️ Invalid name in calculateExpression:', name)
      return 1
    }
    
    const letterValues: { [key: string]: number } = {
      // Английские буквы (стандартная пифагорейская таблица)
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
      // Русские буквы (правильная русская нумерологическая таблица)
      // А, И, С, Ъ = 1
      'А': 1, 'И': 1, 'С': 1, 'Ъ': 1,
      // Б, Й, Т, Ы = 2
      'Б': 2, 'Й': 2, 'Т': 2, 'Ы': 2,
      // В, К, У, Ь = 3
      'В': 3, 'К': 3, 'У': 3, 'Ь': 3,
      // Г, Л, Ф, Э = 4
      'Г': 4, 'Л': 4, 'Ф': 4, 'Э': 4,
      // Д, М, Х, Ю = 5
      'Д': 5, 'М': 5, 'Х': 5, 'Ю': 5,
      // Е, Н, Ц, Я = 6
      'Е': 6, 'Н': 6, 'Ц': 6, 'Я': 6,
      // Ё, О, Ч = 7
      'Ё': 7, 'О': 7, 'Ч': 7,
      // Ж, П, Ш = 8
      'Ж': 8, 'П': 8, 'Ш': 8,
      // З, Р, Щ = 9
      'З': 9, 'Р': 9, 'Щ': 9
    }
    
    // Разделяем имя на части (имя, отчество, фамилия)
    const nameParts = name.toUpperCase().split(' ').filter(part => part.length > 0)
    let totalSum = 0
    
    console.log(`🔢 Расчет числа выражения для: "${name}"`)
    console.log(`📝 Части имени:`, nameParts)
    
    // Считаем каждую часть отдельно, затем суммируем
    for (let i = 0; i < nameParts.length; i++) {
      const part = nameParts[i]
      let partSum = 0
      let partCalculation = []
      
      for (const letter of part) {
        if (letterValues[letter]) {
          partSum += letterValues[letter]
          partCalculation.push(`${letter}=${letterValues[letter]}`)
        } else {
          console.warn(`⚠️ Unknown letter: "${letter}" in part: "${part}"`)
        }
      }
      
      // Проверяем, что partSum валиден
      if (isNaN(partSum) || partSum < 0) {
        console.warn(`⚠️ Invalid partSum for "${part}":`, partSum)
        partSum = 0
      }
      
      const partReduced = reduceToSingleDigit(partSum)
      console.log(`   ${i + 1}. ${part}: ${partCalculation.join(' + ')} = ${partSum} → ${partReduced}`)
      
      // Проверяем, что partReduced валиден
      if (isNaN(partReduced)) {
        console.warn(`⚠️ Invalid partReduced for "${part}":`, partReduced)
        totalSum += 0
      } else {
        totalSum += partReduced
      }
    }
    
    const finalResult = reduceToSingleDigit(totalSum)
    console.log(`   Итого: ${totalSum} → ${finalResult}`)
    console.log(`✅ Число выражения: ${finalResult}`)
    
    // Дополнительная проверка
    if (isNaN(finalResult) || finalResult === 0) {
      console.error('❌ Ошибка в расчете числа выражения:', { name, finalResult, totalSum })
      console.error('❌ Debug info:', { 
        nameParts, 
        totalSum, 
        finalResult, 
        nameLength: name.length,
        nameType: typeof name
      })
      return 1 // Возвращаем 1 как fallback
    }
    
    return finalResult
  }

  // Расчет числа душевного побуждения
  const calculateSoulUrge = (name: string): number => {
    const vowelValues: { [key: string]: number } = {
      // Английские гласные
      'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3, 'Y': 7,
      // Русские гласные
      'А': 1, 'Е': 5, 'Ё': 7, 'И': 9, 'О': 6, 'У': 3, 'Ы': 2, 'Э': 4, 'Ю': 5, 'Я': 6
    }
    
    // Разделяем имя на части и считаем гласные в каждой части отдельно
    const nameParts = name.toUpperCase().split(' ').filter(part => part.length > 0)
    let totalSum = 0
    
    for (const part of nameParts) {
      const vowels = part.match(/[AEIOUYАЕЁИОУЫЭЮЯ]/g) || []
      let partSum = 0
      
      for (const vowel of vowels) {
        if (vowelValues[vowel]) {
          partSum += vowelValues[vowel]
        }
      }
      // Сокращаем каждую часть до одной цифры
      partSum = reduceToSingleDigit(partSum)
      totalSum += partSum
    }
    
    return reduceToSingleDigit(totalSum)
  }

  // Расчет числа личности
  const calculatePersonality = (name: string): number => {
    const letterValues: { [key: string]: number } = {
      // Английские буквы (стандартная пифагорейская таблица)
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
      // Русские буквы (правильная русская нумерологическая таблица)
      // А, И, С, Ъ = 1
      'А': 1, 'И': 1, 'С': 1, 'Ъ': 1,
      // Б, Й, Т, Ы = 2
      'Б': 2, 'Й': 2, 'Т': 2, 'Ы': 2,
      // В, К, У, Ь = 3
      'В': 3, 'К': 3, 'У': 3, 'Ь': 3,
      // Г, Л, Ф, Э = 4
      'Г': 4, 'Л': 4, 'Ф': 4, 'Э': 4,
      // Д, М, Х, Ю = 5
      'Д': 5, 'М': 5, 'Х': 5, 'Ю': 5,
      // Е, Н, Ц, Я = 6
      'Е': 6, 'Н': 6, 'Ц': 6, 'Я': 6,
      // Ё, О, Ч = 7
      'Ё': 7, 'О': 7, 'Ч': 7,
      // Ж, П, Ш = 8
      'Ж': 8, 'П': 8, 'Ш': 8,
      // З, Р, Щ = 9
      'З': 9, 'Р': 9, 'Щ': 9
    }
    
    // Разделяем имя на части и считаем согласные в каждой части отдельно
    const nameParts = name.toUpperCase().split(' ').filter(part => part.length > 0)
    let totalSum = 0
    
    for (const part of nameParts) {
      const consonants = part.replace(/[AEIOUYАЕЁИОУЫЭЮЯ]/g, '')
      let partSum = 0
      
      for (const letter of consonants) {
        if (letterValues[letter]) {
          partSum += letterValues[letter]
        }
      }
      // Сокращаем каждую часть до одной цифры
      partSum = reduceToSingleDigit(partSum)
      totalSum += partSum
    }
    
    return reduceToSingleDigit(totalSum)
  }

  // Расчет биоритмов (обновляется каждый день)
  const calculateBiorythms = (birthDate: Date) => {
    const today = new Date()
    const daysSinceBirth = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const physical = Math.sin(2 * Math.PI * daysSinceBirth / 23) * 100
    const emotional = Math.sin(2 * Math.PI * daysSinceBirth / 28) * 100
    const intellectual = Math.sin(2 * Math.PI * daysSinceBirth / 33) * 100
    
    return {
      physical: Math.round(physical),
      emotional: Math.round(emotional),
      intellectual: Math.round(intellectual)
    }
  }

  // Получение описания числа
  const getNumberDescription = (number: number, type: string) => {
    const descriptions = {
      ru: {
        lifePath: {
          1: 'Лидер, новатор, независимый',
          2: 'Дипломат, сотрудник, чувствительный',
          3: 'Творческий, общительный, оптимистичный',
          4: 'Практичный, организованный, надежный',
          5: 'Авантюрист, свободолюбивый, энергичный',
          6: 'Заботливый, ответственный, семейный',
          7: 'Аналитик, духовный, интроверт',
          8: 'Амбициозный, материалист, лидер',
          9: 'Гуманист, мудрый, завершающий',
          11: 'Интуитивный, вдохновляющий, духовный лидер',
          22: 'Мастер-строитель, практичный идеалист',
          33: 'Мастер-учитель, сострадательный целитель'
        },
        expression: {
          1: 'Творческий лидер с оригинальными идеями',
          2: 'Дипломатичный посредник',
          3: 'Художник и коммуникатор',
          4: 'Практичный организатор',
          5: 'Свободный дух и исследователь',
          6: 'Заботливый воспитатель',
          7: 'Аналитик и исследователь',
          8: 'Деловой лидер',
          9: 'Гуманист и учитель',
          11: 'Вдохновляющий лидер',
          22: 'Мастер-строитель',
          33: 'Мастер-целитель'
        },
        soulUrge: {
          1: 'Лидерские качества, независимость, инициативность',
          2: 'Дипломатичность, чувствительность, сотрудничество',
          3: 'Творчество, общительность, самовыражение',
          4: 'Практичность, стабильность, надежность',
          5: 'Свободолюбие, авантюризм, любознательность',
          6: 'Заботливость, ответственность, семейственность',
          7: 'Аналитичность, духовность, интровертность',
          8: 'Амбициозность, материализм, лидерство',
          9: 'Гуманизм, мудрость, завершение',
          11: 'Интуитивность, вдохновение, духовное лидерство',
          22: 'Мастер-строитель, практичный идеалист',
          33: 'Мастер-учитель, сострадательный целитель'
        },
        personality: {
          1: 'Уверенный и независимый',
          2: 'Дипломатичный и чувствительный',
          3: 'Общительный и творческий',
          4: 'Надежный и практичный',
          5: 'Адаптивный и любознательный',
          6: 'Ответственный и заботливый',
          7: 'Аналитичный и духовный',
          8: 'Амбициозный и решительный',
          9: 'Мудрый и сострадательный',
          11: 'Интуитивный и вдохновляющий',
          22: 'Практичный и идеалистичный',
          33: 'Сострадательный и целительный'
        }
      },
      en: {
        lifePath: {
          1: 'Leader, innovator, independent',
          2: 'Diplomat, collaborator, sensitive',
          3: 'Creative, social, optimistic',
          4: 'Practical, organized, reliable',
          5: 'Adventurer, free-spirited, energetic',
          6: 'Caring, responsible, family-oriented',
          7: 'Analyst, spiritual, introvert',
          8: 'Ambitious, materialistic, leader',
          9: 'Humanitarian, wise, completing',
          11: 'Intuitive, inspiring, spiritual leader',
          22: 'Master builder, practical idealist',
          33: 'Master teacher, compassionate healer'
        },
        expression: {
          1: 'Creative leader with original ideas',
          2: 'Diplomatic mediator',
          3: 'Artist and communicator',
          4: 'Practical organizer',
          5: 'Free spirit and explorer',
          6: 'Caring nurturer',
          7: 'Analyst and researcher',
          8: 'Business leader',
          9: 'Humanitarian and teacher',
          11: 'Inspiring leader',
          22: 'Master builder',
          33: 'Master healer'
        },
        soulUrge: {
          1: 'Desire to be first and independent',
          2: 'Desire for harmony and cooperation',
          3: 'Desire for self-expression and creativity',
          4: 'Desire for stability and order',
          5: 'Desire for freedom and adventure',
          6: 'Desire to care and be responsible',
          7: 'Desire for understanding and spirituality',
          8: 'Desire for material success',
          9: 'Desire to serve humanity',
          11: 'Desire to inspire others',
          22: 'Desire to build something great',
          33: 'Desire to heal and teach'
        },
        personality: {
          1: 'Confident and independent',
          2: 'Diplomatic and sensitive',
          3: 'Social and creative',
          4: 'Reliable and practical',
          5: 'Adaptable and curious',
          6: 'Responsible and caring',
          7: 'Analytical and spiritual',
          8: 'Ambitious and determined',
          9: 'Wise and compassionate',
          11: 'Intuitive and inspiring',
          22: 'Practical and idealistic',
          33: 'Compassionate and healing'
        }
      }
    }
    
    const typeDescriptions = descriptions[language][type as keyof typeof descriptions[typeof language]] as { [key: number]: string }
    return typeDescriptions[number] || 'Описание недоступно'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-400"></div>
      </div>
    )
  }

  if (!numerologyData) {
    return (
      <div className="text-center p-8">
        <p className="text-cosmic-400">
          {language === 'ru' ? 'Ошибка расчета нумерологии' : 'Error calculating numerology'}
        </p>
      </div>
    )
  }

  console.log('🎨 Rendering numerology data:', numerologyData)
  console.log('📊 Expression value in render:', numerologyData.expression)

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cosmic-100 mb-2">
            {language === 'ru' ? 'Нумерологический анализ' : 'Numerology Analysis'}
          </h2>
          <p className="text-cosmic-400">
            {language === 'ru' ? 'Полный анализ ваших чисел и их значений' : 'Complete analysis of your numbers and their meanings'}
          </p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center space-x-2 bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-700 hover:to-cosmic-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          <span>
            {isGeneratingPDF 
              ? (language === 'ru' ? 'Генерация...' : 'Generating...') 
              : (language === 'ru' ? 'Скачать PDF' : 'Download PDF')
            }
          </span>
        </button>
      </div>

      {/* Основные числа */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/50 transition-colors group"
          onClick={() => setShowLifePathDescription(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Число жизненного пути' : 'Life Path Number'}
          </h3>
          <div className="text-3xl font-bold text-cosmic-400 mb-2">
            {numerologyData.lifePath}
          </div>
          <p className="text-sm text-cosmic-300 mb-2">
            {getNumberDescription(numerologyData.lifePath, 'lifePath')}
          </p>
          <div className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/50 transition-colors group"
          onClick={() => setShowExpressionDescription(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Число выражения' : 'Expression Number'}
          </h3>
          <div className="text-3xl font-bold text-cosmic-400 mb-2">
            {numerologyData.expression !== undefined && numerologyData.expression !== null ? numerologyData.expression : 'N/A'}
          </div>
          <p className="text-sm text-cosmic-300 mb-2">
            {getNumberDescription(numerologyData.expression, 'expression')}
          </p>
          <div className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/50 transition-colors group"
          onClick={() => setShowSoulUrgeDescription(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Число души (день рождения)' : 'Soul Number (Birth Day)'}
          </h3>
          <div className="text-3xl font-bold text-cosmic-400 mb-2">
            {numerologyData.soulUrge}
          </div>
          <p className="text-sm text-cosmic-300 mb-2">
            {getNumberDescription(numerologyData.soulUrge, 'soulUrge')}
          </p>
          <div className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card text-center cursor-pointer hover:bg-space-700/50 transition-colors group"
          onClick={() => setShowPersonalityDescription(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="cosmic-subtitle text-lg mb-2">
            {language === 'ru' ? 'Число личности' : 'Personality Number'}
          </h3>
          <div className="text-3xl font-bold text-cosmic-400 mb-2">
            {numerologyData.personality}
          </div>
          <p className="text-sm text-cosmic-300 mb-2">
            {getNumberDescription(numerologyData.personality, 'personality')}
          </p>
          <div className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </div>
        </motion.div>
      </div>

      {/* Биоритмы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cosmic-card cursor-pointer hover:bg-space-700/50 transition-colors group"
        onClick={() => setShowBiorythmsDescription(true)}
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2 group-hover:text-cosmic-300 transition-colors">
          <TrendingUp className="w-5 h-5 text-cosmic-400 group-hover:scale-110 transition-transform" />
            {language === 'ru' ? 'Биоритмы' : 'Biorythms'}
          <span className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors ml-auto">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.biorythms.physical}%
            </div>
            <div className="text-sm text-cosmic-300 mb-2">
              {language === 'ru' ? 'Физический' : 'Physical'}
            </div>
            <div className="w-full bg-space-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.abs(numerologyData.biorythms.physical)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.biorythms.emotional}%
            </div>
            <div className="text-sm text-cosmic-300 mb-2">
              {language === 'ru' ? 'Эмоциональный' : 'Emotional'}
            </div>
            <div className="w-full bg-space-700 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.abs(numerologyData.biorythms.emotional)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.biorythms.intellectual}%
            </div>
            <div className="text-sm text-cosmic-300 mb-2">
              {language === 'ru' ? 'Интеллектуальный' : 'Intellectual'}
            </div>
            <div className="w-full bg-space-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.abs(numerologyData.biorythms.intellectual)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ежедневные метрики */}
      {numerologyData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DailyNumerologyMetrics
            lifePathNumber={numerologyData.lifePath}
            expressionNumber={numerologyData.expression}
            soulUrgeNumber={numerologyData.soulUrge}
            personalityNumber={numerologyData.personality}
            language={language}
          />
        </motion.div>
      )}

      {/* Дополнительная информация */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cosmic-card cursor-pointer hover:bg-space-700/50 transition-colors group"
        onClick={() => {
          console.log('🖱️ Additional numbers block clicked, setting showAdditionalNumbersDescription to true')
          setShowAdditionalNumbersDescription(true)
        }}
      >
        <h3 className="cosmic-subtitle text-xl mb-4 flex items-center gap-2 group-hover:text-cosmic-300 transition-colors">
          <Calendar className="w-5 h-5 text-cosmic-400 group-hover:scale-110 transition-transform" />
          {language === 'ru' ? 'Дополнительные числа' : 'Additional Numbers'}
          <span className="text-xs text-cosmic-500 group-hover:text-cosmic-400 transition-colors ml-auto">
            {language === 'ru' ? 'Нажмите для подробного описания' : 'Click for detailed description'}
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.dayNumber}
            </div>
            <div className="text-sm text-cosmic-300">
              {language === 'ru' ? 'Число дня' : 'Day Number'}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.monthNumber}
            </div>
            <div className="text-sm text-cosmic-300">
              {language === 'ru' ? 'Число месяца' : 'Month Number'}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg">
            <div className="text-2xl font-bold text-cosmic-400 mb-2">
              {numerologyData.yearNumber}
            </div>
            <div className="text-sm text-cosmic-300">
              {language === 'ru' ? 'Число года' : 'Year Number'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Life Path Description Modal */}
      <AnimatePresence>
        {showLifePathDescription && numerologyData && (
          <LifePathDescription
            number={numerologyData.lifePath}
            language={language}
            onClose={() => setShowLifePathDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Expression Description Modal */}
      <AnimatePresence>
        {showExpressionDescription && numerologyData && (
          <ExpressionDescription
            number={numerologyData.expression}
            language={language}
            onClose={() => setShowExpressionDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Soul Urge Description Modal */}
      <AnimatePresence>
        {showSoulUrgeDescription && numerologyData && (
          <SoulUrgeDescription
            number={numerologyData.soulUrge}
            language={language}
            onClose={() => setShowSoulUrgeDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Personality Description Modal */}
      <AnimatePresence>
        {showPersonalityDescription && numerologyData && (
          <PersonalityDescription
            number={numerologyData.personality}
            language={language}
            onClose={() => setShowPersonalityDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Biorythms Description Modal */}
      <AnimatePresence>
        {showBiorythmsDescription && numerologyData && (
          <BiorythmsDescription
            biorythms={numerologyData.biorythms}
            language={language}
            onClose={() => setShowBiorythmsDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Day Number Description Modal */}
      <AnimatePresence>
        {showDayNumberDescription && numerologyData && (
          <>
            {console.log('🎭 Rendering Day Number Modal with number:', numerologyData.dayNumber)}
            <AdditionalNumbersDescription
              number={numerologyData.dayNumber}
              type="day"
              language={language}
              onClose={() => {
                console.log('🎭 Closing Day Number Modal')
                setShowDayNumberDescription(false)
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Month Number Description Modal */}
      <AnimatePresence>
        {showMonthNumberDescription && numerologyData && (
          <AdditionalNumbersDescription
            number={numerologyData.monthNumber}
            type="month"
            language={language}
            onClose={() => setShowMonthNumberDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Year Number Description Modal */}
      <AnimatePresence>
        {showYearNumberDescription && numerologyData && (
          <AdditionalNumbersDescription
            number={numerologyData.yearNumber}
            type="year"
            language={language}
            onClose={() => setShowYearNumberDescription(false)}
          />
        )}
      </AnimatePresence>

      {/* Additional Numbers Block Description Modal */}
      <AnimatePresence>
        {showAdditionalNumbersDescription && numerologyData && (
          <>
            {console.log('🎭 Rendering Additional Numbers Block Modal with data:', numerologyData)}
            <AdditionalNumbersBlockDescription
              numerologyData={{
                dayNumber: numerologyData.dayNumber,
                monthNumber: numerologyData.monthNumber,
                yearNumber: numerologyData.yearNumber
              }}
              language={language}
              onClose={() => {
                console.log('🎭 Closing Additional Numbers Block Modal')
                setShowAdditionalNumbersDescription(false)
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}