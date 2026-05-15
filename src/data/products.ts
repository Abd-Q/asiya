export type CategorySlug = "hair" | "body" | "soap" | "sets";

export interface Product {
  id: number;
  slug: string;
  cat: CategorySlug;
  name_ru: string;
  name_kk: string;
  name_en: string;
  desc_ru: string;
  desc_kk: string;
  desc_en: string;
  vol: string;
  tag: "new" | "hit" | "";
  image: string;
  kaspi: string;
  wb: string;
  ozon: string;
}

// ВСЕ ТОВАРЫ ТУТ. Хочешь менять товар — меняй эти строки.
// image — картинка товара.
// kaspi / wb / ozon — ссылки кнопок.
export const PRODUCTS: Product[] = [
  { id: 1, slug: "shampun-dala-badamy", cat: "hair", name_ru: "Шампунь Дала Бадамы", name_kk: "Дала Бадамы шампуні", name_en: "Dala Badamy Shampoo", desc_ru: "Деликатно очищает волосы и укрепляет их от корней до кончиков.", desc_kk: "Шашты нәзік тазалап, тамырынан ұшына дейін нығайтады.", desc_en: "Gently cleanses hair and strengthens it from roots to tips.", vol: "500 мл", tag: "hit", image: "/assets/source/product-1.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 2, slug: "konditsioner-dala-badamy", cat: "hair", name_ru: "Кондиционер Дала Бадамы", name_kk: "Дала Бадамы кондиционері", name_en: "Dala Badamy Conditioner", desc_ru: "Дарит волосам естественное питание и блеск.", desc_kk: "Шашқа табиғи қоректену мен жылтырлық береді.", desc_en: "Gives hair natural nutrition and shine.", vol: "500 мл", tag: "", image: "/assets/source/asselle_tasmagambetova.jpg", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 3, slug: "shampun-jusan-sandal", cat: "hair", name_ru: "Балансирующий шампунь Jusan & Sandal", name_kk: "Jusan & Sandal теңдестіруші шампуні", name_en: "Jusan & Sandal Balancing Shampoo", desc_ru: "Контролирует жирность и восстанавливает баланс волос.", desc_kk: "Майлылықты бақылайды және шаш тепе-теңдігін қалпына келтіреді.", desc_en: "Controls oiliness and restores hair balance.", vol: "500 мл", tag: "new", image: "/assets/source/product-3.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 4, slug: "shampun-jantaq-vanil", cat: "hair", name_ru: "Восстанавливающий шампунь Jantaq & Vanil", name_kk: "Jantaq & Vanil қалпына келтіруші шампуні", name_en: "Jantaq & Vanil Restoring Shampoo", desc_ru: "Восстанавливает поврежденные волосы и возвращает блеск.", desc_kk: "Зақымдалған шашты қалпына келтіреді.", desc_en: "Restores damaged hair and shine.", vol: "500 мл", tag: "", image: "/assets/source/product-4.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 5, slug: "konditsioner-jantaq-vanil", cat: "hair", name_ru: "Восстанавливающий кондиционер Jantaq & Vanil", name_kk: "Jantaq & Vanil қалпына келтіруші кондиционері", name_en: "Jantaq & Vanil Restoring Conditioner", desc_ru: "Помогает вернуть мягкость поврежденным волосам.", desc_kk: "Зақымдалған шашқа жұмсақтық қайтарады.", desc_en: "Helps restore softness to damaged hair.", vol: "500 мл", tag: "", image: "/assets/source/product-2.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 6, slug: "konditsioner-jusan-sandal", cat: "hair", name_ru: "Балансирующий кондиционер Jusan & Sandal", name_kk: "Jusan & Sandal теңдестіруші кондиционері", name_en: "Jusan & Sandal Balancing Conditioner", desc_ru: "Придает волосам мягкость и свежесть.", desc_kk: "Шашқа жұмсақтық пен сергіттік береді.", desc_en: "Gives hair softness and freshness.", vol: "500 мл", tag: "", image: "/assets/source/product-3.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 7, slug: "gel-jas-jusan", cat: "body", name_ru: "Успокаивающий гель для душа Jas Jusan", name_kk: "Жас Жусан тыныштандыратын душ гелі", name_en: "Jas Jusan Soothing Shower Gel", desc_ru: "Расслабляет ароматом молодой полыни.", desc_kk: "Жас жусан иісімен демалдырады.", desc_en: "Relaxes with the scent of young wormwood.", vol: "300 мл", tag: "new", image: "/assets/source/product-4.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 8, slug: "gel-kok-say", cat: "body", name_ru: "Увлажняющий гель для душа Kök Sai", name_kk: "Kök Sai ылғалдандыратын душ гелі", name_en: "Kök Sai Moisturising Shower Gel", desc_ru: "Деликатно очищает и увлажняет кожу.", desc_kk: "Теріні нәзік тазалап, ылғалдандырады.", desc_en: "Gently cleanses and moisturises skin.", vol: "300 мл", tag: "", image: "/assets/source/product-1.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 9, slug: "gel-tashkent-say", cat: "body", name_ru: "Бодрящий гель для душа Tashkent Säy", name_kk: "Tashkent Säy сергіткіш душ гелі", name_en: "Tashkent Säy Energising Shower Gel", desc_ru: "Дарит заряд бодрости и свежести.", desc_kk: "Қуат пен сергіттік береді.", desc_en: "Gives energy and freshness.", vol: "300 мл", tag: "", image: "/assets/source/product-2.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 10, slug: "mylo-bergamot", cat: "soap", name_ru: "Мыло для тела и рук Bergamot", name_kk: "Bergamot дене мен қол сабыны", name_en: "Bergamot Body & Hand Soap", desc_ru: "Освежает, тонизирует и бережно очищает кожу.", desc_kk: "Теріні сергітеді және нәзік тазалайды.", desc_en: "Refreshes, tones and gently cleanses skin.", vol: "350 г", tag: "", image: "/assets/source/ref4.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 11, slug: "mylo-dala-badamy", cat: "soap", name_ru: "Мыло для тела и рук Dala Badamy", name_kk: "Dala Badamy дене мен қол сабыны", name_en: "Dala Badamy Body & Hand Soap", desc_ru: "Глубоко ухаживает за кожей рук и тела.", desc_kk: "Қол мен дене терісін терең күтеді.", desc_en: "Deeply cares for hand and body skin.", vol: "350 г", tag: "hit", image: "/assets/source/ref6.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 12, slug: "mylo-alma-gulu", cat: "soap", name_ru: "Мыло для тела и рук Alma Gülü", name_kk: "Alma Gülü дене мен қол сабыны", name_en: "Alma Gülü Body & Hand Soap", desc_ru: "Аромат яблоневого цветка дарит свежесть и лёгкость.", desc_kk: "Алма гүлінің иісі сергіттік береді.", desc_en: "Apple blossom scent gives freshness and lightness.", vol: "350 г", tag: "new", image: "/assets/source/ref8.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 13, slug: "mylo-lavanda", cat: "soap", name_ru: "Мыло для тела и рук Lavanda", name_kk: "Lavanda дене мен қол сабыны", name_en: "Lavanda Body & Hand Soap", desc_ru: "Успокаивает кожу и дарит расслабление.", desc_kk: "Теріні тыныштандырады.", desc_en: "Soothes skin and gives relaxation.", vol: "350 г", tag: "", image: "/assets/source/Nabor_pack190mm_back_corr.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
  { id: 14, slug: "podarochnyy-nabor", cat: "sets", name_ru: "Подарочный набор ASIYÄ", name_kk: "ASIYÄ сыйлық жиынтығы", name_en: "ASIYÄ Gift Set", desc_ru: "Идеальный подарок для близких в элегантной коробке.", desc_kk: "Жақындарыңызға арналған тамаша сыйлық.", desc_en: "The perfect gift for loved ones in an elegant box.", vol: "Набор", tag: "new", image: "/assets/Nabor_pack190mm_front_corr.png", kaspi: "https://kaspi.kz", wb: "https://wildberries.ru", ozon: "https://ozon.ru" },
];

export const CATEGORY_SLUGS: CategorySlug[] = ["hair", "body", "soap", "sets"];


// Все картинки для сайта берутся только отсюда — из реального списка товаров.
export const PRODUCT_IMAGES = PRODUCTS.map((product) => product.image);
export const PRODUCT_IMAGE = (index: number) => PRODUCTS[index % PRODUCTS.length].image;
