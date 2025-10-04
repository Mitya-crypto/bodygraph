# 🚀 Быстрая настройка n8n для BodyGraph

## Вариант 1: Автоматический (рекомендуется)

### 1. Запустите n8n
```bash
n8n start
```

### 2. Выполните автоматическую настройку
```bash
node scripts/setup-n8n-workflows.js
```

Скрипт автоматически:
- ✅ Создаст workflow'ы в n8n
- ✅ Настроит webhook'и
- ✅ Сгенерирует обновленную конфигурацию

## Вариант 2: Ручной импорт

### 1. Откройте n8n
- Перейдите на http://localhost:5678
- Войдите в аккаунт

### 2. Импортируйте workflow'ы
1. Нажмите **"Import from file"**
2. Выберите файл `n8n-workflows/chatgpt-basic.json`
3. Повторите для `n8n-workflows/chatgpt-premium.json`

### 3. Активируйте workflow'ы
- Нажмите кнопку **"Active"** на каждом workflow
- Скопируйте webhook URL'ы

## Вариант 3: Создание с нуля (5 минут)

### ChatGPT Basic Workflow:
1. **Создайте новый workflow**
2. **Добавьте Webhook узел**:
   - Method: POST
   - Path: `chatgpt-basic`
3. **Добавьте OpenAI узел**:
   - Model: `gpt-3.5-turbo`
   - Max Tokens: 300
   - System Message: `Ты базовый AI ассистент BodyGraph...`
4. **Добавьте Response узел**
5. **Соедините узлы** и активируйте

### ChatGPT Premium Workflow:
1. **Создайте новый workflow**
2. **Добавьте Webhook узел**:
   - Method: POST
   - Path: `chatgpt-premium`
3. **Добавьте OpenAI узел**:
   - Model: `gpt-4`
   - Max Tokens: 800
   - System Message: `Ты профессиональный космический консультант...`
4. **Добавьте Response узел**
5. **Соедините узлы** и активируйте

## 🔧 Обновление конфигурации

После создания workflow'ов обновите `lib/n8nConfig.ts`:

```typescript
export const N8N_WORKFLOW_IDS = {
  chatgptBasic: 'ваш-basic-workflow-id',
  chatgptPremium: 'ваш-premium-workflow-id',
}
```

## 🧪 Тестирование

### 1. Проверьте статус n8n
```bash
curl http://localhost:3001/api/n8n/status
```

### 2. Протестируйте ChatGPT
- Откройте http://localhost:3001/subscription
- Используйте тестовый компонент ChatGPT

### 3. Проверьте webhook'и напрямую
```bash
curl -X POST http://localhost:5678/webhook/chatgpt-basic \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет", "isPremium": false}'
```

## 🎯 Готовые URL'ы

После настройки у вас будут:
- **Basic**: http://localhost:5678/webhook/chatgpt-basic
- **Premium**: http://localhost:5678/webhook/chatgpt-premium

## ⚡ Быстрый старт (1 минута)

Если у вас уже настроен n8n с OpenAI:

1. **Запустите скрипт**:
   ```bash
   node scripts/setup-n8n-workflows.js
   ```

2. **Обновите конфигурацию** (скопируйте из вывода скрипта)

3. **Перезапустите приложение**:
   ```bash
   npm run dev
   ```

4. **Протестируйте**: http://localhost:3001/subscription

## 🔍 Troubleshooting

### n8n не запускается
```bash
# Проверьте порт
lsof -i :5678

# Переустановите n8n
npm install -g n8n
```

### Workflow'ы не создаются
- Проверьте API токен в `.env.local`
- Убедитесь, что n8n запущен
- Проверьте права доступа

### ChatGPT не отвечает
- Проверьте настройки OpenAI в n8n
- Убедитесь, что workflow'ы активны
- Проверьте логи в n8n

## 🎉 Готово!

После настройки у вас будет:
- ✅ ChatGPT ассистент через n8n
- ✅ Базовый и премиум режимы
- ✅ Полная интеграция с BodyGraph
- ✅ Использование вашего OpenAI ключа



