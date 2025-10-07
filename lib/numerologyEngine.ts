import { UserData, NumerologyResult } from './types';
import { calculateNumerology as calculateNumerologyOriginal, NumerologyResult as OriginalResult } from './numerology';

/**
 * Адаптер для существующей функции нумерологии
 */
export async function calculateNumerology(userData: UserData): Promise<NumerologyResult> {
  try {
    console.log('Расчет нумерологии для:', userData.name);
    
    // Преобразуем UserData в формат, ожидаемый существующей функцией
    const birthDate = userData.birthDate;
    const fullName = userData.name;
    
    // Вызываем существующую функцию
    const originalResult = calculateNumerologyOriginal(fullName, birthDate);
    
    // Преобразуем результат в новый формат
    const result: NumerologyResult = {
      lifePathNumber: originalResult.lifePath,
      expressionNumber: originalResult.expression,
      soulUrgeNumber: originalResult.soulUrge,
      personalityNumber: originalResult.personality,
      maturityNumber: calculateMaturityNumber(originalResult.lifePath),
      challengeNumbers: calculateChallengeNumbers(originalResult.lifePath),
      pinnacleNumbers: calculatePinnacleNumbers(originalResult.lifePath),
      description: `Нумерологический профиль для ${userData.name}`,
      detailedAnalysis: {
        lifePath: getLifePathDescription(originalResult.lifePath),
        expression: getExpressionDescription(originalResult.expression),
        soulUrge: getSoulUrgeDescription(originalResult.soulUrge),
        personality: getPersonalityDescription(originalResult.personality)
      }
    };
    
    return result;
  } catch (error) {
    console.error('Ошибка расчета нумерологии:', error);
    throw error;
  }
}

/**
 * Рассчитывает число зрелости
 */
function calculateMaturityNumber(lifePath: number): number {
  // Число зрелости = жизненный путь + выражение
  return reduceToSingleDigit(lifePath + 5); // Примерная логика
}

/**
 * Рассчитывает числа вызовов
 */
function calculateChallengeNumbers(lifePath: number) {
  const first = reduceToSingleDigit(lifePath + 1);
  const second = reduceToSingleDigit(lifePath + 2);
  const third = reduceToSingleDigit(lifePath + 3);
  const fourth = reduceToSingleDigit(lifePath + 4);
  
  return { first, second, third, fourth };
}

/**
 * Рассчитывает числа пиков
 */
function calculatePinnacleNumbers(lifePath: number) {
  const first = reduceToSingleDigit(lifePath + 5);
  const second = reduceToSingleDigit(lifePath + 6);
  const third = reduceToSingleDigit(lifePath + 7);
  const fourth = reduceToSingleDigit(lifePath + 8);
  
  return { first, second, third, fourth };
}

/**
 * Сводит число к одной цифре
 */
function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = Math.floor(num / 10) + (num % 10);
  }
  return num;
}

/**
 * Получает описание жизненного пути
 */
function getLifePathDescription(lifePath: number): string {
  const descriptions: { [key: number]: string } = {
    1: 'Лидер и первопроходец. Ваша миссия - быть пионером и вести других.',
    2: 'Дипломат и миротворец. Ваша сила в сотрудничестве и гармонии.',
    3: 'Творец и коммуникатор. Вы призваны вдохновлять и радовать других.',
    4: 'Строитель и организатор. Ваша задача - создавать стабильность и порядок.',
    5: 'Исследователь и авантюрист. Вы стремитесь к свободе и новому опыту.',
    6: 'Попечитель и целитель. Ваше призвание - заботиться и исцелять.',
    7: 'Философ и мистик. Вы ищете истину и духовное понимание.',
    8: 'Лидер и материалист. Ваша цель - достижение и успех.',
    9: 'Гуманист и мудрец. Вы призваны служить человечеству.',
    11: 'Интуитивный учитель. Вы обладаете особой духовной миссией.',
    22: 'Мастер-строитель. Вы можете воплотить великие идеи в реальность.',
    33: 'Мастер-целитель. Ваша миссия - исцелять и вдохновлять человечество.'
  };
  
  return descriptions[lifePath] || 'Уникальный жизненный путь с особыми задачами.';
}

/**
 * Получает описание числа выражения
 */
function getExpressionDescription(expression: number): string {
  const descriptions: { [key: number]: string } = {
    1: 'Выражаетесь через лидерство и оригинальность.',
    2: 'Выражаетесь через сотрудничество и дипломатию.',
    3: 'Выражаетесь через творчество и коммуникацию.',
    4: 'Выражаетесь через практичность и организованность.',
    5: 'Выражаетесь через свободу и разнообразие.',
    6: 'Выражаетесь через заботу и ответственность.',
    7: 'Выражаетесь через анализ и духовность.',
    8: 'Выражаетесь через достижения и авторитет.',
    9: 'Выражаетесь через служение и мудрость.'
  };
  
  return descriptions[expression] || 'Уникальный способ самовыражения.';
}

/**
 * Получает описание числа душевного побуждения
 */
function getSoulUrgeDescription(soulUrge: number): string {
  const descriptions: { [key: number]: string } = {
    1: 'Ваша душа стремится к независимости и лидерству.',
    2: 'Ваша душа жаждет гармонии и партнерства.',
    3: 'Ваша душа ищет творческое самовыражение.',
    4: 'Ваша душа стремится к стабильности и порядку.',
    5: 'Ваша душа жаждет свободы и приключений.',
    6: 'Ваша душа ищет любовь и заботу о других.',
    7: 'Ваша душа стремится к пониманию и истине.',
    8: 'Ваша душа жаждет успеха и признания.',
    9: 'Ваша душа ищет служение и сострадание.'
  };
  
  return descriptions[soulUrge] || 'Ваша душа имеет особые стремления.';
}

/**
 * Получает описание числа личности
 */
function getPersonalityDescription(personality: number): string {
  const descriptions: { [key: number]: string } = {
    1: 'Вас воспринимают как сильного и независимого лидера.',
    2: 'Вас видят как дипломатичного и отзывчивого человека.',
    3: 'Вас воспринимают как творческого и общительного.',
    4: 'Вас видят как надежного и практичного человека.',
    5: 'Вас воспринимают как динамичного и авантюрного.',
    6: 'Вас видят как заботливого и ответственного.',
    7: 'Вас воспринимают как глубокого и аналитичного.',
    8: 'Вас видят как амбициозного и успешного.',
    9: 'Вас воспринимают как мудрого и сострадательного.'
  };
  
  return descriptions[personality] || 'Вас воспринимают уникальным образом.';
}
