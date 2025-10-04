# 🗺️ Подключение MapBox Geocoding API v6

## 🎯 Что нужно для подключения?

Для работы с MapBox Geocoding API v6 нужен **только один токен** - `Default public token`.

## 🚀 Пошаговое подключение (5 минут)

### Шаг 1: Регистрация в MapBox
1. **Откройте**: https://www.mapbox.com/
2. **Нажмите**: "Sign up" (синяя кнопка)
3. **Заполните форму**:
   - Email: ваш_email@example.com
   - Password: придумайте пароль
   - Username: придумайте имя пользователя
4. **Подтвердите email** (проверьте почту)

### Шаг 2: Получение токена
1. **Войдите** в аккаунт MapBox
2. **Перейдите**: Account → Access tokens
3. **Найдите**: "Default public token"
4. **Скопируйте** токен (начинается с `pk.`)

### Шаг 3: Обновление .env.local
Откройте файл `.env.local` и добавьте/обновите:
```bash
MAPBOX_ACCESS_TOKEN=pk.ваш_токен_здесь
```

### Шаг 4: Тестирование
```bash
# Простой тест
node test-mapbox-simple.js

# Полный тест (Yandex + MapBox)
node test-yandex-api.js
```

## 📊 Что дает MapBox токен?

| API | Лимит | Назначение |
|-----|-------|------------|
| **Geocoding API** | 1,000 запросов/минуту | Поиск городов |
| **Geocoding API** | 100,000 запросов/месяц | Бесплатно |
| Vector Tiles API | 100,000 запросов/минуту | Карты (не нужен) |
| Raster Tiles API | 100,000 запросов/минуту | Карты (не нужен) |

## 🔧 Техническая информация

### Эндпоинт для поиска городов:
```
GET https://api.mapbox.com/search/geocode/v6/forward
```

### Параметры:
- `q` - название города
- `access_token` - ваш токен
- `limit` - количество результатов (макс. 10)
- `types=place` - только города
- `language=ru,en` - языки ответа

### Пример запроса:
```bash
curl "https://api.mapbox.com/search/geocode/v6/forward?q=London&access_token=pk.ваш_токен&limit=3&types=place&language=ru,en"
```

## 🎉 Результат подключения

После настройки получите:
- ✅ **1,000 запросов в минуту** для поиска городов
- ✅ **100,000 запросов в месяц** бесплатно
- ✅ **Отличный поиск** международных городов
- ✅ **Автоматическая работа** с Yandex Geocoder

## 🚨 Возможные ошибки

### 401 Unauthorized
```
❌ MapBox API: Invalid access token (401)
```
**Решение**: Проверьте правильность токена в `.env.local`

### 429 Rate Limit Exceeded
```
❌ MapBox API: Rate limit exceeded (429)
```
**Решение**: Подождите минуту, лимит 1,000 запросов/минуту

### 403 Forbidden
```
❌ MapBox API: Forbidden (403)
```
**Решение**: Проверьте настройки аккаунта в MapBox

## 💡 Полезные ссылки

- **MapBox Dashboard**: https://account.mapbox.com/
- **API Documentation**: https://docs.mapbox.com/api/search/geocoding/
- **Playground**: https://docs.mapbox.com/api/search/geocoding/#geocoding-api-playground
- **Pricing**: https://www.mapbox.com/pricing

## 🎯 Итог

**Один токен MapBox = доступ ко всем нужным API для поиска городов!**

После настройки ваше приложение будет использовать:
- 🇷🇺 **Yandex Geocoder** для российских городов (25k/день)
- 🌍 **MapBox v6** для международных городов (100k/месяц)
- 🎯 **Автоматический выбор** лучшего API для каждого запроса
