# Интеграция с Ботом-Ассистентом

## Обзор

Система сбора и отправки данных ассистенту реализована пошагово:

### 1. Сбор данных (`lib/assistantDataCollector.ts`)

Функция `collectAllAssistantData()` собирает:
- **Профиль пользователя**: имя, дата рождения, место рождения, координаты
- **Нумерология**: все числа, ежедневные метрики, графики энергии
- **Human Design**: тип, стратегия, центры, каналы, ворота
- **Астрология**: натальная карта, транзиты, планетарные позиции

### 2. API Endpoint (`app/api/assistant/send-data/route.ts`)

Принимает данные в формате JSON и отправляет их внешнему боту-ассистенту.

### 3. Интеграция в UI (`components/ResultsScreen.tsx`)

Кнопка ассистента теперь:
- Собирает ВСЕ данные со всех модулей
- Показывает состояние загрузки
- Отправляет данные через API
- Передает данные в Telegram WebApp

## Формат данных

```json
{
  "user": {
    "profile": {
      "id": "string",
      "name": "string", 
      "birthDate": "string",
      "birthTime": "string",
      "birthPlace": "string",
      "coordinates": { "lat": number, "lng": number }
    }
  },
  "numerology": {
    "lifePathNumber": number,
    "expressionNumber": number,
    "soulUrgeNumber": number,
    "personalityNumber": number,
    "dailyMetrics": {
      "dayNumber": number,
      "personalDayNumber": number,
      "energyLevel": number,
      "favorableNumbers": number[],
      "recommendedColors": string[],
      "bestTimes": string[],
      "weeklyEnergy": number[],
      "todayScore": number,
      "moodScore": number,
      "creativityScore": number,
      "socialScore": number
    }
  },
  "humanDesign": {
    "type": "string",
    "strategy": "string", 
    "authority": "string",
    "profile": "string",
    "definition": "string",
    "centers": [...],
    "channels": [...],
    "gates": [...],
    "incarnationCross": {...}
  },
  "astrology": {
    "sunSign": "string",
    "moonSign": "string",
    "risingSign": "string",
    "natalChart": {...},
    "transits": {...}
  },
  "timestamp": "ISO string",
  "sessionId": "string"
}
```

## Настройка внешнего бота

Для подключения к внешнему боту-ассистенту:

1. Добавьте в `.env.local`:
```bash
# HTTP API подключение к ассистенту
ASSISTANT_BOT_URL=https://rufeyesedoub.beget.app/webhook/ingest/your-secret-ing
ASSISTANT_BOT_API_KEY=your_ingest_api_key
ASSISTANT_BOT_SIGNING_SECRET=your_signing_secret  # опционально для HMAC подписи
```

2. Система автоматически:
   - Отправляет POST запрос с JSON данными
   - Добавляет заголовок `X-API-Key` для аутентификации
   - Добавляет `X-Signature` с HMAC-SHA256 подписью (если настроен секрет)
   - Обрабатывает ошибки и повторные попытки

## Формат запроса к вашему API

Система отправляет POST запрос с заголовками:
```
Content-Type: application/json
X-API-Key: <INGEST_API_KEY>
X-Signature: sha256=<HMAC_HEX>  # если настроен подписывающий секрет
```

Тело запроса содержит полный JSON с данными пользователя:
```json
{
  "user": { "profile": {...} },
  "numerology": { "lifePathNumber": 5, "dailyMetrics": {...} },
  "humanDesign": { "type": "Generator", "centers": [...] },
  "astrology": { "sunSign": "Скорпион", "transits": {...} },
  "timestamp": "2025-01-02T10:30:00.000Z",
  "sessionId": "session_1735816200000_abc123"
}
```

## Использование

1. Пользователь нажимает кнопку "Ассистент"
2. Система собирает все данные из всех модулей
3. Отправляет запрос на `/api/assistant/send-data`
4. API перенаправляет данные на ваш webhook
5. Показывает пользователю статус отправки

## Тестирование

1. Откройте любой модуль (Нумерология, Human Design, Астрология)
2. Нажмите зеленую кнопку "Ассистент" внизу справа
3. Проверьте консоль браузера для логов сбора данных
4. Проверьте Network tab для запроса `/api/assistant/send-data`
5. Проверьте логи вашего webhook на получение данных
