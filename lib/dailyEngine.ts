import { UserData, DailyMetric, AstrologyResult } from './types';

/**
 * Рассчитывает ежедневные метрики для пользователя
 */
export async function calculateDailyMetrics(userData: UserData, astrologyData?: AstrologyResult): Promise<DailyMetric[]> {
  try {
    console.log('Расчет ежедневных метрик для:', userData.name);
    
    const today = new Date();
    const metrics: DailyMetric[] = [];
    
    // Генерируем метрики на ближайшие 7 дней
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const metric: DailyMetric = {
        date: date.toISOString().split('T')[0],
        aspect: `День ${i + 1}`,
        impact: `Влияние на день ${i + 1}`,
        numerology: {
          personalYear: calculatePersonalYear(userData.birthDate, date),
          personalMonth: calculatePersonalMonth(userData.birthDate, date),
          personalDay: calculatePersonalDay(userData.birthDate, date),
          universalDay: calculateUniversalDay(date)
        },
        humanDesign: {
          gates: [`Gate ${(i + 1) * 7}`],
          channels: [`Channel ${i + 1}`],
          centers: ['G-центр', 'S-центр']
        },
        astrology: {
          transits: [{
            planet: 'Луна',
            sign: 'Овен',
            aspect: 'Трин'
          }],
          lunarPhase: 'Новолуние'
        }
      };
      
      metrics.push(metric);
    }
    
    return metrics;
  } catch (error) {
    console.error('Ошибка расчета ежедневных метрик:', error);
    throw error;
  }
}

/**
 * Рассчитывает персональный год
 */
function calculatePersonalYear(birthDate: string, targetDate: Date): number {
  const birth = new Date(birthDate);
  const birthMonth = birth.getMonth() + 1;
  const birthDay = birth.getDate();
  
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();
  
  let year = targetDate.getFullYear();
  if (targetMonth < birthMonth || (targetMonth === birthMonth && targetDay < birthDay)) {
    year--;
  }
  
  return reduceToSingleDigit(year + birthMonth + birthDay);
}

/**
 * Рассчитывает персональный месяц
 */
function calculatePersonalMonth(birthDate: string, targetDate: Date): number {
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  const month = targetDate.getMonth() + 1;
  
  return reduceToSingleDigit(personalYear + month);
}

/**
 * Рассчитывает персональный день
 */
function calculatePersonalDay(birthDate: string, targetDate: Date): number {
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  const day = targetDate.getDate();
  
  return reduceToSingleDigit(personalMonth + day);
}

/**
 * Рассчитывает универсальный день
 */
function calculateUniversalDay(targetDate: Date): number {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  
  return reduceToSingleDigit(year + month + day);
}

/**
 * Сводит число к одной цифре (кроме мастер-чисел 11, 22, 33)
 */
function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = Math.floor(num / 10) + (num % 10);
  }
  return num;
}
