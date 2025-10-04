# Настройка Human Design API

## 🚀 Подключение к HumanDesignAPI.nl

### 1. Получение API ключа

1. Перейдите на сайт [humandesignapi.nl](https://humandesignapi.nl)
2. Зарегистрируйтесь или войдите в аккаунт
3. Выберите план **"API Создателя"** - $25/месяц
4. Получите ваш API ключ

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# Human Design API Configuration
NEXT_PUBLIC_HUMAN_DESIGN_API_KEY=your_api_key_here
```

### 3. Структура API запроса

```typescript
// Запрос к API
POST https://humandesignapi.nl/api/v1/chart
Headers:
  X-Api-Key: your_api_key
  Content-Type: application/json

Body:
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30",
  "latitude": 55.7558,
  "longitude": 37.6176
}
```

### 4. Ответ API

```typescript
{
  "type": "Generator",
  "strategy": "Respond", 
  "authority": "Sacral",
  "profile": "3/5",
  "definition": "Single Definition",
  "inner_authority": "Sacral Response",
  "incarnation_cross": "Right Angle Cross of Contagion",
  "channels": [
    {
      "number": "1-8",
      "name": "Inspiration",
      "description": "Channel of inspiration and creativity"
    }
  ],
  "gates": [
    {
      "number": "1",
      "name": "Self Expression", 
      "description": "Gate of self-expression and creativity"
    }
  ],
  "defined_centers": ["Sacral", "Root", "Solar Plexus"],
  "undefined_centers": ["Heart", "Spleen", "Head"]
}
```

## 📊 Тарифные планы

### API Создателя - $25/месяц
- ✅ 1,000 вызовов API в месяц
- ✅ Базовая информация о Human Design
- ✅ Тип, стратегия, авторитет
- ✅ Профиль и определение
- ✅ Каналы и ворота
- ✅ Центры

### API Запуска - $50/месяц
- ✅ 10,000 вызовов API в месяц
- ✅ Все функции API Создателя
- ✅ Расширенная информация
- ✅ Поддержка для SaaS

### Бизнес API - $200/месяц
- ✅ 100,000 вызовов API в месяц
- ✅ Все функции предыдущих планов
- ✅ Коммерческая лицензия
- ✅ Приоритетная поддержка

## 🔧 Настройка в коде

### 1. Конфигурация API

```typescript
// lib/humanDesignApi.ts
const HUMAN_DESIGN_API_CONFIG = {
  baseUrl: 'https://humandesignapi.nl/api/v1',
  apiKey: process.env.NEXT_PUBLIC_HUMAN_DESIGN_API_KEY || '',
  timeout: 10000
}
```

### 2. Функция запроса

```typescript
export async function fetchHumanDesignData(request: HumanDesignRequest): Promise<HumanDesignResponse> {
  const response = await fetch(`${HUMAN_DESIGN_API_CONFIG.baseUrl}/chart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': HUMAN_DESIGN_API_CONFIG.apiKey,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      birth_date: request.birthDate,
      birth_time: request.birthTime,
      latitude: request.latitude,
      longitude: request.longitude
    })
  })
  
  return response.json()
}
```

## 🛡️ Безопасность

1. **Никогда не коммитьте API ключ в Git**
2. **Используйте переменные окружения**
3. **Ограничьте доступ к ключу**
4. **Мониторьте использование API**

## 📈 Мониторинг использования

- Отслеживайте количество вызовов в панели управления
- Настройте уведомления о приближении к лимиту
- Рассмотрите обновление плана при необходимости

## 🔄 Fallback стратегия

При недоступности API система автоматически использует моковые данные:

```typescript
// Автоматический fallback
if (!HUMAN_DESIGN_API_CONFIG.apiKey) {
  return getMockHumanDesignData()
}

if (response.status >= 500) {
  return getMockHumanDesignData()
}
```

## 📞 Поддержка

- Документация: [humandesignapi.nl/docs](https://humandesignapi.nl/docs)
- Поддержка: support@humandesignapi.nl
- Статус API: [status.humandesignapi.nl](https://status.humandesignapi.nl)



