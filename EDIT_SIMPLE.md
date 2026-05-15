# Как быстро менять проект

Я специально сделал без config-файлов.

В каждом файле сверху есть блок `// МЕНЯЙ ТУТ`.
Меняешь только эти строки:

- `src/components/Header.tsx` — лого, topbar, высота хедера, кнопка.
- `src/components/HeroSection.tsx` — hero-картинка, размер картинки, отступы, цвет фона.
- `src/components/ProductCard.tsx` — ширина/высота карточек, высота картинки, кнопки.
- `src/components/Footer.tsx` — футер, контакты, ссылки.
- `src/pages/HomePage.tsx` — главная, подарочный блок, новости, newsletter.
- `src/pages/CatalogPage.tsx` — количество колонок, gap, hero каталога, фильтры.
- `src/pages/AboutPage.tsx` — о бренде.
- `src/pages/WhyPage.tsx` — преимущества.
- `src/pages/NewsPage.tsx` — новости.
- `src/pages/ContactsPage.tsx` — контакты.
- `src/pages/ProductPage.tsx` — страница товара.
- `src/data/products.ts` — товары, картинки, ссылки Kaspi/WB/Ozon.
- `src/i18n/ru.ts`, `kk.ts`, `en.ts` — тексты на 3 языках.

Запуск:

```bash
npm install
npm run dev
```

Проверка сборки:

```bash
npm run build
```

## Листочки и цветочки

Все декоративные цветы/листья находятся здесь:

`src/components/FlowerDecor.tsx`

Там сверху есть блок:

```ts
const SHOW_DECOR = true;
const FLOWER_IMAGE = "/assets/flower-lily.png";
const LEAF_IMAGE = "/assets/branch-leaves.png";
const MIX_IMAGE = "/assets/botanical-mix.png";
const LAVENDER_IMAGE = "/assets/flower-lavender.png";
```

И ниже массивы:

- `HERO_FLOWERS` — декор hero
- `LIGHT_SECTION_FLOWERS` — декор светлых секций
- `DARK_SECTION_FLOWERS` — декор тёмных секций
- `CATALOG_FLOWERS` — декор каталога
- `FOOTER_FLOWERS` — декор футера

Двигаешь элемент так:

```ts
{ image: FLOWER_IMAGE, top: -50, left: -50, width: 190, opacity: 0.24, rotate: -12 }
```

- `top / left / right / bottom` — положение
- `width` — размер
- `opacity` — прозрачность
- `rotate` — поворот

В карточках товаров маленький листик меняется здесь:

`src/components/ProductCard.tsx`

```ts
const CARD_FLOWER_IMAGE = "/assets/branch-leaves.png";
const CARD_FLOWER_WIDTH = 72;
```

## Последняя правка — прозрачные картинки

Я убрал фон у картинок в карточках: теперь фон у `imageBox` прозрачный.

Менять размер товара в карточке:

`src/components/ProductCard.tsx`

```ts
const IMAGE_HEIGHT = 166;
const CARD_MIN_HEIGHT = 322;
```

Картинка товара теперь больше, но расположение сетки не изменено.
HeroSection не трогал.

## Последние правки

- Hero section не трогался: `src/components/HeroSection.tsx`.
- Каталог: верхний правый декоративный блок/картинка убран: `src/pages/CatalogPage.tsx`.
- Все товарные/контентные изображения берутся из `src/data/products.ts` через `product.image` или `PRODUCT_IMAGE(index)`.
- Отдельная страница новости добавлена: `src/pages/NewsDetailPage.tsx`.
- Переход на отдельную новость: кнопка `Читать далее` на главной и странице новостей.
