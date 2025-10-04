# n8n Integration Setup

## 🔧 Настройка n8n

### 1. Установка и запуск n8n

```bash
# Установка через npm
npm install n8n -g

# Запуск n8n
n8n start

# Или через Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

n8n будет доступен по адресу: `http://localhost:5678`

### 2. Создание API токена

1. Откройте n8n в браузере
2. Войдите в аккаунт или создайте новый
3. Перейдите в **Settings** → **API Keys**
4. Нажмите **Create API Key**
5. Скопируйте созданный токен

### 3. Настройка переменных окружения

Добавьте в `.env.local`:

```env
# n8n Integration
N8N_API_TOKEN=your_jwt_token_here
N8N_BASE_URL=http://localhost:5678
```

## 🎯 Создание Workflow'ов

### Workflow 1: Классический анализ

1. **Создайте новый workflow**
2. **Добавьте Webhook trigger**:
   - Method: POST
   - Path: `/classic-analysis`
   - Response: JSON

3. **Добавьте узлы обработки**:
   - Получение данных пользователя
   - Вызов API нумерологии
   - Вызов API астрологии
   - Вызов API Human Design
   - Объединение результатов

4. **Настройте выходные данные**:
   - Полный анализ
   - Детальные интерпретации
   - Рекомендации

### Workflow 2: Быстрый анализ

1. **Создайте новый workflow**
2. **Добавьте Webhook trigger**:
   - Method: POST
   - Path: `/quick-analysis`
   - Response: JSON

3. **Добавьте упрощенные узлы**:
   - Основные расчеты
   - Ключевые инсайты
   - Краткие рекомендации

4. **Настройте выходные данные**:
   - Основные числа
   - Ключевые характеристики
   - Быстрые советы

## 🔗 Интеграция с приложением

### 1. Получение ID workflow'ов

После создания workflow'ов:

1. Откройте каждый workflow
2. Скопируйте ID из URL или настроек
3. Обновите `lib/n8nConfig.ts`:

```typescript
export const N8N_WORKFLOW_IDS = {
  scenario1: 'your-classic-workflow-id',
  scenario2: 'your-quick-workflow-id',
}
```

### 2. Тестирование

1. Откройте `/admin/n8n`
2. Проверьте статус подключения
3. Протестируйте выполнение сценариев

## 📊 Структура данных

### Входные данные (Webhook)

```json
{
  "userProfile": {
    "name": "Иван Иванов",
    "birthDate": "1990-01-01",
    "birthTime": "12:00",
    "birthPlace": {
      "name": "Москва",
      "latitude": 55.7558,
      "longitude": 37.6176
    }
  },
  "scenario": "scenario1",
  "options": {
    "includeDetailedAnalysis": true,
    "includeRecommendations": true
  }
}
```

### Выходные данные

```json
{
  "success": true,
  "analysis": {
    "numerology": { ... },
    "astrology": { ... },
    "humanDesign": { ... },
    "recommendations": [ ... ],
    "summary": "..."
  },
  "executionTime": "2.5s",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🚀 Использование

### В коде приложения

```typescript
import { executeN8NWorkflow } from '@/lib/n8nApi'

// Выполнение классического анализа
const result = await executeN8NWorkflow('scenario1', {
  userProfile: profile,
  scenario: 'scenario1',
  options: { includeDetailedAnalysis: true }
})

// Выполнение быстрого анализа
const quickResult = await executeN8NWorkflow('scenario2', {
  userProfile: profile,
  scenario: 'scenario2',
  options: { includeQuickInsights: true }
})
```

### Через API

```bash
# Проверка статуса
GET /api/n8n/status

# Выполнение workflow
POST /api/n8n/execute
{
  "workflowId": "scenario1",
  "inputData": { ... },
  "scenario": "scenario1"
}

# Получение результата
GET /api/n8n/execute?executionId=execution-id
```

## 🔧 Troubleshooting

### Проблемы с подключением

1. **Проверьте, что n8n запущен**:
   ```bash
   curl http://localhost:5678/api/v1/me
   ```

2. **Проверьте токен**:
   - Убедитесь, что токен корректный
   - Проверьте права доступа

3. **Проверьте переменные окружения**:
   - Перезапустите приложение после изменения `.env.local`

### Проблемы с workflow'ами

1. **Workflow не выполняется**:
   - Проверьте, что workflow активен
   - Убедитесь в корректности входных данных

2. **Ошибки в узлах**:
   - Проверьте логи в n8n
   - Убедитесь в корректности API вызовов

## 📚 Дополнительные ресурсы

- [n8n Documentation](https://docs.n8n.io/)
- [n8n API Reference](https://docs.n8n.io/api/)
- [n8n Community](https://community.n8n.io/)



