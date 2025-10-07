// Тип для входных данных пользователя
export interface UserData {
  name: string;
  birthDate: string; // Формат 'YYYY-MM-DD'
  birthTime: string; // Формат 'HH:MM'
  birthLocation: {
    latitude: number;
    longitude: number;
    timezone: string; // Например, 'Europe/Moscow'
  };
}

// Общий тип для результатов
export interface BodyGraphResult {
  numerology: NumerologyResult;
  humanDesign: HumanDesignResult;
  astrology: AstrologyResult;
  dailyMetrics: DailyMetric[];
}

// Пример результатов
export interface NumerologyResult {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  challengeNumbers: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  pinnacleNumbers: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  description: string;
  detailedAnalysis: {
    lifePath: string;
    expression: string;
    soulUrge: string;
    personality: string;
  };
}

export interface HumanDesignResult {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  definition: string;
  incarnationCross: string;
  centers: {
    defined: string[];
    undefined: string[];
  };
  channels: string[];
  gates: string[];
  description: string;
  detailedAnalysis: {
    type: string;
    strategy: string;
    authority: string;
    profile: string;
  };
}

export interface AstrologyResult {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  housePlacements: Record<string, string>; // Планета: Знак/Дом
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
  description: string;
  detailedAnalysis: {
    sun: string;
    moon: string;
    ascendant: string;
    houses: string;
  };
}

export interface DailyMetric {
  date: string;
  aspect: string; // Например, "Луна в Козероге"
  impact: string; // Влияние на пользователя
  numerology: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
    universalDay: number;
  };
  humanDesign: {
    gates: string[];
    channels: string[];
    centers: string[];
  };
  astrology: {
    transits: Array<{
      planet: string;
      sign: string;
      aspect: string;
    }>;
    lunarPhase: string;
  };
}

// Типы для ошибок
export interface CalculationError {
  module: 'numerology' | 'humanDesign' | 'astrology' | 'daily';
  error: string;
  details?: any;
}

export interface CalculationResult {
  success: boolean;
  data?: BodyGraphResult;
  errors?: CalculationError[];
}

// Типы для кэширования
export interface CacheEntry {
  data: BodyGraphResult;
  timestamp: number;
  userHash: string;
}

export interface CacheOptions {
  ttl: number; // Time to live в миллисекундах
  maxSize: number; // Максимальный размер кэша
}
