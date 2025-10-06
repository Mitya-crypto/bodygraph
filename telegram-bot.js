require('dotenv').config({ path: '.env.local' })

const TelegramBot = require('node-telegram-bot-api')

// Конфигурация бота
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8296309758:AAFgJTxZ_Sc6qmOTGMwjab9V6LvkhhTlYm4'
const PORT = process.env.PORT || 3001
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || `https://your-domain.com/webhook`

// Создаем экземпляр бота с улучшенными настройками
const bot = new TelegramBot(BOT_TOKEN, { 
  polling: {
    interval: 1000,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
})

console.log('🤖 Telegram Bot запущен на порту', PORT)
console.log('📱 Bot Token:', BOT_TOKEN.substring(0, 10) + '...')

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  const firstName = msg.from.first_name || 'Пользователь'
  
  const welcomeMessage = `👋 Привет, ${firstName}!

🌌 Добро пожаловать в <b>Cosmic BodyGraph</b> - приложение для космического анализа личности!

🔮 <b>Что я умею:</b>
• 📊 Нумерология - расчет жизненного пути и персональных чисел
• 🧬 Human Design - анализ энергетического типа и стратегии
• ⭐ Астрология - натальные карты и транзиты планет

🚀 <b>Как начать:</b>
1. Нажми /profile чтобы создать свой профиль
2. Используй /modules для выбора анализа
3. Получи персональный космический отчет!

💫 <b>Доступные команды:</b>
/profile - создать или редактировать профиль
/modules - выбрать модуль анализа
/help - получить помощь

<i>Начни свое космическое путешествие прямо сейчас!</i>`

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' })
})

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  
  const helpMessage = `🆘 <b>Помощь по использованию бота</b>

📋 <b>Основные команды:</b>
/start - начать работу с ботом
/profile - управление профилем
/modules - выбор модулей анализа
/help - эта справка

🔮 <b>Модули анализа:</b>

<b>📊 Нумерология:</b>
• Число жизненного пути
• Число выражения
• Число души
• Число личности
• Биоритмы и ежедневные метрики

<b>🧬 Human Design:</b>
• Энергетический тип (Generator, Projector, Manifestor, Reflector)
• Стратегия принятия решений
• Внутренний авторитет
• Профиль и определение
• Инкарнационный крест

<b>⭐ Астрология:</b>
• Натальная карта
• Позиции планет
• Дома и знаки
• Транзиты планет
• Аспекты и их влияние

💡 <b>Советы:</b>
• Для точного анализа укажите точное время и место рождения
• Результаты обновляются автоматически при изменении профиля
• Все данные сохраняются локально и не передаются третьим лицам

<i>Нужна дополнительная помощь? Напишите /start</i>`

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' })
})

// Команда /profile
bot.onText(/\/profile/, (msg) => {
  const chatId = msg.chat.id
  
  const profileMessage = `👤 <b>Управление профилем</b>

📝 <b>Для создания профиля нужны:</b>
• Полное имя
• Дата рождения (ГГГГ-ММ-ДД)
• Время рождения (ЧЧ:ММ)
• Место рождения (город, страна)

🌍 <b>Поиск места рождения:</b>
Используйте точные названия городов или координаты для максимальной точности расчетов.

📱 <b>Создать профиль:</b>
Откройте приложение по ссылке и заполните форму регистрации.

🔗 <b>Ссылка на приложение:</b>
<a href="http://localhost:${PORT}">Открыть Cosmic BodyGraph</a>

<i>После создания профиля вернитесь к боту для получения результатов анализа!</i>`

  bot.sendMessage(chatId, profileMessage, { 
    parse_mode: 'HTML',
    disable_web_page_preview: true
  })
})

// Команда /modules
bot.onText(/\/modules/, (msg) => {
  const chatId = msg.chat.id
  
  const modulesMessage = `🔮 <b>Модули космического анализа</b>

<b>📊 Нумерология</b>
Анализ чисел в вашей жизни:
• Жизненный путь и предназначение
• Способы самовыражения
• Душевные стремления
• Внешняя личность
• Ежедневные энергетические циклы

<b>🧬 Human Design</b>
Энергетическая карта вашего тела:
• Тип: как вы взаимодействуете с миром
• Стратегия: как принимать решения
• Авторитет: как доверять себе
• Профиль: ваша роль в жизни
• Центры: активные и неактивные энергии

<b>⭐ Астрология</b>
Космическая карта рождения:
• Позиции планет в знаках
• Дома и их значения
• Транзиты и текущие влияния
• Аспекты между планетами
• Временные циклы и возможности

🔗 <b>Начать анализ:</b>
<a href="http://localhost:${PORT}/modules">Выбрать модуль</a>

<i>Каждый модуль дает уникальный взгляд на вашу космическую сущность!</i>`

  bot.sendMessage(chatId, modulesMessage, { 
    parse_mode: 'HTML',
    disable_web_page_preview: true
  })
})

// Обработка всех остальных сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id
  const text = msg.text
  
  // Игнорируем команды (они обрабатываются отдельно)
  if (text && text.startsWith('/')) {
    return
  }
  
  // Обработка обычных сообщений
  const responseMessage = `🤖 Спасибо за сообщение!

💡 <b>Полезные команды:</b>
/start - начать работу
/profile - управление профилем  
/modules - выбор анализа
/help - получить помощь

🔗 <b>Открыть приложение:</b>
<a href="http://localhost:${PORT}">Cosmic BodyGraph</a>

<i>Используйте команды для навигации по функциям бота!</i>`

  bot.sendMessage(chatId, responseMessage, { 
    parse_mode: 'HTML',
    disable_web_page_preview: true
  })
})

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error.message)
  // Попробуем перезапустить polling через 5 секунд
  setTimeout(() => {
    console.log('🔄 Перезапуск polling...')
    bot.stopPolling()
    setTimeout(() => {
      bot.startPolling()
      console.log('✅ Polling перезапущен успешно')
    }, 2000)
  }, 5000)
})

bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error.message)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка бота...')
  bot.stopPolling()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Остановка бота...')
  bot.stopPolling()
  process.exit(0)
})

console.log('✅ Telegram Bot успешно запущен!')
console.log('📡 Polling режим активен')
console.log('🔗 Приложение доступно на http://localhost:' + PORT)
