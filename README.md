# ASIYÄ — сайт + БД + админ-панель

Полноценный проект: фронтенд на React + Vite + TypeScript, бэкенд на Node.js + Express + SQLite (база лежит **внутри проекта**, никаких сторонних сервисов), кастомная админ-панель и i18n с переводами в БД.

## Что внутри

```
asiya-main/
├── src/                  # фронтенд (React + Vite + TS)
│   ├── data/products.ts  # API-клиент (вместо статичного массива)
│   ├── context/          # ProductsContext, RouterContext
│   ├── i18n/             # переводы (статическая база + оверрайды из БД)
│   └── pages/, components/
├── server/               # бэкенд
│   ├── index.js          # Express API
│   ├── db.js             # инициализация SQLite (better-sqlite3)
│   ├── seed.js           # заполнение БД товарами и переводами
│   ├── db/asiya.db       # сам файл БД (создаётся автоматически)
│   ├── uploads/          # загруженные через админку картинки
│   └── admin/            # SPA админ-панели (vanilla JS)
├── public/assets/        # статические картинки (доступны и через бэкенд)
└── package.json
```

## Установка

### 1. Зависимости

```bash
# в корне проекта
npm install

# в server/
cd server && npm install && cd ..
```

### 2. Сидинг базы данных (один раз)

```bash
npm run seed
```

Это создаст SQLite-файл `server/db/asiya.db`, загрузит 18+ товаров (шампуни, бальзамы, гели, мыло, лосьоны, подарочные наборы), 5 категорий, **переводы названий и описаний на ru/kk/en**, а также все UI-строки сайта.

### 3. Запуск

```bash
# фронт + бэк одновременно
npm run dev:all

# или раздельно (в двух терминалах):
npm run dev         # http://localhost:5173 — сайт
npm run dev:server  # http://localhost:4000 — API + админка
```

## Доступы

- **Сайт:** http://localhost:5173
- **API:** http://localhost:4000
- **Админ-панель:** http://localhost:4000/admin

**Логин по умолчанию:** `admin` / `admin123` (смените в админке: "Сменить пароль").

## Что умеет админка

- **Товары** — создание, редактирование, удаление, загрузка фоток (multer, до 10 МБ), выбор главной картинки, переключение `is_active`, теги `new`/`hit`, ссылки на Kaspi/WB/Ozon, переводы (ru/kk/en) для названия и описаний.
- **Категории** — CRUD с переводами.
- **Переводы UI** — таблица всех ключей (`nav.about`, `hero.title` и т.п.) с инлайн-редактированием для всех языков сразу и пакетным сохранением.
- **Смена пароля.**

## Как работают переводы

Сайт использует **гибридную схему**:
1. Статические файлы `src/i18n/{ru,kk,en}.ts` — база (структура с массивами и вложенностью для UI).
2. Поверх неё накатываются оверрайды из БД через `/api/translations/:locale` — ключи в формате `"nav.about"`, `"hero.title"`, `"new_products.checklist.0"`.
3. Если в БД ключ пустой/отсутствует — берётся значение из статики.

Это значит: **редактирование переводов в админке моментально меняет тексты на сайте после перезагрузки страницы**.

Названия и описания товаров — **только из БД**, статики нет.

## API endpoints

### Публичные
- `GET /api/categories`
- `GET /api/products?category=hair&active=1`
- `GET /api/products/:id`
- `GET /api/translations/:locale` — все переводы для языка
- `GET /api/translations` — все переводы

### Админские (Bearer token)
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/change-password`
- `POST /api/admin/upload` — multipart
- CRUD: `/api/admin/products[/:id]`, `/api/admin/categories[/:id]`, `/api/admin/translations[/:id|/bulk]`

## Переменные окружения (опционально)

Создайте `.env.local` в корне:

```
VITE_API_URL=http://localhost:4000
```

Если бэкенд хостится отдельно — укажите его URL здесь.

## Производственная сборка

```bash
npm run build           # фронт → dist/
cd server && npm start  # API + админка на :4000
```

Можно настроить Nginx так, чтобы он раздавал `dist/` как статику, а `/api/*`, `/admin/*`, `/uploads/*` проксировал на `:4000`.

## Что использовано

- **Фронт:** React 18, Vite 5, TypeScript 5
- **Бэк:** Express 4, better-sqlite3 (синхронный, файловый), multer (загрузка)
- **Админка:** vanilla JS (без сборки) + CSS — лежит в `server/admin/`
- **БД:** SQLite в одном файле `server/db/asiya.db`

Никаких внешних сервисов (Firebase, Supabase, Strapi и т.п.) — всё работает локально.
