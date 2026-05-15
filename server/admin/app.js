// Админ-панель ASIYÄ — однофайловое SPA без сборки.
const API = "";  // одинаковый origin
const LOCALES = ["ru", "kk", "en"];
const LOCALE_NAMES = { ru: "Русский", kk: "Қазақша", en: "English" };

const state = {
  token: localStorage.getItem("admin_token") || null,
  username: localStorage.getItem("admin_user") || null,
  page: "products",       // products | product | categories | translations | password
  editingId: null,
  products: [],
  categories: [],
  search: "",
  catFilter: "all",
};

const $app = document.getElementById("app");

// ===== Утилиты =====
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k === "style") node.style.cssText = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v == null) {}
    else if (v === true) node.setAttribute(k, "");
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(c) : c);
  }
  return node;
}

function toast(message, type = "ok") {
  const t = el("div", { class: "toast" + (type === "error" ? " error" : "") }, message);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(API + path, { ...opts, headers });
  if (res.status === 401) {
    state.token = null;
    state.username = null;
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    render();
    throw new Error("Сессия истекла");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(API + "/api/admin/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${state.token}` },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
  return data;
}

// ===== Логин =====
function renderLogin() {
  let username = "admin";
  let password = "";
  let errorText = "";

  function update() {
    $app.innerHTML = "";
    const box = el("div", { class: "login-box" },
      el("h1", {}, "ASIYÄ Admin"),
      el("p", { class: "muted" }, "Войдите для управления каталогом"),
      el("label", {}, "Логин"),
      el("input", {
        type: "text", value: username,
        onInput: (e) => { username = e.target.value; }
      }),
      el("label", {}, "Пароль"),
      el("input", {
        type: "password", value: password,
        onInput: (e) => { password = e.target.value; },
        onKeydown: (e) => { if (e.key === "Enter") login(); }
      }),
      el("button", { onClick: login }, "Войти"),
      errorText ? el("div", { class: "error" }, errorText) : null
    );
    $app.appendChild(el("div", { class: "login" }, box));
  }

  async function login() {
    errorText = "";
    update();
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      state.token = data.token;
      state.username = data.username;
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", data.username);
      render();
    } catch (e) {
      errorText = e.message;
      update();
    }
  }

  update();
}

// ===== Layout =====
function renderLayout(content) {
  $app.innerHTML = "";
  const nav = el("nav", {},
    ...[
      ["products", "Продукты"],
      ["categories", "Категории"],
      ["translations", "Переводы UI"],
      ["password", "Сменить пароль"],
    ].map(([key, label]) =>
      el("button", {
        class: state.page === key ? "active" : "",
        onClick: () => { state.page = key; state.editingId = null; render(); }
      }, label)
    )
  );

  const sidebar = el("aside", { class: "sidebar" },
    el("h2", {}, "ASIYÄ"),
    el("div", { class: "sub" }, "Админ-панель"),
    nav,
    el("button", {
      class: "logout",
      onClick: () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        state.token = null;
        render();
      },
    }, `Выйти (${state.username || ""})`),
  );

  const main = el("main", { class: "main" }, content);
  $app.appendChild(el("div", { class: "layout" }, sidebar, main));
}

// ===== Продукты: список =====
async function renderProductsList() {
  let loading = true;
  renderLayout(el("div", {}, el("h1", {}, "Продукты"), el("p", { class: "lead" }, "Загрузка...")));
  try {
    const [products, categories] = await Promise.all([
      api("/api/admin/products"),
      api("/api/categories"),
    ]);
    state.products = products;
    state.categories = categories;
    loading = false;
  } catch (e) {
    toast(e.message, "error");
  }
  if (loading) return;

  const filtered = state.products.filter((p) => {
    if (state.catFilter !== "all" && p.cat !== state.catFilter) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const names = Object.values(p.names || {}).join(" ").toLowerCase();
      if (!names.includes(q) && !p.slug.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toolbar = el("div", { class: "toolbar" },
    el("button", {
      class: "btn-primary",
      onClick: () => { state.editingId = "new"; state.page = "product"; render(); }
    }, "+ Новый продукт"),
    el("select", {
      onChange: (e) => { state.catFilter = e.target.value; render(); }
    },
      el("option", { value: "all" }, "Все категории"),
      ...state.categories.map((c) => el("option", { value: c.slug, selected: state.catFilter === c.slug }, c.translations.ru || c.slug))
    ),
    el("input", {
      type: "search", placeholder: "Поиск по названию или slug...",
      value: state.search,
      onInput: (e) => { state.search = e.target.value; render(); }
    })
  );

  const grid = filtered.length === 0
    ? el("div", { class: "empty" }, el("div", { class: "icon" }, "📦"), "Ничего не найдено")
    : el("div", { class: "products-grid" },
      ...filtered.map((p) => el("div", {
        class: "prod-card" + (p.is_active ? "" : " inactive"),
        onClick: () => { state.editingId = p.id; state.page = "product"; render(); }
      },
        p.tag ? el("span", { class: `tag ${p.tag}` }, p.tag === "new" ? "Новинка" : "Хит") : null,
        el("div", { class: "img" }, p.image ? el("img", { src: p.image, alt: "" }) : "—"),
        el("h3", {}, p.names?.ru || p.slug),
        el("div", { class: "meta" }, `${p.cat} · ${p.vol || ""}`),
        !p.is_active ? el("div", { class: "meta", style: "color:#c84747;font-weight:700" }, "Скрыт") : null,
      ))
    );

  renderLayout(el("div", {},
    el("h1", {}, "Продукты"),
    el("p", { class: "lead" }, `Всего: ${state.products.length} · показано: ${filtered.length}`),
    toolbar,
    grid
  ));
}

// ===== Продукты: редактор =====
async function renderProductEditor() {
  let categories = state.categories;
  if (!categories.length) {
    try { categories = await api("/api/categories"); state.categories = categories; }
    catch (e) { toast(e.message, "error"); return; }
  }

  const isNew = state.editingId === "new";
  let product = isNew
    ? {
      slug: "",
      category_id: categories[0]?.id || 1,
      vol: "",
      tag: "",
      kaspi: "https://kaspi.kz",
      wb: "https://wildberries.ru",
      ozon: "https://ozon.ru",
      sort_order: 0,
      is_active: 1,
      translations: {},
      images: [],
    }
    : null;

  if (!isNew) {
    try { product = await api("/api/admin/products/" + state.editingId); }
    catch (e) { toast(e.message, "error"); state.page = "products"; render(); return; }
  }

  for (const loc of LOCALES) {
    if (!product.translations[loc]) product.translations[loc] = { name: "", short_desc: "", full_desc: "" };
  }
  if (!Array.isArray(product.images)) product.images = [];

  let activeLang = "ru";

  function update() {
    const fields = el("div", { class: "editor" },
      el("div", { class: "field" }, el("label", {}, "Slug (URL-идентификатор)"),
        el("input", { type: "text", value: product.slug, onInput: (e) => { product.slug = e.target.value; } })),
      el("div", { class: "field" }, el("label", {}, "Категория"),
        el("select", { onChange: (e) => { product.category_id = Number(e.target.value); } },
          ...categories.map((c) => el("option", {
            value: c.id, selected: c.id === product.category_id
          }, c.translations.ru || c.slug)))),
      el("div", { class: "field" }, el("label", {}, "Объём"),
        el("input", { type: "text", value: product.vol, placeholder: "500 мл", onInput: (e) => { product.vol = e.target.value; } })),
      el("div", { class: "field" }, el("label", {}, "Метка"),
        el("select", { onChange: (e) => { product.tag = e.target.value; } },
          el("option", { value: "", selected: !product.tag }, "Нет"),
          el("option", { value: "new", selected: product.tag === "new" }, "Новинка"),
          el("option", { value: "hit", selected: product.tag === "hit" }, "Хит продаж"))),
      el("div", { class: "field" }, el("label", {}, "Порядок сортировки"),
        el("input", { type: "number", value: product.sort_order, onInput: (e) => { product.sort_order = Number(e.target.value) || 0; } })),
      el("div", { class: "field" }, el("label", {}, "Активен"),
        el("select", { onChange: (e) => { product.is_active = e.target.value === "1" ? 1 : 0; } },
          el("option", { value: "1", selected: product.is_active }, "Да (виден на сайте)"),
          el("option", { value: "0", selected: !product.is_active }, "Нет (скрыт)"))),
      el("div", { class: "field full" }, el("label", {}, "Ссылка Kaspi"),
        el("input", { type: "text", value: product.kaspi, onInput: (e) => { product.kaspi = e.target.value; } })),
      el("div", { class: "field" }, el("label", {}, "Ссылка Wildberries"),
        el("input", { type: "text", value: product.wb, onInput: (e) => { product.wb = e.target.value; } })),
      el("div", { class: "field" }, el("label", {}, "Ссылка Ozon"),
        el("input", { type: "text", value: product.ozon, onInput: (e) => { product.ozon = e.target.value; } })),
    );

    // Переводы (по вкладкам)
    const langTabs = el("div", { class: "lang-tabs" },
      ...LOCALES.map((l) => el("button", {
        class: activeLang === l ? "active" : "",
        onClick: () => { activeLang = l; update(); }
      }, LOCALE_NAMES[l]))
    );

    const tr = product.translations[activeLang];
    const langFields = el("div", {},
      el("div", { class: "field" }, el("label", {}, `Название (${activeLang.toUpperCase()})`),
        el("input", { type: "text", value: tr.name, onInput: (e) => { tr.name = e.target.value; } })),
      el("div", { class: "field" }, el("label", {}, `Краткое описание (${activeLang.toUpperCase()})`),
        el("textarea", { onInput: (e) => { tr.short_desc = e.target.value; } }, tr.short_desc || "")),
      el("div", { class: "field" }, el("label", {}, `Полное описание (${activeLang.toUpperCase()})`),
        el("textarea", { style: "min-height:180px", onInput: (e) => { tr.full_desc = e.target.value; } }, tr.full_desc || "")),
    );

    // Изображения
    const imageThumbs = product.images.map((img, idx) => el("div", { class: "image-thumb" },
      el("img", { src: img.url, alt: "" }),
      idx === 0 ? el("span", { class: "badge" }, "Главное") : el("button", {
        class: "make-primary",
        onClick: () => {
          const moved = product.images.splice(idx, 1)[0];
          product.images.unshift(moved);
          update();
        }
      }, "Сделать главным"),
      el("button", {
        class: "remove",
        onClick: () => { product.images.splice(idx, 1); update(); }
      }, "×"),
    ));

    const uploadArea = el("label", { class: "upload-area" },
      el("input", {
        type: "file", accept: "image/*",
        onChange: async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          try {
            const data = await uploadFile(file);
            product.images.push({ url: data.url });
            update();
            toast("Картинка загружена");
          } catch (err) { toast(err.message, "error"); }
        }
      }),
      el("div", { class: "icon" }, "📷"),
      el("div", {}, "Кликните или перетащите файл"),
      el("div", { class: "hint" }, "PNG, JPG, WEBP — до 10 МБ"),
    );

    const imagesSection = el("div", { class: "card" },
      el("label", {}, "Изображения продукта"),
      el("div", { class: "image-grid" }, ...imageThumbs),
      uploadArea
    );

    const actions = el("div", { class: "actions" },
      el("button", { class: "btn btn-save", onClick: save }, isNew ? "Создать продукт" : "Сохранить изменения"),
      el("button", { class: "btn btn-cancel", onClick: () => { state.page = "products"; state.editingId = null; render(); } }, "Отмена"),
      !isNew ? el("button", {
        class: "btn btn-danger",
        onClick: async () => {
          if (!confirm("Удалить продукт безвозвратно?")) return;
          try {
            await api("/api/admin/products/" + product.id, { method: "DELETE" });
            toast("Удалён");
            state.page = "products"; state.editingId = null; render();
          } catch (e) { toast(e.message, "error"); }
        }
      }, "Удалить") : null
    );

    renderLayout(el("div", {},
      el("h1", {}, isNew ? "Новый продукт" : product.translations.ru?.name || product.slug),
      el("p", { class: "lead" }, isNew ? "Заполните поля и добавьте изображение" : `ID: ${product.id} · Slug: ${product.slug}`),
      el("div", { class: "card" }, fields),
      el("div", { class: "card" },
        el("label", { style: "display:block;font-size:11px;font-weight:700;color:var(--olive);margin-bottom:10px;text-transform:uppercase;letter-spacing:1px" }, "Переводы"),
        langTabs, langFields),
      imagesSection,
      actions
    ));
  }

  async function save() {
    if (!product.slug.trim()) return toast("Заполните slug", "error");
    if (!product.translations.ru.name) return toast("Заполните название на русском", "error");
    try {
      if (isNew) {
        const r = await api("/api/admin/products", { method: "POST", body: JSON.stringify(product) });
        toast("Создан");
        state.editingId = r.id;
        state.page = "products";
        render();
      } else {
        await api("/api/admin/products/" + product.id, { method: "PUT", body: JSON.stringify(product) });
        toast("Сохранено");
      }
    } catch (e) { toast(e.message, "error"); }
  }

  update();
}

// ===== Категории =====
async function renderCategories() {
  let cats = [];
  try { cats = await api("/api/categories"); state.categories = cats; }
  catch (e) { toast(e.message, "error"); return; }

  let newCat = { slug: "", translations: { ru: "", kk: "", en: "" }, sort_order: 99 };

  function update() {
    const list = cats.map((c) => {
      const tr = { ru: "", kk: "", en: "", ...c.translations };
      return el("div", { class: "cat-card" },
        el("span", { class: "slug" }, c.slug),
        el("div", { class: "names" },
          el("span", {}, el("b", {}, "RU"), tr.ru),
          el("span", {}, el("b", {}, "KK"), tr.kk),
          el("span", {}, el("b", {}, "EN"), tr.en),
        ),
        el("button", {
          class: "btn btn-cancel",
          onClick: () => editCat(c)
        }, "Редактировать"),
        el("button", {
          class: "btn btn-danger",
          style: "margin:0",
          onClick: async () => {
            if (!confirm(`Удалить категорию "${c.slug}" со всеми её продуктами?`)) return;
            try { await api("/api/admin/categories/" + c.id, { method: "DELETE" }); toast("Удалено"); renderCategories(); }
            catch (e) { toast(e.message, "error"); }
          }
        }, "Удалить")
      );
    });

    const newForm = el("div", { class: "card" },
      el("h3", { style: "margin-bottom:12px;color:var(--dark)" }, "Добавить категорию"),
      el("div", { class: "row" },
        el("div", { class: "field" }, el("label", {}, "Slug"), el("input", { type: "text", value: newCat.slug, onInput: (e) => { newCat.slug = e.target.value; } })),
        el("div", { class: "field" }, el("label", {}, "Название RU"), el("input", { type: "text", value: newCat.translations.ru, onInput: (e) => { newCat.translations.ru = e.target.value; } })),
        el("div", { class: "field" }, el("label", {}, "Название KK"), el("input", { type: "text", value: newCat.translations.kk, onInput: (e) => { newCat.translations.kk = e.target.value; } })),
        el("div", { class: "field" }, el("label", {}, "Название EN"), el("input", { type: "text", value: newCat.translations.en, onInput: (e) => { newCat.translations.en = e.target.value; } })),
        el("button", {
          class: "btn btn-save",
          onClick: async () => {
            if (!newCat.slug || !newCat.translations.ru) return toast("Заполните slug и название RU", "error");
            try {
              await api("/api/admin/categories", { method: "POST", body: JSON.stringify(newCat) });
              toast("Добавлено"); newCat = { slug: "", translations: { ru: "", kk: "", en: "" }, sort_order: 99 };
              renderCategories();
            } catch (e) { toast(e.message, "error"); }
          }
        }, "Добавить"),
      )
    );

    renderLayout(el("div", {},
      el("h1", {}, "Категории"),
      el("p", { class: "lead" }, "Управление категориями товаров"),
      ...list,
      newForm
    ));
  }

  function editCat(c) {
    const tr = { ru: "", kk: "", en: "", ...c.translations };
    const ru = prompt("Название RU:", tr.ru); if (ru == null) return;
    const kk = prompt("Название KK:", tr.kk); if (kk == null) return;
    const en = prompt("Название EN:", tr.en); if (en == null) return;
    api("/api/admin/categories/" + c.id, {
      method: "PUT",
      body: JSON.stringify({ translations: { ru, kk, en } })
    }).then(() => { toast("Сохранено"); renderCategories(); })
      .catch((e) => toast(e.message, "error"));
  }

  update();
}

// ===== UI-переводы =====
async function renderTranslations() {
  let rows = [];
  try { rows = await api("/api/admin/translations"); }
  catch (e) { toast(e.message, "error"); return; }

  // Группируем по ключу
  const byKey = {};
  for (const r of rows) {
    if (!byKey[r.key]) byKey[r.key] = { key: r.key, values: {} };
    byKey[r.key].values[r.locale] = { id: r.id, value: r.value, original: r.value };
  }
  const keys = Object.keys(byKey).sort();
  const filtered = () => state.search
    ? keys.filter((k) => k.toLowerCase().includes(state.search.toLowerCase()) ||
        LOCALES.some((l) => (byKey[k].values[l]?.value || "").toLowerCase().includes(state.search.toLowerCase())))
    : keys;

  let newKey = "";

  function update() {
    const toolbar = el("div", { class: "toolbar" },
      el("input", {
        type: "search", placeholder: "Поиск по ключу или значению...",
        value: state.search,
        onInput: (e) => { state.search = e.target.value; update(); }
      }),
      el("input", {
        type: "text", placeholder: "Новый ключ (например, nav.about)",
        value: newKey, style: "height:42px;border:1px solid var(--border);border-radius:10px;padding:0 12px;font-size:13px;min-width:240px",
        onInput: (e) => { newKey = e.target.value; }
      }),
      el("button", {
        class: "btn-primary",
        onClick: async () => {
          if (!newKey.trim()) return toast("Введите ключ", "error");
          try {
            for (const l of LOCALES) {
              await api("/api/admin/translations", { method: "POST", body: JSON.stringify({ key: newKey.trim(), locale: l, value: "" }) });
            }
            toast("Ключ создан"); newKey = ""; renderTranslations();
          } catch (e) { toast(e.message, "error"); }
        }
      }, "+ Добавить ключ"),
      el("button", { class: "btn-primary", style: "background:var(--success)", onClick: saveAll }, "💾 Сохранить все"),
    );

    const visible = filtered();
    const table = el("table", { class: "translations-table" },
      el("thead", {}, el("tr", {}, el("th", {}, "Ключ"), ...LOCALES.map((l) => el("th", {}, LOCALE_NAMES[l])), el("th", {}, ""))),
      el("tbody", {}, ...visible.map((key) => {
        const row = byKey[key];
        return el("tr", {},
          el("td", { class: "key" }, key),
          ...LOCALES.map((l) => {
            const v = row.values[l] || { value: "" };
            return el("td", {},
              el("input", {
                type: "text", value: v.value,
                onInput: (e) => {
                  v.value = e.target.value;
                  e.target.classList.toggle("changed", v.value !== v.original);
                }
              })
            );
          }),
          el("td", {},
            el("button", {
              class: "btn btn-cancel", style: "padding:4px 10px;height:auto;font-size:11px",
              onClick: async () => {
                if (!confirm(`Удалить ключ "${key}" во всех языках?`)) return;
                for (const l of LOCALES) {
                  const v = row.values[l]; if (v?.id) await api("/api/admin/translations/" + v.id, { method: "DELETE" }).catch(() => {});
                }
                toast("Удалено"); renderTranslations();
              }
            }, "×")
          )
        );
      }))
    );

    renderLayout(el("div", {},
      el("h1", {}, "Переводы интерфейса"),
      el("p", { class: "lead" }, `Всего ключей: ${keys.length} · показано: ${visible.length}`),
      toolbar,
      el("div", { class: "card", style: "padding:0;overflow:hidden" }, table)
    ));
  }

  async function saveAll() {
    const items = [];
    for (const key of keys) {
      const row = byKey[key];
      for (const l of LOCALES) {
        const v = row.values[l];
        if (v && v.value !== v.original) items.push({ key, locale: l, value: v.value });
      }
    }
    if (!items.length) return toast("Нет изменений");
    try {
      await api("/api/admin/translations/bulk", { method: "PUT", body: JSON.stringify({ items }) });
      toast(`Сохранено: ${items.length}`);
      renderTranslations();
    } catch (e) { toast(e.message, "error"); }
  }

  update();
}

// ===== Смена пароля =====
function renderPassword() {
  let oldP = "", newP = "", newP2 = "";
  function update() {
    renderLayout(el("div", {},
      el("h1", {}, "Смена пароля"),
      el("p", { class: "lead" }, "Текущий пользователь: " + (state.username || "")),
      el("div", { class: "card", style: "max-width:400px" },
        el("div", { class: "field" }, el("label", {}, "Текущий пароль"),
          el("input", { type: "password", onInput: (e) => { oldP = e.target.value; } })),
        el("div", { class: "field" }, el("label", {}, "Новый пароль"),
          el("input", { type: "password", onInput: (e) => { newP = e.target.value; } })),
        el("div", { class: "field" }, el("label", {}, "Повторите новый пароль"),
          el("input", { type: "password", onInput: (e) => { newP2 = e.target.value; } })),
        el("button", {
          class: "btn btn-save",
          onClick: async () => {
            if (!oldP || !newP) return toast("Заполните все поля", "error");
            if (newP !== newP2) return toast("Пароли не совпадают", "error");
            if (newP.length < 4) return toast("Минимум 4 символа", "error");
            try {
              await api("/api/admin/change-password", { method: "POST", body: JSON.stringify({ old_password: oldP, new_password: newP }) });
              toast("Пароль изменён");
              oldP = ""; newP = ""; newP2 = ""; update();
            } catch (e) { toast(e.message, "error"); }
          }
        }, "Сохранить")
      )
    ));
  }
  update();
}

// ===== Главный роутер =====
function render() {
  if (!state.token) return renderLogin();
  switch (state.page) {
    case "products": return renderProductsList();
    case "product": return renderProductEditor();
    case "categories": return renderCategories();
    case "translations": return renderTranslations();
    case "password": return renderPassword();
    default: state.page = "products"; return renderProductsList();
  }
}

render();
