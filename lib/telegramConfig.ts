// lib/telegramConfig.ts

// Конфигурация Telegram бота
export const TELEGRAM_CONFIG = {
  // Токен бота
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  
  // URL вашего приложения
  webAppUrl: process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://your-domain.com',
  
  // Настройки бота
  botName: 'BodyGraph Bot',
  botDescription: 'Астрологический и нумерологический анализ',
  botUsername: 'your_bot_username', // Замените на реальный username
  
  // Команды бота
  commands: [
    { command: 'start', description: 'Начать работу с ботом' },
    { command: 'help', description: 'Помощь по командам' },
    { command: 'profile', description: 'Управление профилем' },
    { command: 'numerology', description: 'Нумерологический анализ' },
    { command: 'astrology', description: 'Астрологический анализ' },
    { command: 'humandesign', description: 'Human Design анализ' }
  ],
  
  // Сообщения
  messages: {
    welcome: `🌟 Добро пожаловать в BodyGraph Bot!

Я помогу вам узнать больше о себе через:
• 🔢 Нумерологию
• ♈ Астрологию  
• 🧬 Human Design

Выберите действие:`,
    
    help: `📚 Доступные команды:

/start - Начать работу
/profile - Создать или изменить профиль
/numerology - Нумерологический анализ
/astrology - Астрологический анализ
/humandesign - Human Design анализ
/help - Эта справка

Для начала создайте профиль командой /profile`,

    profileCreated: `✅ Профиль создан!

Теперь вы можете:
• 🔢 Получить нумерологический анализ
• ♈ Рассчитать натальную карту
• 🧬 Узнать свой Human Design

Выберите интересующий анализ:`,
    
    error: `❌ Произошла ошибка. Попробуйте позже или обратитесь к администратору.`
  }
}

// Функция для проверки токена
export function validateTelegramToken(): boolean {
  const token = TELEGRAM_CONFIG.botToken
  return !!(token && token.length > 0 && token.includes(':'))
}

// Функция для получения URL бота
export function getBotUrl(): string {
  const token = TELEGRAM_CONFIG.botToken
  const username = TELEGRAM_CONFIG.botUsername
  return `https://t.me/${username}`
}

// Функция для получения API URL
export function getBotApiUrl(): string {
  const token = TELEGRAM_CONFIG.botToken
  return `https://api.telegram.org/bot${token}`
}
