# 🛠️ Ручная настройка n8n для BodyGraph

## 🚀 Шаг 1: Запуск n8n

```bash
# Запустите n8n в отдельном терминале
n8n start
```

Откройте http://localhost:5678 и войдите в аккаунт.

## 🔧 Шаг 2: Создание ChatGPT Basic Workflow

### 2.1 Создайте новый workflow
- Нажмите "New workflow"
- Назовите "ChatGPT Basic"

### 2.2 Добавьте Webhook узел
1. Перетащите **Webhook** узел на canvas
2. Настройте:
   - **HTTP Method**: POST
   - **Path**: `chatgpt-basic`
   - **Response Mode**: "Respond to Webhook"
3. Сохраните и **активируйте webhook**

### 2.3 Добавьте OpenAI узел
1. Перетащите **OpenAI** узел на canvas
2. Настройте:
   - **Model**: `gpt-3.5-turbo`
   - **Max Tokens**: 300
   - **Temperature**: 0.7
   - **System Message**:
   ```
   Ты базовый AI ассистент в приложении BodyGraph. Помогаешь пользователям с простыми вопросами о нумерологии, Human Design и астрологии.

   Отвечай кратко (до 3-4 абзацев), давай только базовые интерпретации. Фокусируйся на основных числах и характеристиках.

   Отвечай на русском языке, будь дружелюбным и кратким.
   ```
3. **Messages**:
   - Role: system, Content: `={{ $json.systemMessage }}`
   - Role: user, Content: `={{ $json.message }}`

### 2.4 Добавьте Response узел
1. Перетащите **Respond to Webhook** узел на canvas
2. Настройте:
   - **Response Mode**: JSON
   - **Response Body**:
   ```json
   {
     "success": true,
     "response": "{{ $node['OpenAI GPT-3.5'].json.choices[0].message.content }}",
     "model": "gpt-3.5-turbo",
     "timestamp": "{{ $now }}"
   }
   ```

### 2.5 Соедините узлы
- Webhook → OpenAI GPT-3.5
- OpenAI GPT-3.5 → Respond to Webhook

### 2.6 Активируйте workflow
- Нажмите кнопку "Active" в правом верхнем углу

## 🚀 Шаг 3: Создание ChatGPT Premium Workflow

### 3.1 Создайте новый workflow
- Нажмите "New workflow"
- Назовите "ChatGPT Premium"

### 3.2 Добавьте Webhook узел
1. Перетащите **Webhook** узел на canvas
2. Настройте:
   - **HTTP Method**: POST
   - **Path**: `chatgpt-premium`
   - **Response Mode**: "Respond to Webhook"

### 3.3 Добавьте OpenAI узел
1. Перетащите **OpenAI** узел на canvas
2. Настройте:
   - **Model**: `gpt-4`
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
3. **Messages**:
   - Role: system, Content: `={{ $json.systemMessage }}`
   - Role: user, Content: `={{ $json.message }}`

### 3.4 Добавьте Response узел
1. Перетащите **Respond to Webhook** узел на canvas
2. Настройте:
   - **Response Mode**: JSON
   - **Response Body**:
   ```json
   {
     "success": true,
     "response": "{{ $node['OpenAI GPT-4'].json.choices[0].message.content }}",
     "model": "gpt-4",
     "timestamp": "{{ $now }}",
     "isPremium": true
   }
   ```

### 3.5 Соедините узлы и активируйте
- Webhook → OpenAI GPT-4
- OpenAI GPT-4 → Respond to Webhook
- Активируйте workflow

## 🔧 Шаг 4: Обновление конфигурации

### 4.1 Получите ID workflow'ов
1. В n8n перейдите в каждый workflow
2. Скопируйте ID из URL (после `/workflow/`)

### 4.2 Обновите `lib/n8nConfig.ts`
```typescript
export const N8N_WORKFLOW_IDS = {
  // Основные сценарии анализа
  scenario1: 'scenario-1-workflow-id',
  scenario2: 'scenario-2-workflow-id',
  
  // ChatGPT workflow'ы
  chatgptBasic: 'ваш-basic-workflow-id',
  chatgptPremium: 'ваш-premium-workflow-id',
}
```

## 🧪 Шаг 5: Тестирование

### 5.1 Проверьте webhook'и
```bash
# Тест базового
curl -X POST http://localhost:5678/webhook/chatgpt-basic \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет", "isPremium": false}'

# Тест премиум
curl -X POST http://localhost:5678/webhook/chatgpt-premium \
  -H "Content-Type: application/json" \
  -d '{"message": "Расскажи о числе 7", "isPremium": true}'
```

### 5.2 Проверьте статус n8n
```bash
curl http://localhost:3001/api/n8n/status
```

### 5.3 Протестируйте в приложении
1. Откройте http://localhost:3001/subscription
2. Используйте ChatGPT тестовый компонент
3. Проверьте работу в обоих режимах

## 📋 Готовые URL'ы

После настройки у вас будут:
- **Basic**: http://localhost:5678/webhook/chatgpt-basic
- **Premium**: http://localhost:5678/webhook/chatgpt-premium

## ⏱️ Время настройки: ~10 минут

1. **Запуск n8n**: 2 минуты
2. **Создание Basic workflow**: 3 минуты
3. **Создание Premium workflow**: 3 минуты
4. **Обновление конфигурации**: 1 минута
5. **Тестирование**: 1 минута

## 🎯 Результат

После настройки:
- ✅ ChatGPT работает через ваш n8n
- ✅ Использует ваш OpenAI ключ
- ✅ Базовый и премиум режимы
- ✅ Полная интеграция с BodyGraph

## 🔍 Troubleshooting

### OpenAI не отвечает
- Проверьте настройки OpenAI в n8n
- Убедитесь, что ключ активен
- Проверьте лимиты использования

### Webhook не работает
- Убедитесь, что workflow активен
- Проверьте путь webhook'а
- Проверьте логи в n8n

### Приложение не подключается
- Проверьте ID workflow'ов в конфигурации
- Убедитесь, что n8n запущен
- Проверьте API токен
