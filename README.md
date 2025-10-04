# Cosmic BodyGraph - Telegram Mini App

Инновационное Telegram Mini App для нумерологии, Human Design и астрологии с космическим 3D дизайном.

## 🌟 Особенности

- **Нумерология**: Расчет чисел жизненного пути, выражения, души и личности
- **Human Design**: Анализ энергетического типа, стратегии и авторитета
- **Астрология**: Натальные карты с позициями планет и аспектами
- **Космический дизайн**: 3D анимации, звездное поле, небесные тела
- **ИИ-помощник**: Расшифровка и персональные советы (премиум)
- **Многоязычность**: Поддержка русского и английского языков
- **Система подписок**: Бесплатная и премиум версии

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🛠 Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Стили**: Tailwind CSS с кастомными космическими темами
- **Анимации**: Framer Motion, Three.js
- **Состояние**: Zustand
- **Формы**: React Hook Form
- **Уведомления**: React Hot Toast
- **Telegram**: Telegram Web App SDK

## 📱 Telegram Bot Setup

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Настройте WebApp URL в BotFather
4. Добавьте кнопку WebApp в меню бота

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_API_URL=your_api_url
HUMAN_DESIGN_API_KEY=your_hd_api_key
```

### API Интеграции

- **Human Design**: Bodygraph.com API или HumanDesignAPI.nl
- **Астрология**: Swiss Ephemeris (pyswisseph)
- **Геокодирование**: Google Places API или Nominatim

## 🎨 Дизайн система

### Цветовая палитра

- **Cosmic**: Синие оттенки для космической темы
- **Nebula**: Фиолетовые оттенки для туманностей
- **Space**: Темные оттенки для космического пространства

### Анимации

- **Float**: Плавающие планеты
- **Twinkle**: Мерцающие звезды
- **Orbit**: Орбитальные кольца
- **Nebula**: Пульсирующие туманности

## 📊 Архитектура

```
app/
├── layout.tsx          # Основной layout
├── page.tsx            # Главная страница
└── globals.css         # Глобальные стили

components/
├── WelcomeScreen.tsx    # Экран приветствия
├── ProfileScreen.tsx    # Экран профиля
├── ModuleSelectionScreen.tsx # Выбор модулей
├── ResultsScreen.tsx   # Экран результатов
├── SubscriptionScreen.tsx # Экран подписки
├── NumerologyDisplay.tsx # Отображение нумерологии
├── HumanDesignDisplay.tsx # Отображение HD
├── AstrologyDisplay.tsx # Отображение астрологии
├── StarField.tsx       # Звездное поле
├── CosmicBackground.tsx # Космический фон
└── TelegramProvider.tsx # Telegram контекст

lib/
├── numerology.ts       # Расчеты нумерологии
├── humanDesign.ts      # Human Design API
└── astrology.ts        # Астрологические расчеты

store/
└── appStore.ts         # Zustand store
```

## 🔮 Расчеты

### Нумерология

- **Число жизненного пути**: Сумма дня, месяца и года рождения
- **Число выражения**: Сумма букв полного имени
- **Число души**: Сумма гласных букв
- **Число личности**: Сумма согласных букв
- **Биоритмы**: Физический (23 дня), эмоциональный (28 дней), интеллектуальный (33 дня)

### Human Design

- **Тип**: Generator, Manifestor, Projector, Reflector
- **Стратегия**: To Respond, To Inform, To Wait, To Wait for Lunar Cycle
- **Авторитет**: Sacral, Solar Plexus, Splenic, G-Center, Ego
- **Профиль**: 1/3, 2/4, 3/5, 4/6, 5/1, 6/2
- **Центры**: Определенные и открытые центры
- **Каналы**: Активированные каналы между центрами

### Астрология

- **Планеты**: Солнце, Луна, Меркурий, Венера, Марс, Юпитер, Сатурн, Уран, Нептун, Плутон
- **Дома**: 12 астрологических домов
- **Аспекты**: Соединение, секстиль, квадрат, трин, оппозиция
- **Знаки**: 12 знаков зодиака

## 💰 Монетизация

### Бесплатная версия

- Базовые расчеты нумерологии
- Простой Human Design анализ
- Основные планеты в натальной карте
- Краткие интерпретации

### Премиум версия

- Все расчеты и расширенные отчеты
- Анализ совместимости
- ИИ-помощник и персональные расшифровки
- PDF отчеты
- Ежедневные подсказки
- Приоритетная поддержка

## 🚀 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой автоматически

### Другие платформы

- **Netlify**: Аналогично Vercel
- **Railway**: Для full-stack приложений
- **Heroku**: С Docker контейнером

## 📱 Telegram WebApp

### Инициализация

```typescript
// В TelegramProvider.tsx
useEffect(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    tg.enableClosingConfirmation()
  }
}, [])
```

### Безопасность

- Проверка подписи initData
- Валидация пользовательских данных
- Защита от CSRF атак

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# E2E тесты
npm run test:e2e

# Линтинг
npm run lint
```

## 📈 Аналитика

- **Telegram Analytics**: Встроенная аналитика WebApp
- **Custom Events**: Отслеживание пользовательских действий
- **Conversion Tracking**: Конверсия в подписки

## 🔒 Безопасность

- **HTTPS**: Обязательно для Telegram WebApp
- **CORS**: Настроенные политики для API
- **Rate Limiting**: Ограничение запросов
- **Data Validation**: Валидация всех входных данных

## 📞 Поддержка

- **Telegram**: @your_support_bot
- **Email**: support@cosmicbodygraph.com
- **GitHub Issues**: Для багов и предложений

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature branch
3. Сделайте commit изменений
4. Отправьте pull request

## 🙏 Благодарности

- **Swiss Ephemeris**: За точные астрономические расчеты
- **Bodygraph.com**: За Human Design API
- **Telegram**: За платформу Mini Apps
- **Next.js**: За отличный фреймворк

---

**Cosmic BodyGraph** - Откройте тайны вашей космической сущности! 🌟✨
