# Пример конфигурации для подключения к ассистенту

## Шаг 1: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```bash
# HTTP API подключение к ассистенту
ASSISTANT_BOT_URL=https://rufeyesedoub.beget.app/webhook/ingest/your-secret-ing
ASSISTANT_BOT_API_KEY=your_ingest_api_key_here
ASSISTANT_BOT_SIGNING_SECRET=your_signing_secret_here

# Существующие настройки (не изменяйте)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Шаг 2: Замените значения на реальные

Замените следующие значения на ваши реальные:

- `your-secret-ing` → ваш реальный секрет для webhook URL
- `your_ingest_api_key_here` → ваш реальный API ключ
- `your_signing_secret_here` → ваш секрет для HMAC подписи (опционально)

## Шаг 3: Проверка работы

1. Перезапустите сервер разработки:
```bash
npm run dev
```

2. Откройте приложение и перейдите к любому модулю

3. Нажмите кнопку "Ассистент" внизу справа

4. Проверьте логи в консоли браузера и терминале сервера

## Пример успешного запроса

При успешной отправке вы увидите в логах:
```
📤 Sending to external assistant bot: {
  endpoint: 'https://rufeyesedoub.beget.app/webhook/ingest/your-secret-ing',
  dataSize: 15420,
  hasApiKey: true,
  hasSigningSecret: true
}
✅ Assistant bot response: { success: true, message: 'Data received' }
```

## Обработка ошибок

Если что-то пошло не так, проверьте:

1. **Правильность URL** - должен быть доступен из интернета
2. **API ключ** - должен быть валидным
3. **Формат данных** - должен соответствовать ожидаемому формату
4. **CORS настройки** - если есть проблемы с CORS

## Безопасность

- Никогда не коммитьте `.env.local` в git
- Используйте сильные секреты для API ключей
- Регулярно ротируйте ключи доступа
