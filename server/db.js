// server/db.js
// Инициализация SQLite — файл базы лежит прямо в проекте (server/db/asiya.db).
// Никаких сторонних сервисов — всё локально.
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname, "db");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const DB_PATH = path.join(DB_DIR, "asiya.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ===== Схема =====
// Категории + их переводы хранятся в category_translations.
// Продукты + переводы (название, описание) хранятся в product_translations.
// Изображения продуктов — отдельная таблица product_images (для нескольких фото).
// UI-переводы (кнопки, заголовки страниц и т.д.) хранятся в translations
//   как key/locale/value — это полная замена для статичных i18n-файлов.

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS category_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(category_id, locale),
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    vol TEXT,
    tag TEXT DEFAULT '',
    kaspi TEXT DEFAULT '',
    wb TEXT DEFAULT '',
    ozon TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS product_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    UNIQUE(product_id, locale),
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    locale TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(key, locale)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_product_translations_product ON product_translations(product_id);
  CREATE INDEX IF NOT EXISTS idx_translations_key_locale ON translations(key, locale);
`);

// Создаём дефолтного админа, если ещё нет
const adminCount = db.prepare("SELECT COUNT(*) AS c FROM admins").get().c;
if (adminCount === 0) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run(
    "admin",
    "admin123"
  );
  console.log("[db] Создан дефолтный админ: admin / admin123");
}

module.exports = db;
