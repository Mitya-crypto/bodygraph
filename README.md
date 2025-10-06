# 🌌 Cosmic BodyGraph

**Cosmic BodyGraph** - это инновационное Telegram WebApp для космического анализа личности через нумерологию, Human Design и астрологию.

## ✨ Особенности

### 🔮 Модули анализа
- **📊 Нумерология** - расчет жизненного пути, чисел выражения, души и личности
- **🧬 Human Design** - анализ энергетического типа, стратегии и авторитета
- **⭐ Астрология** - натальные карты, транзиты планет и аспекты

### 🚀 Технологии
- **Next.js 15** - современный React фреймворк
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Framer Motion** - анимации и переходы
- **Telegram WebApp** - интеграция с Telegram
- **Swiss Ephemeris** - точные астрономические расчеты

### 📱 Функции
- 🌟 **Динамический звездный фон** с анимацией падающих звезд
- 📱 **Мобильная адаптация** с удобными компонентами выбора даты/времени
- 🔄 **Автообновление** расчетов при изменении профиля
- 📄 **PDF экспорт** результатов анализа
- 🤖 **Telegram бот** для взаимодействия с пользователями

## 🛠 Установка и запуск

### Требования
- Node.js 18+ 
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Настройка окружения
Создайте файл `.env.local` с необходимыми переменными:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# OpenAI (опционально)
OPENAI_API_KEY=your_openai_api_key

# n8n (опционально)
N8N_API_TOKEN=your_n8n_token
N8N_BASE_URL=http://localhost:5678

# Mapbox (для поиска мест)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3001`

### Запуск Telegram бота
```bash
node telegram-bot.js
```

## 📁 Структура проекта

```
BodyGraph/
├── app/                    # Next.js App Router страницы
│   ├── api/               # API endpoints
│   ├── astrology/         # Страницы астрологии
│   ├── human-design/      # Страницы Human Design
│   ├── modules/           # Выбор модулей
│   ├── profile/           # Управление профилями
│   ├── results/           # Результаты анализа
│   └── welcome/           # Приветственная страница
├── components/            # React компоненты
├── lib/                   # Утилиты и библиотеки
├── scripts/               # Скрипты и тесты
└── telegram-bot.js        # Telegram бот
```

## 🔧 API Endpoints

### Human Design
- `POST /api/human-design/calculate` - расчет Human Design

### Астрология
- `POST /api/astrology-simple` - упрощенный расчет астрологии
- `POST /api/astrology/transits` - расчет транзитов

### Поиск мест
- `GET /api/search-cities` - поиск городов

## 🎨 Дизайн

Приложение использует космическую тему с:
- 🌌 Темный фон с звездным небом
- ⭐ Анимированные падающие звезды
- 🌈 Градиентные элементы в космических тонах
- ✨ Эффекты свечения и мерцания

## 📊 Модули анализа

### Нумерология
- **Число жизненного пути** - основное предназначение
- **Число выражения** - способы самовыражения  
- **Число души** - внутренние стремления
- **Число личности** - внешнее восприятие
- **Биоритмы** - ежедневные энергетические циклы

### Human Design
- **Тип** - Generator, Projector, Manifestor, Reflector
- **Стратегия** - Wait, Wait for Invitation, Inform, Wait for Lunar Cycle
- **Авторитет** - Emotional, Sacral, Splenic, etc.
- **Профиль** - 1/3, 2/4, 3/5, etc.
- **Центры** - активные и неактивные энергетические центры
- **Каналы и ворота** - активированные связи

### Астрология
- **Натальная карта** - позиции планет в знаках
- **Дома** - 12 астрологических домов
- **Транзиты** - текущие влияния планет
- **Аспекты** - углы между планетами

## 🚀 Развертывание

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t cosmic-bodygraph .
docker run -p 3001:3001 cosmic-bodygraph
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте Issue в репозитории или свяжитесь с командой разработки.

---

**Cosmic BodyGraph** - откройте тайны вашей космической сущности! 🌟