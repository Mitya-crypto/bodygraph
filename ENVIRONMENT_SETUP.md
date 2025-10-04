# Environment Variables Setup

## 🔧 Настройка переменных окружения

Для полной работы приложения необходимо настроить переменные окружения в файле `.env.local`:

### 📝 Создайте файл `.env.local` в корне проекта:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# n8n Integration
N8N_API_TOKEN=your_n8n_api_token_here
N8N_BASE_URL=http://localhost:5678

# Astrology API
ASTROLOGY_API_URL=http://localhost:3001/api/astrology-simple

# Human Design API
HUMAN_DESIGN_API_KEY=your_human_design_api_key_here
HUMAN_DESIGN_API_URL=https://api.humandesignapi.nl

# Environment
NODE_ENV=development
NEXT_PUBLIC_WEBAPP_URL=http://localhost:3001
```

## 🚀 После настройки:

1. **Перезапустите сервер**:
   ```bash
   npm run dev
   ```

2. **Проверьте интеграции**:
   - Откройте `/admin/telegram` для проверки Telegram бота
   - Откройте `/admin/n8n` для проверки n8n интеграции

## 🔐 Безопасность

⚠️ **Важно**: Не коммитьте файл `.env.local` в git! Он содержит секретные ключи.

## 📋 Проверка работы

### Telegram Bot
- Статус: ✅/❌ в админ панели
- Команды: `/start`, `/help`, `/analysis`

### n8n Integration
- Статус подключения: ✅/❌
- Количество workflow'ов
- Возможность выполнения сценариев

### Astrology API
- Swiss Ephemeris: ❌ (ошибки в расчетах)
- Simple API: ✅ (работает стабильно)

### Human Design API
- Статус: ⚠️ (требует API ключ)
- Моковые данные: ✅ (работают)



