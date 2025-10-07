import { UserData, BodyGraphResult, CalculationResult, CalculationError, NumerologyResult, HumanDesignResult, AstrologyResult, DailyMetric } from './types';
import { calculateNumerology } from './numerologyEngine';
import { calculateHumanDesign } from './humanDesignEngine';
import { calculateAstrology } from './astrologyEngine';
import { calculateDailyMetrics } from './dailyEngine';

// Кэш для результатов расчетов
const calculationCache = new Map<string, BodyGraphResult>();

/**
 * Основная функция для расчета полного Бодиграфа.
 * @param userData - Данные о рождении пользователя.
 * @returns Полный BodyGraphResult с обработкой ошибок и кэшированием.
 */
export async function calculateBodyGraph(userData: UserData): Promise<CalculationResult> {
  try {
    const { birthDate, birthTime, birthLocation } = userData;
    
    // Генерируем уникальный хэш пользователя для кэширования
    const userHash = generateUserHash(userData);
    
    // Проверяем кэш
    const cached = calculationCache.get(userHash);
    if (cached) {
      console.log('Используем кэшированные данные для пользователя:', userData.name);
      return { success: true, data: cached };
    }

    console.log('Начинаем расчет BodyGraph для:', userData.name);
    const startTime = Date.now();

    const errors: CalculationError[] = [];
    let numerology: NumerologyResult, humanDesign: HumanDesignResult, astrology: AstrologyResult, dailyMetrics: DailyMetric[];

    // 1. Расчет Нумерологии (самый простой, может быть полностью реализован внутри)
    try {
      console.log('Расчет нумерологии...');
      numerology = await calculateNumerology(userData);
      console.log('Нумерология рассчитана успешно');
    } catch (error) {
      console.error('Ошибка нумерологии:', error);
      errors.push({
        module: 'numerology',
        error: 'Failed to calculate numerology',
        details: error
      });
      numerology = getFallbackNumerology(userData);
    }

    // 2. Расчет Астрологии (требует точных данных о времени/месте)
    // Это, вероятно, потребует вызова внешнего API (надежнее всего!)
    try {
      console.log('Расчет астрологии...');
      astrology = await calculateAstrology(userData);
      console.log('Астрология рассчитана успешно');
    } catch (error) {
      console.error('Ошибка астрологии:', error);
      errors.push({
        module: 'astrology',
        error: 'Failed to calculate astrology',
        details: error
      });
      astrology = getFallbackAstrology(userData);
    }

    // 3. Расчет Хьюман Дизайна (зависит от точных астрологических данных)
    // Тоже часто требует API
    try {
      console.log('Расчет Human Design на основе астрологических данных...');
      humanDesign = await calculateHumanDesign(userData, astrology);
      console.log('Human Design рассчитан успешно');
    } catch (error) {
      console.error('Ошибка Human Design:', error);
      errors.push({
        module: 'humanDesign',
        error: 'Failed to calculate Human Design',
        details: error
      });
      humanDesign = getFallbackHumanDesign(userData);
    }

    // 4. Ежедневные метрики (транзиты)
    try {
      console.log('Расчет ежедневных метрик...');
      dailyMetrics = await calculateDailyMetrics(userData, astrology);
      console.log('Ежедневные метрики рассчитаны успешно');
    } catch (error) {
      console.error('Ошибка ежедневных метрик:', error);
      errors.push({
        module: 'daily',
        error: 'Failed to calculate daily metrics',
        details: error
      });
      dailyMetrics = [];
    }

    const result: BodyGraphResult = {
      numerology,
      humanDesign,
      astrology,
      dailyMetrics
    };

    // Кэшируем результат
    calculationCache.set(userHash, result);
    
    // Очищаем старые записи из кэша (если больше 100 записей)
    if (calculationCache.size > 100) {
      const oldestKey = calculationCache.keys().next().value;
      calculationCache.delete(oldestKey);
    }

    const calculationTime = Date.now() - startTime;
    console.log(`Расчет завершен за ${calculationTime}ms`);

    return {
      success: true,
      data: result,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Критическая ошибка в calculateBodyGraph:', error);
    return {
      success: false,
      errors: [{
        module: 'numerology',
        error: 'Critical calculation error',
        details: error
      }]
    };
  }
}

/**
 * Генерирует уникальный хэш для пользователя
 */
function generateUserHash(userData: UserData): string {
  const dataString = `${userData.name}-${userData.birthDate}-${userData.birthTime}-${userData.birthLocation.latitude}-${userData.birthLocation.longitude}`;
  return btoa(dataString).replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Fallback данные для нумерологии
 */
function getFallbackNumerology(userData: UserData) {
  const birthDate = new Date(userData.birthDate);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  return {
    lifePathNumber: 1,
    expressionNumber: 1,
    soulUrgeNumber: 1,
    personalityNumber: 1,
    maturityNumber: 1,
    challengeNumbers: { first: 1, second: 1, third: 1, fourth: 1 },
    pinnacleNumbers: { first: 1, second: 1, third: 1, fourth: 1 },
    description: 'Базовые нумерологические данные',
    detailedAnalysis: {
      lifePath: 'Путь лидера и первопроходца',
      expression: 'Творческое самовыражение',
      soulUrge: 'Внутренние желания души',
      personality: 'Как вас видят другие'
    }
  };
}

/**
 * Fallback данные для Human Design
 */
function getFallbackHumanDesign(userData: UserData) {
  return {
    type: 'Генератор',
    strategy: 'Ждать и отвечать',
    authority: 'Сакральная',
    profile: '1/3',
    definition: 'Одинарное определение',
    incarnationCross: 'Крест Завершения',
    centers: {
      defined: ['G-центр', 'S-центр'],
      undefined: ['T-центр', 'H-центр', 'E-центр', 'A-центр', 'P-центр', 'L-центр', 'R-центр']
    },
    channels: [],
    gates: [],
    description: 'Базовые данные Human Design',
    detailedAnalysis: {
      type: 'Тип Генератора',
      strategy: 'Стратегия ожидания',
      authority: 'Сакральная авторитет',
      profile: 'Профиль исследователя-мученика'
    }
  };
}

/**
 * Fallback данные для астрологии
 */
function getFallbackAstrology(userData: UserData) {
  const birthDate = new Date(userData.birthDate);
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // Простое определение знака зодиака
  const zodiacSigns = [
    'Козерог', 'Водолей', 'Рыбы', 'Овен', 'Телец', 'Близнецы',
    'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец'
  ];
  
  const signIndex = month - 1;
  
  return {
    sunSign: zodiacSigns[signIndex] || 'Овен',
    moonSign: 'Луна',
    ascendant: 'Асцендент',
    housePlacements: {
      'Солнце': zodiacSigns[signIndex] || 'Овен',
      'Луна': 'Луна',
      'Меркурий': 'Меркурий'
    },
    aspects: [],
    description: 'Базовые астрологические данные',
    detailedAnalysis: {
      sun: `Солнце в знаке ${zodiacSigns[signIndex] || 'Овен'}`,
      moon: 'Луна в знаке',
      ascendant: 'Асцендент',
      houses: 'Расположение домов'
    }
  };
}

/**
 * Очищает кэш расчетов
 */
export function clearCalculationCache(): void {
  calculationCache.clear();
  console.log('Кэш расчетов очищен');
}

/**
 * Получает статистику кэша
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: calculationCache.size,
    entries: Array.from(calculationCache.keys())
  };
}
