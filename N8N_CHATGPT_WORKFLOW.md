# n8n ChatGPT Workflow Setup

## 🎯 Цель
Создать workflow'ы в n8n для обработки ChatGPT запросов с использованием вашего подключенного OpenAI.

## 🔧 Workflow 1: Базовый ChatGPT (Бесплатные пользователи)

### 1. Создание Workflow
1. Откройте n8n
2. Создайте новый workflow
3. Назовите его "ChatGPT Basic"

### 2. Настройка узлов

#### Webhook Trigger
- **URL**: `/webhook/chatgpt-basic`
- **Method**: POST
- **Response**: JSON

#### OpenAI Node (GPT-3.5)
- **Model**: gpt-3.5-turbo
- **Max Tokens**: 300
- **Temperature**: 0.7
- **System Message**: 
```
Ты базовый AI ассистент в приложении BodyGraph. Помогаешь пользователям с простыми вопросами о нумерологии, Human Design и астрологии.

Отвечай кратко (до 3-4 абзацев), давай только базовые интерпретации. Фокусируйся на основных числах и характеристиках.

Отвечай на русском языке, будь дружелюбным и кратким.
```

#### Response Node
- **Status Code**: 200
- **Body**: 
```json
{
  "success": true,
  "response": "{{ $node['OpenAI'].json.choices[0].message.content }}",
  "model": "gpt-3.5-turbo",
  "timestamp": "{{ $now }}"
}
```

### 3. Получение Webhook URL
1. Активируйте workflow
2. Скопируйте webhook URL
3. Обновите `N8N_WORKFLOW_IDS.chatgptBasic` в коде

## 🚀 Workflow 2: Премиум ChatGPT (Премиум пользователи)

### 1. Создание Workflow
1. Создайте новый workflow
2. Назовите его "ChatGPT Premium"

### 2. Настройка узлов

#### Webhook Trigger
- **URL**: `/webhook/chatgpt-premium`
- **Method**: POST
- **Response**: JSON

#### OpenAI Node (GPT-4)
- **Model**: gpt-4
- **Max Tokens**: 800
- **Temperature**: 0.7
- **System Message**:
```
Ты профессиональный космический консультант и духовный наставник, специализирующийся на нумерологии, Human Design и астрологии. Ты работаешь в приложении BodyGraph.

ТВОЯ ЭКСПЕРТИЗА:
- Нумерология: Life Path, Expression, Soul Urge, Personality числа, мастер-числа
- Human Design: типы, стратегии, авторитеты, каналы, ворота, центры
- Астрология: натальные карты, планеты в знаках, аспекты, транзиты

СТИЛЬ ОБЩЕНИЯ:
- Мудрый, но доступный
- Вдохновляющий и поддерживающий
- Персонализированный под профиль пользователя
- Сбалансированный: духовная мудрость + практическое применение

СТРУКТУРА ОТВЕТА (ПРЕМИУМ):
1. Краткий обзор (2-3 предложения)
2. Ключевые сильные стороны (4-5 пунктов)
3. Области роста (3-4 пункта)
4. Практические рекомендации (5-6 советов)
5. Персональная медитация или аффирмация

Отвечай на русском языке, будь вдохновляющим и практичным.
```

#### Response Node
- **Status Code**: 200
- **Body**:
```json
{
  "success": true,
  "response": "{{ $node['OpenAI'].json.choices[0].message.content }}",
  "model": "gpt-4",
  "timestamp": "{{ $now }}",
  "isPremium": true
}
```

## 🔗 Интеграция с приложением

### 1. Обновление конфигурации
В файле `lib/n8nConfig.ts`:
```typescript
export const N8N_WORKFLOW_IDS = {
  chatgptBasic: 'your-basic-workflow-id',
  chatgptPremium: 'your-premium-workflow-id',
}
```

### 2. Webhook URLs
- Базовый: `http://localhost:5678/webhook/chatgpt-basic`
- Премиум: `http://localhost:5678/webhook/chatgpt-premium`

## 🧪 Тестирование

### Тест базового workflow:
```bash
curl -X POST http://localhost:5678/webhook/chatgpt-basic \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Расскажи о числе жизненного пути 7",
    "isPremium": false,
    "userProfile": {
      "name": "Тест",
      "birthDate": "1990-01-01"
    }
  }'
```

### Тест премиум workflow:
```bash
curl -X POST http://localhost:5678/webhook/chatgpt-premium \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Дай детальный анализ числа жизненного пути 7",
    "isPremium": true,
    "userProfile": {
      "name": "Тест",
      "birthDate": "1990-01-01",
      "birthTime": "12:00"
    }
  }'
```

## 🔧 Настройка в приложении

### 1. Обновите ID workflow'ов
После создания workflow'ов в n8n, обновите их ID в коде:

```typescript
// lib/n8nConfig.ts
export const N8N_WORKFLOW_IDS = {
  chatgptBasic: 'actual-basic-workflow-id',
  chatgptPremium: 'actual-premium-workflow-id',
}
```

### 2. Тестирование через приложение
1. Откройте `/subscription`
2. Протестируйте ChatGPT компонент
3. Проверьте работу в обоих режимах

## 📊 Мониторинг

### В n8n:
- Проверяйте логи выполнения
- Мониторьте использование OpenAI токенов
- Отслеживайте время ответа

### В приложении:
- Проверяйте логи в консоли
- Мониторьте успешность запросов
- Отслеживайте пользовательский опыт

## 🚀 Преимущества n8n подхода

1. **Централизованное управление** OpenAI ключами
2. **Гибкая настройка** промтов и параметров
3. **Мониторинг** использования через n8n
4. **Масштабируемость** - легко добавлять новые workflow'ы
5. **Отказоустойчивость** - fallback механизмы в n8n



