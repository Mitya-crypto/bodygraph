# 💳 Настройка YooKassa для BodyGraph

## 📋 Обзор

YooKassa интегрирован в приложение BodyGraph для обработки платежей за премиум подписки и разовые покупки.

## 🔧 Настройка

### 1. Регистрация в YooKassa

1. Перейдите на [yookassa.ru](https://yookassa.ru)
2. Зарегистрируйтесь или войдите в личный кабинет
3. Создайте магазин (если еще не создан)

### 2. Получение данных для интеграции

В личном кабинете YooKassa найдите:
- **Shop ID** (ID магазина)
- **Secret Key** (Секретный ключ)

### 3. Настройка переменных окружения

Добавьте в файл `.env.local`:

```bash
# YooKassa Payment Integration
YOOKASSA_SHOP_ID=ваш_shop_id_здесь
YOOKASSA_SECRET_KEY=ваш_secret_key_здесь
YOOKASSA_API_URL=https://api.yookassa.ru/v3
YOOKASSA_WEBHOOK_URL=http://localhost:3001/api/yookassa/webhook
```

### 4. Настройка Webhook

В личном кабинете YooKassa:
1. Перейдите в раздел "Настройки" → "Webhook"
2. Добавьте URL: `https://ваш-домен.com/api/yookassa/webhook`
3. Выберите события:
   - `payment.succeeded` - успешный платеж
   - `payment.canceled` - отмененный платеж
   - `payment.waiting_for_capture` - ожидание подтверждения

## 💰 Доступные планы

### Подписочные планы:
- **Премиум (месяц)** - 9.90 ₽/месяц
- **Премиум (год)** - 99.00 ₽/год (скидка 17%)

### Разовые покупки:
- **Нумерология премиум** - 4.90 ₽
- **Human Design премиум** - 5.90 ₽
- **Астрология премиум** - 6.90 ₽

## 🔄 Процесс оплаты

1. Пользователь выбирает план в `/subscription`
2. Открывается модальное окно с деталями платежа
3. Создается платеж через YooKassa API
4. Пользователь перенаправляется на страницу оплаты YooKassa
5. После оплаты пользователь возвращается на `/payment/success`
6. Webhook обновляет статус подписки пользователя

## 🛠️ API Endpoints

### Создание платежа
```
POST /api/yookassa/create-payment
{
  "planId": "premium_monthly",
  "userId": "user123",
  "returnUrl": "https://app.com/payment/success"
}
```

### Проверка статуса платежа
```
POST /api/yookassa/check-payment
{
  "paymentId": "payment_id_from_yookassa"
}
```

### Webhook от YooKassa
```
POST /api/yookassa/webhook
```

## 🧪 Тестирование

### Тестовый режим
Для тестирования используйте тестовые карты YooKassa:
- **Успешный платеж**: 5555 5555 5555 4477
- **Отклоненный платеж**: 5555 5555 5555 4444
- **CVV**: 123
- **Срок действия**: любая дата в будущем

### Локальное тестирование
1. Запустите приложение: `npm run dev`
2. Перейдите на `/subscription`
3. Выберите план и нажмите "Оплатить"
4. Используйте тестовые данные карты

## 🔒 Безопасность

- Все платежи обрабатываются через YooKassa (PCI DSS Level 1)
- Данные карт не хранятся в приложении
- Webhook проверяет подпись (реализовано в коде)
- Используется HTTPS для всех запросов

## 📊 Мониторинг

Логи платежей доступны в консоли сервера:
- Создание платежей
- Статусы платежей
- Webhook события
- Ошибки обработки

## 🚀 Продакшен

Для продакшена:
1. Замените тестовые данные на реальные
2. Обновите `YOOKASSA_WEBHOOK_URL` на продакшен URL
3. Установите `YOOKASSA_TEST_MODE=false`
4. Настройте мониторинг платежей
5. Настройте уведомления об ошибках

## ❓ Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь в правильности переменных окружения
3. Проверьте настройки webhook в YooKassa
4. Обратитесь в поддержку YooKassa

## 📚 Документация

- [YooKassa API](https://yookassa.ru/developers/api)
- [YooKassa Webhook](https://yookassa.ru/developers/using-api/webhooks)
- [YooKassa Тестирование](https://yookassa.ru/developers/using-api/testing)



