# BodyGraph Integration Guide

## 🎯 Обзор интеграции

Приложение BodyGraph теперь интегрировано с:
- **n8n** - автоматизация workflow'ов
- **ChatGPT** - AI ассистент для премиум пользователей
- **Система подписок** - бесплатный и премиум планы

## 🔧 Настройка переменных окружения

Добавьте в `.env.local`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# n8n Integration
N8N_API_TOKEN=your_n8n_api_token_here
N8N_BASE_URL=http://localhost:5678

# ChatGPT Integration
OPENAI_API_KEY=your_openai_api_key_here

# Astrology API
ASTROLOGY_API_URL=http://localhost:3001/api/astrology-simple

# Human Design API
HUMAN_DESIGN_API_KEY=your_human_design_api_key_here
HUMAN_DESIGN_API_URL=https://api.humandesignapi.nl

# Environment
NODE_ENV=development
NEXT_PUBLIC_WEBAPP_URL=http://localhost:3001
```

## 🎭 Система подписок

### Бесплатный план
- ✅ Основные числа нумерологии
- ✅ Базовый Human Design
- ✅ Ключевые планеты
- ✅ Краткие интерпретации (3-4 абзаца)
- ✅ 3 практических совета
- ✅ Базовый AI ассистент

### Премиум план (999 ₽/месяц)
- ✅ Все возможности бесплатного плана
- ✅ Расширенные отчеты (до 8 страниц)
- ✅ Полная психоматрица и биоритмы
- ✅ Детальный Human Design
- ✅ Полная натальная карта
- ✅ Транзиты и прогрессии
- ✅ Синастрия пар
- ✅ Экспорт в PDF
- ✅ Персонализированные медитации
- ✅ **ChatGPT-5 ассистент**
- ✅ Ежедневные персональные советы
- ✅ Генерация аффирмаций
- ✅ Неограниченные вопросы к AI

## 🤖 ChatGPT Integration

### Настройка
1. Получите API ключ от OpenAI
2. Добавьте `OPENAI_API_KEY` в `.env.local`
3. Перезапустите приложение

### Возможности
- **Бесплатная версия**: GPT-3.5, базовые ответы
- **Премиум версия**: GPT-4, персональные инсайты

### Промт
Используется профессиональный промт из `prompts/chatgpt-assistant-prompt.md`:
- Космический консультант
- Специалист по нумерологии, Human Design, астрологии
- Персонализированные ответы
- Практические советы

## 🔄 n8n Workflow Integration

### Workflow 1: Бесплатный анализ
- **URL**: `/free-analysis`
- **Вход**: Профиль пользователя
- **Выход**: Базовый анализ (нумерология, HD, астрология)

### Workflow 2: Премиум анализ
- **URL**: `/premium-analysis`
- **Вход**: Профиль пользователя + подписка
- **Выход**: Расширенный анализ + ChatGPT инсайты

### Структура данных

#### Входные данные:
```json
{
  "userProfile": {
    "name": "string",
    "birthDate": "YYYY-MM-DD",
    "birthTime": "HH:MM",
    "birthPlace": {
      "name": "string",
      "latitude": "number",
      "longitude": "number"
    }
  },
  "scenario": "free" | "premium",
  "options": {
    "includeDetailedAnalysis": "boolean",
    "includeQuickInsights": "boolean",
    "includeRecommendations": "boolean"
  }
}
```

#### Выходные данные:
```json
{
  "success": "boolean",
  "analysis": {
    "numerology": "object",
    "humanDesign": "object",
    "astrology": "object",
    "aiInsights": "object (premium only)",
    "recommendations": "object"
  },
  "executionTime": "string",
  "pdfUrl": "string (premium only)"
}
```

## 📱 Использование в приложении

### Компоненты
- `SubscriptionManager` - управление подписками
- `ChatGPTAssistant` - AI чат
- `N8NApiStatus` - статус n8n
- `ScenarioManager` - выбор сценариев

### API Endpoints
- `/api/analysis/execute` - выполнение анализа
- `/api/chatgpt/chat` - ChatGPT ассистент
- `/api/n8n/status` - статус n8n
- `/api/n8n/execute` - выполнение workflow'ов

### Страницы
- `/subscription` - управление подписками
- `/admin/n8n` - админ панель n8n

## 🚀 Запуск и тестирование

1. **Запустите n8n**:
   ```bash
   n8n start
   ```

2. **Создайте workflow'ы** по инструкции в `N8N_SETUP.md`

3. **Обновите ID workflow'ов** в `lib/n8nConfig.ts`

4. **Запустите приложение**:
   ```bash
   npm run dev
   ```

5. **Протестируйте**:
   - `/admin/n8n` - статус n8n
   - `/subscription` - подписки
   - Выполнение анализа через UI

## 🔍 Мониторинг

### Логи
- Все API вызовы логируются
- Ошибки записываются в консоль
- Время выполнения отслеживается

### Метрики
- Количество запросов по типам подписки
- Время выполнения workflow'ов
- Успешность API вызовов
- Использование ChatGPT

## 🛠 Troubleshooting

### n8n не подключается
1. Проверьте, что n8n запущен на порту 5678
2. Убедитесь в корректности API токена
3. Проверьте переменные окружения

### ChatGPT не работает
1. Проверьте `OPENAI_API_KEY`
2. Убедитесь в наличии средств на аккаунте OpenAI
3. Проверьте лимиты API

### Workflow'ы не выполняются
1. Убедитесь, что workflow'ы активны в n8n
2. Проверьте ID workflow'ов в конфигурации
3. Проверьте логи n8n

## 📈 Развитие

### Планируемые функции
- Интеграция с платежными системами
- Автоматическое обновление подписок
- Расширенная аналитика
- Мобильное приложение
- Социальные функции

### Оптимизация
- Кэширование результатов
- Параллельная обработка
- Оптимизация API вызовов
- Улучшение UX



