import { UserData, AstrologyResult } from './types';
import { calculateAstrology as calculateAstrologyOriginal, AstrologyResult as OriginalResult } from './astrology';

/**
 * Адаптер для существующей функции астрологии
 */
export async function calculateAstrology(userData: UserData): Promise<AstrologyResult> {
  try {
    console.log('Расчет астрологии для:', userData.name);
    
    // Преобразуем UserData в формат, ожидаемый существующей функцией
    const birthData = {
      date: userData.birthDate,
      time: userData.birthTime,
      latitude: userData.birthLocation.latitude,
      longitude: userData.birthLocation.longitude,
      timezone: userData.birthLocation.timezone
    };
    
    // Вызываем существующую функцию
    const originalResult = await calculateAstrologyOriginal(birthData);
    
    // Преобразуем результат в новый формат
    const result: AstrologyResult = {
      sunSign: originalResult.sun.sign,
      moonSign: originalResult.moon.sign,
      ascendant: originalResult.ascendant.sign,
      housePlacements: createHousePlacements(originalResult.planets),
      aspects: createAspects(originalResult.planets),
      description: `Астрологический профиль для ${userData.name}`,
      detailedAnalysis: {
        sun: getSunDescription(originalResult.sun.sign),
        moon: getMoonDescription(originalResult.moon.sign),
        ascendant: getAscendantDescription(originalResult.ascendant.sign),
        houses: getHousesDescription(originalResult.houses)
      }
    };
    
    return result;
  } catch (error) {
    console.error('Ошибка расчета астрологии:', error);
    throw error;
  }
}

/**
 * Создает размещения по домам
 */
function createHousePlacements(planets: any[]): Record<string, string> {
  const placements: Record<string, string> = {};
  
  planets.forEach(planet => {
    placements[planet.name] = `${planet.sign} (${planet.house} дом)`;
  });
  
  return placements;
}

/**
 * Создает аспекты между планетами
 */
function createAspects(planets: any[]): Array<{planet1: string; planet2: string; aspect: string; orb: number}> {
  const aspects: Array<{planet1: string; planet2: string; aspect: string; orb: number}> = [];
  
  // Простая логика для создания аспектов
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      const orb = Math.abs(planet1.degree - planet2.degree);
      
      if (orb <= 8) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: 'Соединение',
          orb: orb
        });
      } else if (orb >= 52 && orb <= 68) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: 'Секстиль',
          orb: orb
        });
      } else if (orb >= 112 && orb <= 128) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: 'Трин',
          orb: orb
        });
      } else if (orb >= 172 && orb <= 188) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: 'Оппозиция',
          orb: orb
        });
      }
    }
  }
  
  return aspects;
}

/**
 * Получает описание Солнца
 */
function getSunDescription(sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Овен': 'Солнце в Овне дарует энергию, лидерство и инициативу.',
    'Телец': 'Солнце в Тельце приносит стабильность, практичность и чувственность.',
    'Близнецы': 'Солнце в Близнецах дает коммуникабельность, любознательность и гибкость.',
    'Рак': 'Солнце в Раке наделяет эмоциональностью, интуицией и заботливостью.',
    'Лев': 'Солнце во Льве дарует творчество, гордость и естественное лидерство.',
    'Дева': 'Солнце в Деве приносит аналитичность, перфекционизм и служение.',
    'Весы': 'Солнце в Весах дает дипломатичность, гармонию и партнерство.',
    'Скорпион': 'Солнце в Скорпионе наделяет глубиной, трансформацией и страстью.',
    'Стрелец': 'Солнце в Стрельце дарует философию, приключения и оптимизм.',
    'Козерог': 'Солнце в Козероге приносит амбиции, дисциплину и ответственность.',
    'Водолей': 'Солнце в Водолее дает оригинальность, гуманизм и независимость.',
    'Рыбы': 'Солнце в Рыбах наделяет интуицией, состраданием и духовностью.'
  };
  
  return descriptions[sign] || `Солнце в знаке ${sign} придает особые качества личности.`;
}

/**
 * Получает описание Луны
 */
function getMoonDescription(sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Овен': 'Луна в Овне делает эмоции импульсивными и энергичными.',
    'Телец': 'Луна в Тельце создает стабильные и комфортные эмоции.',
    'Близнецы': 'Луна в Близнецах делает эмоции изменчивыми и коммуникативными.',
    'Рак': 'Луна в Раке создает глубокие и интуитивные эмоции.',
    'Лев': 'Луна во Льве делает эмоции драматичными и творческими.',
    'Дева': 'Луна в Деве создает аналитические и практичные эмоции.',
    'Весы': 'Луна в Весах делает эмоции гармоничными и партнерскими.',
    'Скорпион': 'Луна в Скорпионе создает интенсивные и трансформирующие эмоции.',
    'Стрелец': 'Луна в Стрельце делает эмоции оптимистичными и философскими.',
    'Козерог': 'Луна в Козероге создает сдержанные и ответственные эмоции.',
    'Водолей': 'Луна в Водолее делает эмоции независимыми и оригинальными.',
    'Рыбы': 'Луна в Рыбах создает чувствительные и интуитивные эмоции.'
  };
  
  return descriptions[sign] || `Луна в знаке ${sign} влияет на эмоциональную природу.`;
}

/**
 * Получает описание Асцендента
 */
function getAscendantDescription(sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Овен': 'Асцендент в Овне делает вас энергичным и инициативным в глазах других.',
    'Телец': 'Асцендент в Тельце создает впечатление стабильного и надежного человека.',
    'Близнецы': 'Асцендент в Близнецах делает вас общительным и любознательным.',
    'Рак': 'Асцендент в Раке создает впечатление заботливого и эмоционального человека.',
    'Лев': 'Асцендент во Льве делает вас ярким и творческим в глазах других.',
    'Дева': 'Асцендент в Деве создает впечатление практичного и аналитичного человека.',
    'Весы': 'Асцендент в Весах делает вас дипломатичным и гармоничным.',
    'Скорпион': 'Асцендент в Скорпионе создает впечатление загадочного и интенсивного человека.',
    'Стрелец': 'Асцендент в Стрельце делает вас оптимистичным и философским.',
    'Козерог': 'Асцендент в Козероге создает впечатление серьезного и амбициозного человека.',
    'Водолей': 'Асцендент в Водолее делает вас оригинальным и независимым.',
    'Рыбы': 'Асцендент в Рыбах создает впечатление чувствительного и интуитивного человека.'
  };
  
  return descriptions[sign] || `Асцендент в знаке ${sign} влияет на то, как вас воспринимают другие.`;
}

/**
 * Получает описание домов
 */
function getHousesDescription(houses: any[]): string {
  if (!houses || houses.length === 0) {
    return 'Информация о домах недоступна.';
  }
  
  const houseDescriptions = houses.map(house => 
    `${house.number} дом: ${house.sign}`
  ).join(', ');
  
  return `Расположение домов: ${houseDescriptions}. Каждый дом представляет определенную сферу жизни.`;
}
