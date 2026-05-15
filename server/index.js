// server/index.js
// Express + SQLite API для сайта ASIYÄ.
// Запуск: node server/index.js  (или npm start из папки server)
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ====== Раздача загруженных изображений ======
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOADS_DIR));

// ====== Раздача статичных ассетов (картинки из public/assets) ======
// Чтобы старые пути типа "/assets/..." продолжали работать через тот же бэкенд.
const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
if (fs.existsSync(ASSETS_DIR)) {
  app.use("/assets", express.static(ASSETS_DIR));
}

// ====== Multer для загрузки картинок ======
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 МБ
  fileFilter: (_req, file, cb) => {
    const ok = /\.(png|jpe?g|gif|webp|svg)$/i.test(file.originalname);
    cb(ok ? null : new Error("Только изображения"), ok);
  },
});

// ====== Лёгкая авторизация для админки ======
// Простой токен в памяти процесса. Этого достаточно для одиночного админа.
const adminTokens = new Map(); // token -> { username, expires }

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Не авторизован" });
  const session = adminTokens.get(token);
  if (!session || session.expires < Date.now()) {
    adminTokens.delete(token);
    return res.status(401).json({ error: "Сессия истекла" });
  }
  // Продлеваем сессию
  session.expires = Date.now() + 1000 * 60 * 60 * 12; // 12 часов
  req.admin = session;
  next();
}

// ============================================================
//                      ПУБЛИЧНЫЕ API
// ============================================================

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Список категорий с переводами
app.get("/api/categories", (_req, res) => {
  const cats = db
    .prepare("SELECT id, slug, sort_order FROM categories ORDER BY sort_order, id")
    .all();
  const tx = db.prepare(
    "SELECT category_id, locale, name FROM category_translations"
  ).all();
  const byCat = {};
  for (const t of tx) {
    if (!byCat[t.category_id]) byCat[t.category_id] = {};
    byCat[t.category_id][t.locale] = t.name;
  }
  const result = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    sort_order: c.sort_order,
    translations: byCat[c.id] || {},
  }));
  res.json(result);
});

// Список продуктов (с фото и переводами).
// Можно фильтровать ?category=hair&active=1
app.get("/api/products", (req, res) => {
  const { category, active } = req.query;
  let sql = `
    SELECT p.id, p.slug, p.vol, p.tag, p.kaspi, p.wb, p.ozon,
           p.sort_order, p.is_active, p.category_id, c.slug AS cat
    FROM products p
    JOIN categories c ON c.id = p.category_id
  `;
  const where = [];
  const params = [];
  if (category && category !== "all") {
    where.push("c.slug = ?");
    params.push(category);
  }
  if (active !== undefined) {
    where.push("p.is_active = ?");
    params.push(active === "1" || active === "true" ? 1 : 0);
  } else {
    where.push("p.is_active = 1");
  }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY p.sort_order, p.id";

  const products = db.prepare(sql).all(...params);
  if (!products.length) return res.json([]);

  const ids = products.map((p) => p.id);
  const placeholders = ids.map(() => "?").join(",");

  const translations = db
    .prepare(
      `SELECT product_id, locale, name, short_desc, full_desc
       FROM product_translations WHERE product_id IN (${placeholders})`
    )
    .all(...ids);

  const images = db
    .prepare(
      `SELECT product_id, url, is_primary, sort_order
       FROM product_images WHERE product_id IN (${placeholders})
       ORDER BY is_primary DESC, sort_order, id`
    )
    .all(...ids);

  const txByProduct = {};
  for (const t of translations) {
    if (!txByProduct[t.product_id]) txByProduct[t.product_id] = {};
    txByProduct[t.product_id][t.locale] = {
      name: t.name,
      short_desc: t.short_desc,
      full_desc: t.full_desc,
    };
  }
  const imgByProduct = {};
  for (const img of images) {
    if (!imgByProduct[img.product_id]) imgByProduct[img.product_id] = [];
    imgByProduct[img.product_id].push({
      url: img.url,
      is_primary: !!img.is_primary,
    });
  }

  res.json(
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      cat: p.cat,
      category_id: p.category_id,
      vol: p.vol || "",
      tag: p.tag || "",
      kaspi: p.kaspi || "",
      wb: p.wb || "",
      ozon: p.ozon || "",
      sort_order: p.sort_order,
      is_active: !!p.is_active,
      translations: txByProduct[p.id] || {},
      images: imgByProduct[p.id] || [],
      image: (imgByProduct[p.id] && imgByProduct[p.id][0] && imgByProduct[p.id][0].url) || "",
    }))
  );
});

// Один продукт
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = db
    .prepare(
      `SELECT p.id, p.slug, p.vol, p.tag, p.kaspi, p.wb, p.ozon,
              p.sort_order, p.is_active, p.category_id, c.slug AS cat
       FROM products p JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`
    )
    .get(id);
  if (!p) return res.status(404).json({ error: "Продукт не найден" });

  const tx = db
    .prepare("SELECT locale, name, short_desc, full_desc FROM product_translations WHERE product_id = ?")
    .all(id);
  const images = db
    .prepare(
      `SELECT id, url, is_primary, sort_order FROM product_images
       WHERE product_id = ? ORDER BY is_primary DESC, sort_order, id`
    )
    .all(id);

  const translations = {};
  for (const t of tx) {
    translations[t.locale] = {
      name: t.name,
      short_desc: t.short_desc,
      full_desc: t.full_desc,
    };
  }

  res.json({
    ...p,
    is_active: !!p.is_active,
    translations,
    images: images.map((i) => ({ id: i.id, url: i.url, is_primary: !!i.is_primary })),
    image: (images[0] && images[0].url) || "",
  });
});

// UI-переводы для конкретной локали (плоский объект key -> value)
app.get("/api/translations/:locale", (req, res) => {
  const locale = req.params.locale;
  const rows = db
    .prepare("SELECT key, value FROM translations WHERE locale = ?")
    .all(locale);
  const result = {};
  for (const r of rows) result[r.key] = r.value;
  res.json(result);
});

// Все UI-переводы (для админки и для приложения сразу всех языков)
app.get("/api/translations", (_req, res) => {
  const rows = db.prepare("SELECT key, locale, value FROM translations").all();
  res.json(rows);
});

// ============================================================
//                       АДМИН API
// ============================================================

// Логин
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Введите логин и пароль" });
  }
  const admin = db
    .prepare("SELECT id, username FROM admins WHERE username = ? AND password = ?")
    .get(username, password);
  if (!admin) return res.status(401).json({ error: "Неверный логин или пароль" });
  const token = makeToken();
  adminTokens.set(token, {
    username: admin.username,
    expires: Date.now() + 1000 * 60 * 60 * 12,
  });
  res.json({ token, username: admin.username });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) adminTokens.delete(token);
  res.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

// Смена пароля
app.post("/api/admin/change-password", requireAdmin, (req, res) => {
  const { old_password, new_password } = req.body || {};
  if (!old_password || !new_password) {
    return res.status(400).json({ error: "Заполните все поля" });
  }
  const row = db
    .prepare("SELECT id FROM admins WHERE username = ? AND password = ?")
    .get(req.admin.username, old_password);
  if (!row) return res.status(400).json({ error: "Старый пароль неверный" });
  db.prepare("UPDATE admins SET password = ? WHERE id = ?").run(new_password, row.id);
  res.json({ ok: true });
});

// ===== Категории =====
app.post("/api/admin/categories", requireAdmin, (req, res) => {
  const { slug, sort_order = 0, translations = {} } = req.body || {};
  if (!slug) return res.status(400).json({ error: "slug обязателен" });
  try {
    const info = db
      .prepare("INSERT INTO categories (slug, sort_order) VALUES (?, ?)")
      .run(slug, sort_order);
    const id = info.lastInsertRowid;
    const ins = db.prepare(
      "INSERT INTO category_translations (category_id, locale, name) VALUES (?, ?, ?)"
    );
    for (const [locale, name] of Object.entries(translations)) {
      if (name) ins.run(id, locale, name);
    }
    res.json({ id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { slug, sort_order, translations } = req.body || {};
  const exists = db.prepare("SELECT id FROM categories WHERE id = ?").get(id);
  if (!exists) return res.status(404).json({ error: "Не найдена" });
  if (slug !== undefined || sort_order !== undefined) {
    db.prepare("UPDATE categories SET slug = COALESCE(?, slug), sort_order = COALESCE(?, sort_order) WHERE id = ?")
      .run(slug ?? null, sort_order ?? null, id);
  }
  if (translations && typeof translations === "object") {
    const upsert = db.prepare(`
      INSERT INTO category_translations (category_id, locale, name) VALUES (?, ?, ?)
      ON CONFLICT(category_id, locale) DO UPDATE SET name = excluded.name
    `);
    for (const [locale, name] of Object.entries(translations)) {
      if (name) upsert.run(id, locale, name);
    }
  }
  res.json({ ok: true });
});

app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  res.json({ ok: true });
});

// ===== Продукты =====
function getProductFull(id) {
  const p = db
    .prepare(
      `SELECT p.*, c.slug AS cat FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`
    )
    .get(id);
  if (!p) return null;
  const tx = db
    .prepare("SELECT locale, name, short_desc, full_desc FROM product_translations WHERE product_id = ?")
    .all(id);
  const images = db
    .prepare("SELECT id, url, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order, id")
    .all(id);
  const translations = {};
  for (const t of tx) translations[t.locale] = { name: t.name, short_desc: t.short_desc, full_desc: t.full_desc };
  return {
    ...p,
    is_active: !!p.is_active,
    translations,
    images: images.map((i) => ({ id: i.id, url: i.url, is_primary: !!i.is_primary })),
  };
}

// Admin: список всех продуктов (включая неактивные)
app.get("/api/admin/products", requireAdmin, (_req, res) => {
  const products = db
    .prepare(
      `SELECT p.id, p.slug, p.vol, p.tag, p.is_active, p.sort_order, p.category_id, c.slug AS cat
       FROM products p JOIN categories c ON c.id = p.category_id
       ORDER BY p.sort_order, p.id`
    )
    .all();
  if (!products.length) return res.json([]);
  const ids = products.map((p) => p.id);
  const placeholders = ids.map(() => "?").join(",");
  const tx = db
    .prepare(`SELECT product_id, locale, name FROM product_translations WHERE product_id IN (${placeholders})`)
    .all(...ids);
  const imgs = db
    .prepare(`SELECT product_id, url FROM product_images WHERE product_id IN (${placeholders}) ORDER BY is_primary DESC, sort_order, id`)
    .all(...ids);
  const txByP = {};
  for (const t of tx) {
    if (!txByP[t.product_id]) txByP[t.product_id] = {};
    txByP[t.product_id][t.locale] = t.name;
  }
  const imgByP = {};
  for (const i of imgs) {
    if (!imgByP[i.product_id]) imgByP[i.product_id] = i.url;
  }
  res.json(
    products.map((p) => ({
      ...p,
      is_active: !!p.is_active,
      names: txByP[p.id] || {},
      image: imgByP[p.id] || "",
    }))
  );
});

app.get("/api/admin/products/:id", requireAdmin, (req, res) => {
  const product = getProductFull(Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Не найден" });
  res.json(product);
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const {
    slug,
    category_id,
    vol = "",
    tag = "",
    kaspi = "",
    wb = "",
    ozon = "",
    sort_order = 0,
    is_active = 1,
    translations = {},
    images = [],
  } = req.body || {};

  if (!slug || !category_id) {
    return res.status(400).json({ error: "slug и category_id обязательны" });
  }

  const tr = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO products (slug, category_id, vol, tag, kaspi, wb, ozon, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(slug, category_id, vol, tag, kaspi, wb, ozon, sort_order, is_active ? 1 : 0);
    const id = info.lastInsertRowid;

    const insTx = db.prepare(
      "INSERT INTO product_translations (product_id, locale, name, short_desc, full_desc) VALUES (?, ?, ?, ?, ?)"
    );
    for (const [locale, t] of Object.entries(translations)) {
      insTx.run(id, locale, t.name || "", t.short_desc || "", t.full_desc || "");
    }

    const insImg = db.prepare(
      "INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (?, ?, ?, ?)"
    );
    images.forEach((img, idx) => {
      insImg.run(id, img.url, idx === 0 ? 1 : 0, idx);
    });

    return id;
  });

  try {
    const id = tr();
    res.json({ id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const exists = db.prepare("SELECT id FROM products WHERE id = ?").get(id);
  if (!exists) return res.status(404).json({ error: "Не найден" });

  const {
    slug,
    category_id,
    vol,
    tag,
    kaspi,
    wb,
    ozon,
    sort_order,
    is_active,
    translations,
    images,
  } = req.body || {};

  const tr = db.transaction(() => {
    db.prepare(`
      UPDATE products SET
        slug = COALESCE(?, slug),
        category_id = COALESCE(?, category_id),
        vol = COALESCE(?, vol),
        tag = COALESCE(?, tag),
        kaspi = COALESCE(?, kaspi),
        wb = COALESCE(?, wb),
        ozon = COALESCE(?, ozon),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      slug ?? null,
      category_id ?? null,
      vol ?? null,
      tag ?? null,
      kaspi ?? null,
      wb ?? null,
      ozon ?? null,
      sort_order ?? null,
      is_active === undefined ? null : (is_active ? 1 : 0),
      id
    );

    if (translations && typeof translations === "object") {
      const upsert = db.prepare(`
        INSERT INTO product_translations (product_id, locale, name, short_desc, full_desc)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(product_id, locale) DO UPDATE SET
          name = excluded.name,
          short_desc = excluded.short_desc,
          full_desc = excluded.full_desc
      `);
      for (const [locale, t] of Object.entries(translations)) {
        upsert.run(id, locale, t.name || "", t.short_desc || "", t.full_desc || "");
      }
    }

    if (Array.isArray(images)) {
      db.prepare("DELETE FROM product_images WHERE product_id = ?").run(id);
      const insImg = db.prepare(
        "INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (?, ?, ?, ?)"
      );
      images.forEach((img, idx) => {
        insImg.run(id, img.url, idx === 0 ? 1 : 0, idx);
      });
    }
  });

  try {
    tr();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  res.json({ ok: true });
});

// ===== Загрузка изображений =====
app.post("/api/admin/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не получен" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, name: req.file.originalname, size: req.file.size });
});

// ===== UI-переводы =====
app.get("/api/admin/translations", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT id, key, locale, value FROM translations ORDER BY key, locale").all();
  res.json(rows);
});

app.post("/api/admin/translations", requireAdmin, (req, res) => {
  const { key, locale, value } = req.body || {};
  if (!key || !locale) return res.status(400).json({ error: "key и locale обязательны" });
  db.prepare(`
    INSERT INTO translations (key, locale, value) VALUES (?, ?, ?)
    ON CONFLICT(key, locale) DO UPDATE SET value = excluded.value
  `).run(key, locale, value || "");
  res.json({ ok: true });
});

app.put("/api/admin/translations/bulk", requireAdmin, (req, res) => {
  const items = req.body && req.body.items;
  if (!Array.isArray(items)) return res.status(400).json({ error: "items должен быть массивом" });
  const upsert = db.prepare(`
    INSERT INTO translations (key, locale, value) VALUES (?, ?, ?)
    ON CONFLICT(key, locale) DO UPDATE SET value = excluded.value
  `);
  const tr = db.transaction(() => {
    for (const it of items) {
      if (it && it.key && it.locale) upsert.run(it.key, it.locale, it.value || "");
    }
  });
  try { tr(); res.json({ ok: true, count: items.length }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete("/api/admin/translations/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM translations WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

// ====== Раздача админ-панели (статический HTML/JS) ======
const ADMIN_DIR = path.join(__dirname, "admin");
if (fs.existsSync(ADMIN_DIR)) {
  app.use("/admin", express.static(ADMIN_DIR));
}

// ====== Старт ======
app.listen(PORT, () => {
  console.log(`\n  🌿  ASIYÄ API запущен на http://localhost:${PORT}`);
  console.log(`  📊  Админ-панель: http://localhost:${PORT}/admin`);
  console.log(`  🔑  Логин по умолчанию: admin / admin123\n`);
});
