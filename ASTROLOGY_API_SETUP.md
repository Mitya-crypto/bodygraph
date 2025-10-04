# Настройка Астрологического API

## 🌟 Подключение к Swiss Ephemeris

### 1. Swiss Ephemeris - Основная библиотека

Swiss Ephemeris - это открытая библиотека для точного расчета астрономических данных, основанная на данных NASA JPL.

#### Особенности:
- ✅ Высокая точность расчетов
- ✅ Покрытие периода: 13,201 г. до н.э. - 17,191 г. н.э.
- ✅ Расчет позиций планет, домов, аспектов
- ✅ Поддержка различных систем домов
- ✅ Транзиты и прогрессии

### 2. Установка Swiss Ephemeris

#### Python (рекомендуется для серверной части):
```bash
pip install pyswisseph
```

#### Node.js (для фронтенда):
```bash
npm install swisseph
```

#### Использование в Python:
```python
import swisseph as swe

# Установка пути к файлам эфемерид
swe.set_ephe_path('./ephe')

# Расчет позиции Солнца
julday = swe.julday(1990, 1, 15, 14.5)  # Дата и время
xx, ret = swe.calc_ut(julday, 0)  # Солнце = 0

# Расчет домов (система Placidus)
houses, ascmc = swe.houses(julday, 55.7558, 37.6176, b'P')
```

### 3. Структура API запроса

```typescript
interface AstrologyRequest {
  birthDate: string    // YYYY-MM-DD
  birthTime: string    // HH:MM
  latitude: number     // Широта места рождения
  longitude: number    // Долгота места рождения
  timezone?: string    // Часовой пояс (опционально)
}
```

### 4. Расчет основных элементов

#### Позиции планет:
```python
# Основные планеты
planets = {
    'Sun': 0, 'Moon': 1, 'Mercury': 2, 'Venus': 3, 'Mars': 4,
    'Jupiter': 5, 'Saturn': 6, 'Uranus': 7, 'Neptune': 8, 'Pluto': 9
}

for name, planet_id in planets.items():
    xx, ret = swe.calc_ut(julday, planet_id)
    longitude = xx[0]  # Долгота планеты
    latitude = xx[1]   # Широта планеты
```

#### Расчет домов:
```python
# Системы домов
house_systems = {
    'Placidus': b'P',
    'Koch': b'K', 
    'Equal': b'E',
    'Whole': b'W'
}

houses, ascmc = swe.houses(julday, lat, lon, house_systems['Placidus'])
# houses[0] - cusp дома 1 (Асцендент)
# ascmc[0] - Асцендент
# ascmc[1] - MC (Середина Неба)
```

#### Определение знаков зодиака:
```python
def get_zodiac_sign(longitude):
    signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
             'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    sign_index = int(longitude // 30)
    return signs[sign_index]
```

#### Расчет аспектов:
```python
def calculate_aspects(planets):
    aspects = []
    major_aspects = [0, 60, 90, 120, 180]  # Соединение, секстиль, квадрат, трин, оппозиция
    
    for i, planet1 in enumerate(planets):
        for j, planet2 in enumerate(planets[i+1:], i+1):
            diff = abs(planets[planet1] - planets[planet2])
            if diff > 180:
                diff = 360 - diff
            
            for aspect_angle in major_aspects:
                if abs(diff - aspect_angle) <= 8:  # Орб 8 градусов
                    aspects.append({
                        'planet1': planet1,
                        'planet2': planet2,
                        'aspect': aspect_angle,
                        'orb': abs(diff - aspect_angle)
                    })
    
    return aspects
```

### 5. Альтернативные API

#### Astro-Seek API:
```javascript
// Пример запроса к Astro-Seek
const response = await fetch('https://api.astro-seek.com/natal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '1990-01-15',
    time: '14:30',
    lat: 55.7558,
    lon: 37.6176
  })
})
```

#### AstroAPI:
```javascript
// Другой вариант API
const response = await fetch('https://api.astroapi.com/chart', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    birth_date: '1990-01-15',
    birth_time: '14:30',
    latitude: 55.7558,
    longitude: 37.6176,
    house_system: 'placidus'
  })
})
```

### 6. Настройка в коде

#### Конфигурация API:
```typescript
// lib/astrologyApi.ts
const ASTROLOGY_API_CONFIG = {
  swissEphemerisUrl: 'https://your-swiss-ephemeris-api.com/v1',
  astroApiUrl: 'https://api.astro-seek.com/v1',
  localApiUrl: '/api/astrology',
  timeout: 15000
}
```

#### Функция запроса:
```typescript
export async function fetchAstrologyData(request: AstrologyRequest): Promise<AstrologyResponse> {
  const response = await fetch(`${ASTROLOGY_API_CONFIG.swissEphemerisUrl}/chart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      birth_date: request.birthDate,
      birth_time: request.birthTime,
      latitude: request.latitude,
      longitude: request.longitude,
      house_system: 'placidus'
    })
  })
  
  return response.json()
}
```

### 7. Графическая натальная карта

#### Canvas API для отображения:
```typescript
// components/NatalChart.tsx
const drawNatalChart = (ctx: CanvasRenderingContext2D, chartData: ChartData) => {
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) * 0.8
  
  // Рисуем внешний круг
  ctx.strokeStyle = '#4a9eff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.stroke()
  
  // Рисуем линии домов
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    // ... рисование линий
  }
  
  // Рисуем планеты
  chartData.planets.forEach(planet => {
    const angle = (planet.longitude - 90) * (Math.PI / 180)
    // ... позиционирование планет
  })
}
```

### 8. Системы домов

#### Доступные системы:
- **Placidus** - наиболее популярная
- **Koch** - популярная в Европе
- **Equal** - равные дома
- **Whole Signs** - целые знаки
- **Campanus** - система Кампана
- **Regiomontanus** - система Региомонтана

### 9. Точность расчетов

#### Рекомендации:
- Используйте точное время рождения (до минуты)
- Учитывайте часовой пояс места рождения
- Проверяйте координаты места рождения
- Используйте высокоточные эфемериды

### 10. Лицензирование

#### Swiss Ephemeris:
- ✅ Открытая лицензия
- ✅ Бесплатное использование
- ✅ Можно использовать в коммерческих проектах
- ⚠️ Требуется указание авторства

### 11. Производительность

#### Оптимизация:
- Кэширование расчетов
- Предварительный расчет популярных дат
- Использование Web Workers для тяжелых вычислений
- Сжатие данных эфемерид

### 12. Тестирование

#### Валидация данных:
```typescript
export function validateAstrologyInput(birthDate: string, birthTime: string, latitude: number, longitude: number): boolean {
  const date = new Date(birthDate)
  if (isNaN(date.getTime())) return false
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(birthTime)) return false
  
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return false
  
  return true
}
```

## 📞 Поддержка

- Swiss Ephemeris: [www.astro.com/swisseph](https://www.astro.com/swisseph)
- Документация: [www.astro.com/swisseph/swephinfo_e.htm](https://www.astro.com/swisseph/swephinfo_e.htm)
- Форум: [forum.astro.com](https://forum.astro.com)



