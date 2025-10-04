# 🔐 Безопасность и управление ключами

## ⚠️ Важные правила безопасности

### 1. Никогда не коммитьте ключи в репозиторий
- Все API ключи должны храниться только в файле `.env.local`
- Файл `.env.local` добавлен в `.gitignore` и не будет загружен в репозиторий
- Если случайно закоммитили ключи - немедленно их смените!

### 2. Структура ключей

#### Telegram Bot
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

#### n8n Integration
```env
N8N_API_TOKEN=your_n8n_api_token_here
N8N_BASE_URL=http://localhost:5678
```

#### OpenAI ChatGPT
```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### Mapbox (если используется)
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

#### Human Design API
```env
HUMAN_DESIGN_API_KEY=your_human_design_api_key_here
```

#### YooKassa (Payment)
```env
YOOKASSA_SHOP_ID=your_yookassa_shop_id
YOOKASSA_SECRET_KEY=your_yookassa_secret_key
YOOKASSA_TEST_MODE=true
```

### 3. Что делать если ключи скомпрометированы

#### Telegram Bot Token
1. Перейдите к [@BotFather](https://t.me/BotFather)
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Выберите "API Token"
5. Выберите "Regenerate Token"
6. Обновите токен в `.env.local`

#### OpenAI API Key
1. Перейдите на [OpenAI Platform](https://platform.openai.com/api-keys)
2. Найдите скомпрометированный ключ
3. Нажмите "Delete"
4. Создайте новый ключ
5. Обновите ключ в `.env.local`

#### n8n API Token
1. Перейдите в настройки n8n
2. Создайте новый API токен
3. Удалите старый токен
4. Обновите токен в `.env.local`

### 4. Проверка безопасности

#### Перед коммитом всегда проверяйте:
```bash
# Проверить, что .env.local не в git
git status

# Поиск ключей в коде
grep -r "sk-" --exclude-dir=node_modules .
grep -r "8436424954" --exclude-dir=node_modules .
grep -r "eyJ" --exclude-dir=node_modules .
```

#### Если нашли ключи в коде:
1. Немедленно удалите их
2. Смените ключи
3. Обновите `.env.local`
4. Перезапустите приложение

### 5. Рекомендации по безопасности

- Используйте разные ключи для разработки и продакшена
- Регулярно ротируйте ключи (каждые 3-6 месяцев)
- Не делитесь `.env.local` файлом
- Используйте менеджеры паролей для хранения ключей
- Включайте уведомления об использовании API ключей где возможно

### 6. Структура проекта

```
├── .env.local          # ← Ключи (НЕ коммитить!)
├── .gitignore          # ← Защищает .env.local
├── SECURITY.md         # ← Этот файл
└── ...
```

## 🚨 Экстренные действия

Если ключи попали в публичный репозиторий:

1. **Немедленно смените все ключи**
2. **Удалите ключи из истории git:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.local' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Принудительно обновите репозиторий:**
   ```bash
   git push origin --force --all
   ```
4. **Уведомите команду о компрометации**

---

**Помните: Безопасность - это ответственность каждого разработчика! 🔐**
