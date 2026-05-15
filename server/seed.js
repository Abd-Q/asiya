// server/seed.js
// Заполнение базы реальными товарами и UI-переводами.
// Запускать: node server/seed.js
// Скрипт идемпотентен: безопасно гонять повторно — он чистит таблицы.

const db = require("./db");

console.log("[seed] Очищаем таблицы...");
db.exec(`
  DELETE FROM product_images;
  DELETE FROM product_translations;
  DELETE FROM products;
  DELETE FROM category_translations;
  DELETE FROM categories;
  DELETE FROM translations;
`);

// =====================  КАТЕГОРИИ  =====================
const CATEGORIES = [
  {
    slug: "hair",
    sort_order: 1,
    translations: { ru: "Уход за волосами", kk: "Шаш күтімі", en: "Hair Care" },
  },
  {
    slug: "body",
    sort_order: 2,
    translations: { ru: "Уход за телом", kk: "Дене күтімі", en: "Body Care" },
  },
  {
    slug: "soap",
    sort_order: 3,
    translations: { ru: "Мыло", kk: "Сабын", en: "Soap" },
  },
  {
    slug: "lotion",
    sort_order: 4,
    translations: { ru: "Лосьоны для рук", kk: "Қол лосьондары", en: "Hand Lotions" },
  },
  {
    slug: "sets",
    sort_order: 5,
    translations: { ru: "Подарочные наборы", kk: "Сыйлық жиынтықтары", en: "Gift Sets" },
  },
];

const insCat = db.prepare("INSERT INTO categories (slug, sort_order) VALUES (?, ?)");
const insCatTx = db.prepare(
  "INSERT INTO category_translations (category_id, locale, name) VALUES (?, ?, ?)"
);
const catIdBySlug = {};
for (const c of CATEGORIES) {
  const info = insCat.run(c.slug, c.sort_order);
  catIdBySlug[c.slug] = info.lastInsertRowid;
  for (const [locale, name] of Object.entries(c.translations)) {
    insCatTx.run(info.lastInsertRowid, locale, name);
  }
}
console.log(`[seed] Категорий добавлено: ${CATEGORIES.length}`);

// =====================  ПРОДУКТЫ  =====================
// Полный перечень из каталога ASIYÄ. Каждое описание — на 3 языках.
// Картинки лежат в public/assets, сервер их раздаёт по /assets/...
const PRODUCTS = [
  // ===== HAIR =====
  {
    slug: "shampun-prof",
    cat: "hair",
    vol: "900 мл",
    tag: "hit",
    image: "/assets/product-1.png",
    translations: {
      ru: {
        name: "Профессиональный шампунь",
        short_desc: "Профессиональный уход, которому доверяют мастера.",
        full_desc:
          "Создан специально для мастеров и салонов, где важен результат с первого применения. Шампунь бережно очищает волосы, защищая яркость цвета и восстанавливая структуру после окрашивания, осветления и термического воздействия. В составе — пантенол и глицерин, которые глубоко увлажняют, укрепляют волосы и придают им естественный блеск. Формула без парабенов подходит для частого использования и не вызывает сухости кожи головы.",
      },
      kk: {
        name: "Кәсіби шампунь",
        short_desc: "Шеберлер сенетін кәсіби күтім.",
        full_desc:
          "Шеберлер мен салондарға арналған, бірінші қолданудан нәтиже беретін шампунь. Шашты нәзік тазалап, түсті сақтап, бояудан кейінгі құрылымды қалпына келтіреді. Құрамындағы пантенол мен глицерин шашты терең ылғалдандырып, нығайтып, табиғи жылтыр береді. Парабенсіз формула жиі қолдануға қолайлы.",
      },
      en: {
        name: "Professional Shampoo",
        short_desc: "Professional care trusted by stylists.",
        full_desc:
          "Designed for masters and salons where results matter from the first use. Gently cleanses hair, protects color vibrancy and restores structure after coloring, bleaching and heat styling. Panthenol and glycerin deeply moisturize, strengthen and add natural shine. Paraben-free formula is safe for frequent use.",
      },
    },
  },
  {
    slug: "konditsioner-prof",
    cat: "hair",
    vol: "900 мл",
    tag: "",
    image: "/assets/product-2.png",
    translations: {
      ru: {
        name: "Профессиональный бальзам-кондиционер",
        short_desc: "Волосы как после салона — каждый день.",
        full_desc:
          "Создан для тех, кто ценит качественный уход — идеально подходит для салонов и мастеров. Его формула глубоко питает волосы, возвращает им мягкость, блеск и ухоженный вид уже после первого применения. Восстанавливающие масла и увлажняющие агенты, без парабенов — мягкое и безопасное воздействие, закрывает чешуйки волос делая их гладкими и блестящими.",
      },
      kk: {
        name: "Кәсіби бальзам-кондиционер",
        short_desc: "Күнделікті салон сапасы.",
        full_desc:
          "Сапалы күтімді бағалайтындарға арналған кәсіби кондиционер. Формуласы шашты терең қоректендіреді, жұмсақтық пен жылтырды қайтарады. Қалпына келтіретін майлар мен ылғалдандырғыштар, парабенсіз — нәзік әсер.",
      },
      en: {
        name: "Professional Conditioner",
        short_desc: "Salon-quality hair every day.",
        full_desc:
          "Made for those who value true hair care — ideal for salons and stylists. Deeply nourishes, returns softness, shine and a polished look from the very first use. Restoring oils and moisturizers, paraben-free, seals the hair cuticle for smooth, glossy strands.",
      },
    },
  },
  {
    slug: "shampun-dala-badamy",
    cat: "hair",
    vol: "500 мл",
    tag: "hit",
    image: "/assets/product-1.png",
    translations: {
      ru: {
        name: "Шампунь «Степной миндаль» Dala Badamy",
        short_desc: "Богатство природы для здоровья волос.",
        full_desc:
          "Мягкое и глубокое очищение: эффективно удаляет загрязнения и излишки жира, не пересушивая волосы и кожу головы благодаря деликатной формуле. Витамин В3 (ниацин) улучшает микроциркуляцию кожи головы, укрепляя фолликулы и предотвращая выпадение волос. Без парабенов и SLS, идеально подходит для ежедневного применения, сохраняя естественный баланс волос и кожи головы.",
      },
      kk: {
        name: "Дала Бадамы шампуні",
        short_desc: "Шаш денсаулығына арналған табиғат байлығы.",
        full_desc:
          "Шашты және бас терісін кептірмей, кірді нәзік әрі терең тазалайды. В3 дәрумені (ниацин) бас терісінің қанайналымын жақсартып, түбірлерді нығайтады. Парабен мен SLS жоқ — күнделікті қолдануға қолайлы.",
      },
      en: {
        name: "Dala Badamy Steppe Almond Shampoo",
        short_desc: "Nature's richness for healthy hair.",
        full_desc:
          "Gently and deeply cleanses, removing dirt and excess oil without drying hair or scalp. Vitamin B3 (niacin) improves scalp microcirculation, strengthens follicles and helps prevent hair loss. Free from parabens and SLS — perfect for daily use, maintains natural balance of hair and scalp.",
      },
    },
  },
  {
    slug: "konditsioner-dala-badamy",
    cat: "hair",
    vol: "500 мл",
    tag: "",
    image: "/assets/product-2.png",
    translations: {
      ru: {
        name: "Кондиционер «Степной миндаль» Dala Badamy",
        short_desc: "Естественное питание и блеск.",
        full_desc:
          "Подарите своим волосам естественное питание и блеск с кондиционером Dala Badamy, содержащим 95% натуральных ингредиентов. Этот кондиционер мягко разглаживает и питает волосы, придавая им здоровый и сияющий вид. Облегчает расчёсывание, придает мягкость и шёлковую гладкость.",
      },
      kk: {
        name: "Дала Бадамы кондиционері",
        short_desc: "Табиғи қоректену және жылтыр.",
        full_desc:
          "95% табиғи құрамдағы Dala Badamy кондиционері шашыңызға табиғи қоректену мен жылтыр сыйлайды. Шашты нәзік тегістейді, қоректендіреді, сау әрі жарқыраған көрініс береді.",
      },
      en: {
        name: "Dala Badamy Steppe Almond Conditioner",
        short_desc: "Natural nourishment and shine.",
        full_desc:
          "Give your hair natural nourishment and shine with Dala Badamy conditioner, made with 95% natural ingredients. Smooths and feeds the hair, leaving it healthy and radiant. Makes combing easier and adds silky softness.",
      },
    },
  },
  {
    slug: "shampun-jusan-sandal",
    cat: "hair",
    vol: "500 мл",
    tag: "new",
    image: "/assets/product-3.png",
    translations: {
      ru: {
        name: "Балансирующий шампунь «Полынь & Сандал» Jusan & Sandal",
        short_desc: "Свежесть и легкость здоровых волос.",
        full_desc:
          "Контроль жирности: регулирует работу сальных желез, уменьшая избыточное выделение кожного сала. Глубоко очищает кожу головы, удаляя загрязнения и излишки жира. Сандал смягчает и успокаивает кожу головы, снимая раздражение и зуд. Без парабенов и SLS — деликатное и эффективное очищение.",
      },
      kk: {
        name: "Jusan & Sandal теңдестіруші шампуні",
        short_desc: "Сау шаштың сергіттігі мен жеңілдігі.",
        full_desc:
          "Май бөлуді реттейді, бас терісін терең тазалайды. Сандал бас терісін жұмсартып, тітіркену мен қышынуды басады. Парабенсіз және SLS-сіз — нәзік әрі тиімді тазарту.",
      },
      en: {
        name: "Jusan & Sandal Balancing Shampoo",
        short_desc: "Freshness and lightness of healthy hair.",
        full_desc:
          "Controls oiliness by regulating sebum production. Deeply cleanses the scalp from impurities and excess oil. Sandalwood softens and soothes the scalp, calming irritation and itching. Paraben- and SLS-free for gentle yet effective cleansing.",
      },
    },
  },
  {
    slug: "konditsioner-jusan-sandal",
    cat: "hair",
    vol: "500 мл",
    tag: "",
    image: "/assets/product-3.png",
    translations: {
      ru: {
        name: "Балансирующий кондиционер «Полынь & Сандал» Jusan & Sandal",
        short_desc: "Мягкость, гладкость и контроль жирности.",
        full_desc:
          "Мягко восстанавливает и поддерживает здоровый баланс волос. Состав из 95% природных компонентов, лёгкая структура эффективно регулирует выделение сала. Приятный натуральный аромат создаёт ощущение свежести и заботы.",
      },
      kk: {
        name: "Jusan & Sandal теңдестіруші кондиционері",
        short_desc: "Жұмсақтық, тегістік және май бақылауы.",
        full_desc:
          "Шаштың сау тепе-теңдігін нәзік қалпына келтіреді. 95% табиғи құрам, жеңіл құрылым май бөлуді тиімді реттейді. Жағымды табиғи иіс күтімді ләззатқа айналдырады.",
      },
      en: {
        name: "Jusan & Sandal Balancing Conditioner",
        short_desc: "Softness, smoothness and oil control.",
        full_desc:
          "Gently restores and maintains healthy hair balance. 95% natural ingredients with a light texture that regulates sebum effectively. A pleasant natural aroma turns hair care into a ritual.",
      },
    },
  },
  {
    slug: "shampun-jantaq-vanil",
    cat: "hair",
    vol: "500 мл",
    tag: "",
    image: "/assets/product-4.png",
    translations: {
      ru: {
        name: "Восстанавливающий шампунь «Жантак & Ваниль» Jantaq & Vanil",
        short_desc: "Богатство природы для силы волос.",
        full_desc:
          "Мягко очищает и глубоко восстанавливает структуру повреждённых волос, возвращая им силу и блеск. Д-Пантенол увлажняет и укрепляет, делая волосы гладкими и послушными. Восстанавливает кератиновый слой, повышая прочность и эластичность. Без парабенов и SLS — безопасно для ежедневного применения.",
      },
      kk: {
        name: "Jantaq & Vanil қалпына келтіруші шампуні",
        short_desc: "Шаш күшіне арналған табиғат байлығы.",
        full_desc:
          "Зақымдалған шаштың құрылымын нәзік тазалап, терең қалпына келтіреді. Д-Пантенол ылғалдандырып, нығайтады. Кератин қабатын қалпына келтіріп, беріктікті арттырады. Парабен мен SLS жоқ.",
      },
      en: {
        name: "Jantaq & Vanil Restoring Shampoo",
        short_desc: "Nature's power for stronger hair.",
        full_desc:
          "Gently cleanses and deeply restores damaged hair structure, returning strength and shine. D-Panthenol hydrates and strengthens for smooth, manageable hair. Rebuilds the keratin layer, improving strength and elasticity. Paraben- and SLS-free for daily use.",
      },
    },
  },
  {
    slug: "konditsioner-jantaq-vanil",
    cat: "hair",
    vol: "500 мл",
    tag: "",
    image: "/assets/product-2.png",
    translations: {
      ru: {
        name: "Восстанавливающий кондиционер «Жантак & Ваниль» Jantaq & Vanil",
        short_desc: "Сила и блеск поврежденных волос.",
        full_desc:
          "Защищает цвет от вымывания, укрепляет и восстанавливает структуру волос благодаря 95% натуральных ингредиентов. Делает волосы более прочными, эластичными, придает природный блеск и мягкость.",
      },
      kk: {
        name: "Jantaq & Vanil қалпына келтіруші кондиционері",
        short_desc: "Зақымдалған шашқа күш пен жылтыр.",
        full_desc:
          "Бояудың түсін сақтайды, шаштың құрылымын қалпына келтіреді. 95% табиғи құрам. Шашты беріктендіреді, табиғи жылтыр мен жұмсақтық береді.",
      },
      en: {
        name: "Jantaq & Vanil Restoring Conditioner",
        short_desc: "Strength and shine for damaged hair.",
        full_desc:
          "Protects color from fading, strengthens and rebuilds hair structure with 95% natural ingredients. Makes hair stronger and more elastic, restoring natural shine and softness.",
      },
    },
  },

  // ===== BODY =====
  {
    slug: "gel-jas-jusan",
    cat: "body",
    vol: "300 мл",
    tag: "new",
    image: "/assets/product-4.png",
    translations: {
      ru: {
        name: "Успокаивающий гель для душа «Молодая полынь» Jas Jusan",
        short_desc: "Мир свежести и заботы.",
        full_desc:
          "Экстракт молодой полыни снижает покраснение и раздражение благодаря противовоспалительным свойствам. Поддерживает водный баланс кожи, защищает от свободных радикалов и преждевременного старения. Деликатное очищение для чувствительной кожи.",
      },
      kk: {
        name: "Жас Жусан тыныштандыратын душ гелі",
        short_desc: "Сергіттік пен қамқорлық әлемі.",
        full_desc:
          "Жас жусан сығындысы қызаруды басады, тітіркенуді азайтады. Терінің ылғал балансын сақтайды, бос радикалдардан қорғайды. Сезімтал теріге арналған нәзік тазарту.",
      },
      en: {
        name: "Jas Jusan Soothing Shower Gel",
        short_desc: "A world of freshness and care.",
        full_desc:
          "Young wormwood extract reduces redness and irritation with its anti-inflammatory properties. Maintains skin's moisture balance and protects from free radicals. Gentle cleansing for sensitive skin.",
      },
    },
  },
  {
    slug: "gel-kok-say",
    cat: "body",
    vol: "300 мл",
    tag: "",
    image: "/assets/product-1.png",
    translations: {
      ru: {
        name: "Увлажняющий гель для душа «Зеленый чай» Kök Şäi",
        short_desc: "Глубокое увлажнение и свежесть природы.",
        full_desc:
          "Деликатно удаляет загрязнения, не нарушая защитный барьер кожи. Без парабенов и SLS. Экстракт зеленого чая, насыщенный антиоксидантами, защищает кожу от свободных радикалов и преждевременного старения. Освежает и тонизирует.",
      },
      kk: {
        name: "Kök Şäi ылғалдандыратын душ гелі",
        short_desc: "Терең ылғалдандыру және табиғи сергіттік.",
        full_desc:
          "Терінің қорғаныс кедергісін бұзбай, кірді нәзік кетіреді. Парабен мен SLS жоқ. Жасыл шай сығындысы антиоксиданттарға бай — теріні бос радикалдардан қорғайды, сергітеді.",
      },
      en: {
        name: "Kök Şäi Moisturising Shower Gel",
        short_desc: "Deep hydration and nature's freshness.",
        full_desc:
          "Gently removes impurities without disrupting the skin barrier. Free from parabens and SLS. Green tea extract, rich in antioxidants, protects the skin from free radicals and refreshes.",
      },
    },
  },
  {
    slug: "gel-tashkent-say",
    cat: "body",
    vol: "300 мл",
    tag: "",
    image: "/assets/product-2.png",
    translations: {
      ru: {
        name: "Бодрящий гель для душа «Ташкентский чай» Taşkent Şäiy",
        short_desc: "Пробуди энергию свежести в каждом прикосновении.",
        full_desc:
          "Гель Taşkent Şäiy пробуждает кожу, наполняя её энергией и свежестью благодаря экстракту ташкентского чая. Тонизирующий аромат поднимает настроение и придает бодрость на весь день. Подходит для всех типов кожи, без SLS.",
      },
      kk: {
        name: "Tashkent Şäiy сергіткіш душ гелі",
        short_desc: "Әр жанасуда сергіттік энергиясын ояту.",
        full_desc:
          "Tashkent Şäiy гелі теріні оятып, энергия мен сергіттікке толтырады. Тонизаторлық хош иіс күнделікті көңіл-күйді көтереді. Барлық тері түрлеріне қолайлы, SLS-сіз.",
      },
      en: {
        name: "Tashkent Şäiy Energising Shower Gel",
        short_desc: "Awaken energy in every touch.",
        full_desc:
          "Taşkent Şäiy shower gel wakes up the skin and fills it with freshness through Tashkent tea extract. The tonic aroma lifts the mood and energises for the whole day. Suitable for all skin types, SLS-free.",
      },
    },
  },

  // ===== SOAP =====
  {
    slug: "mylo-dala-badamy",
    cat: "soap",
    vol: "100 г",
    tag: "hit",
    image: "/assets/source/ref6.png",
    translations: {
      ru: {
        name: "Мыло «Степной миндаль» Dala Badamy",
        short_desc: "Роскошь натуральных трав для Вашей кожи.",
        full_desc:
          "Идеальный выбор для ежедневного ухода — эффективное очищение, глубокое увлажнение и антиоксидантная защита. Лёгкий аромат степных трав дарит ощущение бодрости. Подходит для всех типов кожи, включая чувствительную.",
      },
      kk: {
        name: "Dala Badamy сабыны",
        short_desc: "Теріңізге арналған табиғи шөптер байлығы.",
        full_desc:
          "Күнделікті күтімге арналған таңдау — тиімді тазарту, терең ылғалдандыру және антиоксидантты қорғаныс. Дала шөптерінің жеңіл иісі сергіттік сыйлайды.",
      },
      en: {
        name: "Dala Badamy Steppe Almond Soap",
        short_desc: "Luxury of natural herbs for your skin.",
        full_desc:
          "The perfect choice for daily care — effective cleansing, deep hydration and antioxidant protection. A light aroma of steppe herbs brings a sense of freshness. Suitable for all skin types, including sensitive.",
      },
    },
  },
  {
    slug: "mylo-alma-gulu",
    cat: "soap",
    vol: "100 г",
    tag: "new",
    image: "/assets/source/ref8.png",
    translations: {
      ru: {
        name: "Мыло «Яблоневый цветок» Alma Gülü",
        short_desc: "Свежесть яблоневого цветка для бережного ухода.",
        full_desc:
          "Идеально для ежедневного использования, обеспечивает деликатный уход за кожей рук и тела. Натуральные ингредиенты и экстракты увлажняют кожу, предотвращая сухость и ощущение стянутости. Мягкое очищение без нарушения естественного баланса кожи.",
      },
      kk: {
        name: "Alma Gülü сабыны",
        short_desc: "Алма гүлінің сергіттігімен нәзік күтім.",
        full_desc:
          "Күнделікті қолдануға тамаша — қол және дене терісіне нәзік күтім жасайды. Табиғи құрамдас бөліктер мен сығындылар теріні ылғалдандырып, кебуден сақтайды. Терінің табиғи балансын бұзбайтын жұмсақ тазарту.",
      },
      en: {
        name: "Alma Gülü Apple Blossom Soap",
        short_desc: "Apple blossom freshness for gentle care.",
        full_desc:
          "Perfect for daily use, provides delicate care for the skin of hands and body. Natural ingredients and extracts hydrate the skin, preventing dryness and tightness. Gentle cleansing without disturbing the skin's natural balance.",
      },
    },
  },
  {
    slug: "mylo-bergamot",
    cat: "soap",
    vol: "100 г",
    tag: "",
    image: "/assets/source/ref4.png",
    translations: {
      ru: {
        name: "Мыло «Бергамот» Bergamot",
        short_desc: "Естественный баланс здоровья и энергии.",
        full_desc:
          "Бережно удаляет загрязнения и излишки жира, не пересушивая кожу. Бергамот придает коже здоровый вид, освежая и наполняя её энергией. Экстракт бергамота обладает антибактериальными свойствами, помогая поддерживать чистоту и здоровье кожи.",
      },
      kk: {
        name: "Bergamot сабыны",
        short_desc: "Денсаулық пен энергияның табиғи балансы.",
        full_desc:
          "Теріні кептірмей, кір мен май артықшылығын нәзік кетіреді. Бергамот теріге сау көрініс беріп, оны сергітеді. Бергамот сығындысы бактерияға қарсы қасиеттерге ие.",
      },
      en: {
        name: "Bergamot Soap",
        short_desc: "Natural balance of health and energy.",
        full_desc:
          "Gently removes impurities and excess oil without drying the skin. Bergamot gives the skin a healthy look, refreshing and energising it. Bergamot extract has antibacterial properties that help maintain skin cleanliness and health.",
      },
    },
  },
  {
    slug: "mylo-lavanda",
    cat: "soap",
    vol: "100 г",
    tag: "",
    image: "/assets/source/Nabor_pack190mm_back_corr.png",
    translations: {
      ru: {
        name: "Мыло «Лаванда» Lavanda",
        short_desc: "Очищение и расслабление с нежным ароматом лаванды.",
        full_desc:
          "Натуральные ингредиенты и экстракт лаванды увлажняют кожу, предотвращая сухость и раздражение. Лаванда обладает антисептическими свойствами. Расслабляющий аромат создает успокаивающую атмосферу — идеально для вечернего расслабления.",
      },
      kk: {
        name: "Lavanda сабыны",
        short_desc: "Лаванданың нәзік иісімен тазарту және демалу.",
        full_desc:
          "Табиғи құрам мен лаванда сығындысы теріні ылғалдандырып, кебу мен тітіркенуден сақтайды. Лаванда антисептикалық қасиеттерге ие. Тыныштандыратын иіс кешкі демалуға өте қолайлы.",
      },
      en: {
        name: "Lavanda Soap",
        short_desc: "Cleansing and relaxation with delicate lavender scent.",
        full_desc:
          "Natural ingredients and lavender extract hydrate the skin, preventing dryness and irritation. Lavender has antiseptic properties. The relaxing aroma creates a calming atmosphere — perfect for evening unwinding.",
      },
    },
  },

  // ===== LOTION =====
  {
    slug: "loson-bergamot",
    cat: "lotion",
    vol: "200 мл",
    tag: "",
    image: "/assets/source/ref4.png",
    translations: {
      ru: {
        name: "Лосьон для рук «Бергамот»",
        short_desc: "Свежесть и забота для ваших рук.",
        full_desc:
          "Лёгкий, быстро впитывающийся лосьон для рук с ароматом бергамота. Питает, увлажняет и восстанавливает кожу, не оставляя ощущения липкости. Оливковое масло смягчает, экстракт зелёного чая успокаивает, аллантоин снимает раздражение, глюкоза и лецитин удерживают влагу.",
      },
      kk: {
        name: "Bergamot қол лосьоны",
        short_desc: "Қолыңызға арналған сергіттік пен қамқорлық.",
        full_desc:
          "Бергамот иісімен жеңіл әрі тез сіңетін қол лосьоны. Теріні қоректендіреді, ылғалдандырады және қалпына келтіреді. Зәйтүн майы жұмсартады, жасыл шай сығындысы тыныштандырады, аллантоин тітіркенуді басады.",
      },
      en: {
        name: "Bergamot Hand Lotion",
        short_desc: "Freshness and care for your hands.",
        full_desc:
          "Light, fast-absorbing hand lotion with bergamot scent. Nourishes, moisturises and restores skin without leaving a sticky feel. Olive oil softens, green tea extract soothes, allantoin reduces irritation, glucose and lecithin retain moisture.",
      },
    },
  },
  {
    slug: "loson-alma-gulu",
    cat: "lotion",
    vol: "200 мл",
    tag: "",
    image: "/assets/source/ref8.png",
    translations: {
      ru: {
        name: "Лосьон для рук «Яблоневый цветок»",
        short_desc: "Влага и нежный аромат каждый день.",
        full_desc:
          "Легкий, быстро впитывающийся лосьон с ароматом яблоневого цветка для ежедневного ухода за кожей рук. Питает, увлажняет и восстанавливает, не оставляет ощущения липкости. Оливковое масло, экстракт зелёного чая, аллантоин, глюкоза и лецитин — комплексный уход.",
      },
      kk: {
        name: "Alma Gülü қол лосьоны",
        short_desc: "Күнделікті ылғал және нәзік иіс.",
        full_desc:
          "Алма гүлі иісімен жеңіл лосьон күнделікті қол күтіміне арналған. Қоректендіреді, ылғалдандырады, қалпына келтіреді. Зәйтүн майы, жасыл шай сығындысы, аллантоин — кешенді күтім.",
      },
      en: {
        name: "Apple Blossom Hand Lotion",
        short_desc: "Moisture and a tender scent every day.",
        full_desc:
          "Light, fast-absorbing lotion with apple blossom scent for daily hand care. Nourishes, moisturises and restores without a sticky feel. Olive oil, green tea extract, allantoin, glucose and lecithin — comprehensive care.",
      },
    },
  },
  {
    slug: "loson-dala-badamy",
    cat: "lotion",
    vol: "200 мл",
    tag: "",
    image: "/assets/source/ref6.png",
    translations: {
      ru: {
        name: "Лосьон для рук «Степной миндаль»",
        short_desc: "Бережно питает с природной свежестью.",
        full_desc:
          "Лёгкий, быстро впитывающийся лосьон с ароматом степного миндаля для ежедневного ухода за кожей рук. Питает, увлажняет и восстанавливает кожу. Оливковое масло защищает от сухости и трещин, экстракт зелёного чая успокаивает, аллантоин ускоряет регенерацию.",
      },
      kk: {
        name: "Dala Badamy қол лосьоны",
        short_desc: "Табиғи сергіттікпен нәзік қоректендіру.",
        full_desc:
          "Дала бадамы иісімен жеңіл лосьон күнделікті қол күтіміне арналған. Теріні қоректендіреді, ылғалдандырады, қалпына келтіреді. Зәйтүн майы кебуден қорғайды.",
      },
      en: {
        name: "Steppe Almond Hand Lotion",
        short_desc: "Gently nourishes with natural freshness.",
        full_desc:
          "Light, fast-absorbing lotion with steppe almond scent for daily hand care. Nourishes, moisturises and restores the skin. Olive oil protects from dryness and cracks, green tea extract soothes, allantoin speeds up regeneration.",
      },
    },
  },

  // ===== SETS =====
  {
    slug: "podarochnyy-nabor",
    cat: "sets",
    vol: "Набор",
    tag: "new",
    image: "/assets/Nabor_pack190mm_front_corr.png",
    translations: {
      ru: {
        name: "Подарочный набор ASIYÄ",
        short_desc: "Идеальный подарок для близких в элегантной коробке.",
        full_desc:
          "Идеальный подарок для близких — наборы натуральной косметики ASIYÄ. Каждый набор включает тщательно подобранные продукты: шампуни и кондиционеры, гели для душа, мыло для тела и рук, лосьон для рук. Упакованы в элегантную подарочную коробку.",
      },
      kk: {
        name: "ASIYÄ сыйлық жиынтығы",
        short_desc: "Әсем қорапта жақындарға арналған тамаша сыйлық.",
        full_desc:
          "Жақындарыңызға арналған тамаша сыйлық — ASIYÄ табиғи косметика жиынтығы. Әр жиынтыққа шампуньдер мен кондиционерлер, душ гельдері, дене мен қол сабыны, қол лосьоны кіреді. Әсем сыйлық қорапта.",
      },
      en: {
        name: "ASIYÄ Gift Set",
        short_desc: "The perfect gift for loved ones in an elegant box.",
        full_desc:
          "The perfect gift for loved ones — ASIYÄ natural cosmetics sets. Each set includes carefully chosen products: shampoos and conditioners, shower gels, body and hand soap, hand lotion. Packed in an elegant gift box.",
      },
    },
  },
];

const insP = db.prepare(`
  INSERT INTO products (slug, category_id, vol, tag, kaspi, wb, ozon, sort_order, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);
const insTx = db.prepare(`
  INSERT INTO product_translations (product_id, locale, name, short_desc, full_desc)
  VALUES (?, ?, ?, ?, ?)
`);
const insImg = db.prepare(`
  INSERT INTO product_images (product_id, url, is_primary, sort_order)
  VALUES (?, ?, ?, ?)
`);

PRODUCTS.forEach((p, idx) => {
  const catId = catIdBySlug[p.cat];
  if (!catId) throw new Error(`Категория не найдена: ${p.cat}`);
  const info = insP.run(
    p.slug, catId, p.vol || "", p.tag || "",
    "https://kaspi.kz", "https://wildberries.ru", "https://ozon.ru",
    idx
  );
  const id = info.lastInsertRowid;
  for (const [locale, t] of Object.entries(p.translations)) {
    insTx.run(id, locale, t.name, t.short_desc || "", t.full_desc || "");
  }
  insImg.run(id, p.image, 1, 0);
});
console.log(`[seed] Продуктов добавлено: ${PRODUCTS.length}`);

// =====================  UI-ПЕРЕВОДЫ  =====================
// Те же ключи, которые сейчас разбросаны по i18n/ru.ts, kk.ts, en.ts.
// Теперь они живут в базе и фронт подгружает их по API.
const UI = {
  ru: {
    "nav.about": "О НАС",
    "nav.why_us": "ПОЧЕМУ НАС ВЫБИРАЮТ",
    "nav.catalog": "КАТАЛОГ",
    "nav.news": "ДОБРЫЕ НОВОСТИ",
    "nav.contacts": "КОНТАКТЫ",
    "nav.all_products": "Все продукты",
    "nav.call": "Заказать звонок",

    "common.order": "Заказать",
    "common.learn_more": "Подробнее",
    "common.all": "Все",
    "common.loading": "Загрузка...",
    "common.back": "Назад в каталог",

    "hero.tagline": "Натуральная уходовая косметика",
    "hero.subtitle": "Натуральная уходовая косметика, созданная с любовью в сердце Центральной Азии",
    "hero.cta_catalog": "Смотреть каталог",
    "hero.cta_about": "О бренде",

    "catalog.title": "Линейка продукции ASIYÄ",
    "catalog.subtitle": "Шампуни, кондиционеры, гели для душа, мыло и подарочные наборы — всё в одном месте",
    "catalog.collection": "Коллекция",
    "catalog.empty": "В данной категории пока нет товаров",
    "catalog.tag_new": "Новинка",
    "catalog.tag_hit": "Хит продаж",

    "product.back": "Назад в каталог",
    "product.volume": "Объём",
    "product.category": "Категория",
    "product.production": "Производство",
    "product.production_val": "Telli Ondiris, Алматы",
    "product.certs": "Сертификаты",
    "product.related": "Похожие товары",
    "product.buy_kaspi": "Купить на Kaspi.kz",
    "product.buy_wb": "Купить на Wildberries",
    "product.buy_ozon": "Купить на Ozon",

    "new_products.tag": "Новое",
    "new_products.title": "Подарочные наборы",
    "new_products.desc": "Идеальный подарок для близких — наборы натуральной косметики ASIYÄ. Каждый набор включает тщательно подобранные продукты для полноценного ухода.",
    "new_products.cta": "Смотреть наборы",
    "new_products.checklist.0": "Шампуни и кондиционеры",
    "new_products.checklist.1": "Гели для душа",
    "new_products.checklist.2": "Мыло для тела и рук",
    "new_products.checklist.3": "Лосьон для рук",

    "about.title": "О бренде",
    "about.hero_title": "Красота и наследие Центральной Азии",

    "footer.subscribe_title": "Подпишитесь на новости ASIYÄ",
    "footer.subscribe_desc": "Узнавайте первыми о новинках и акциях",
    "footer.your_email": "Ваш email",
    "footer.subscribe": "Подписаться",
    "footer.stay_tuned": "Будьте в курсе",

    "news.tagline": "Добрые новости",
    "news.title": "Что нового у ASIYÄ",
    "news.read_more": "Читать дальше",
  },
  kk: {
    "nav.about": "БІЗ ТУРАЛЫ",
    "nav.why_us": "НЕГЕ БІЗДІ ТАҢДАЙДЫ",
    "nav.catalog": "КАТАЛОГ",
    "nav.news": "ИГІЛІКТІ ЖАҢАЛЫҚТАР",
    "nav.contacts": "БАЙЛАНЫС",
    "nav.all_products": "Барлық өнімдер",
    "nav.call": "Қоңырау тапсыру",

    "common.order": "Тапсырыс",
    "common.learn_more": "Толығырақ",
    "common.all": "Барлығы",
    "common.loading": "Жүктелуде...",
    "common.back": "Каталогқа қайту",

    "hero.tagline": "Табиғи күтім косметикасы",
    "hero.subtitle": "Орталық Азияның жүрегінде сүйіспеншілікпен жасалған табиғи косметика",
    "hero.cta_catalog": "Каталогты көру",
    "hero.cta_about": "Бренд туралы",

    "catalog.title": "ASIYÄ өнімдер желісі",
    "catalog.subtitle": "Шампуньдер, кондиционерлер, душ гельдері, сабын мен сыйлық жиынтықтары — барлығы бір жерде",
    "catalog.collection": "Коллекция",
    "catalog.empty": "Бұл санатта өнім жоқ",
    "catalog.tag_new": "Жаңалық",
    "catalog.tag_hit": "Хит",

    "product.back": "Каталогқа қайту",
    "product.volume": "Көлемі",
    "product.category": "Санат",
    "product.production": "Өндіріс",
    "product.production_val": "Telli Ondiris, Алматы",
    "product.certs": "Сертификаттар",
    "product.related": "Ұқсас өнімдер",
    "product.buy_kaspi": "Kaspi.kz-те сатып алу",
    "product.buy_wb": "Wildberries-та сатып алу",
    "product.buy_ozon": "Ozon-да сатып алу",

    "new_products.tag": "Жаңа",
    "new_products.title": "Сыйлық жиынтықтары",
    "new_products.desc": "Жақындарыңызға арналған тамаша сыйлық — ASIYÄ табиғи косметика жиынтықтары.",
    "new_products.cta": "Жиынтықтарды көру",
    "new_products.checklist.0": "Шампуньдер мен кондиционерлер",
    "new_products.checklist.1": "Душ гельдері",
    "new_products.checklist.2": "Дене мен қол сабыны",
    "new_products.checklist.3": "Қол лосьоны",

    "about.title": "Бренд туралы",
    "about.hero_title": "Орталық Азияның сұлулығы мен мұрасы",

    "footer.subscribe_title": "ASIYÄ жаңалықтарына жазылыңыз",
    "footer.subscribe_desc": "Жаңалықтар мен акциялар туралы алдымен біліңіз",
    "footer.your_email": "Сіздің email",
    "footer.subscribe": "Жазылу",
    "footer.stay_tuned": "Хабардар болыңыз",

    "news.tagline": "Игілікті жаңалықтар",
    "news.title": "ASIYÄ-да не жаңалық",
    "news.read_more": "Толық оқу",
  },
  en: {
    "nav.about": "ABOUT",
    "nav.why_us": "WHY US",
    "nav.catalog": "CATALOG",
    "nav.news": "GOOD NEWS",
    "nav.contacts": "CONTACTS",
    "nav.all_products": "All products",
    "nav.call": "Request a call",

    "common.order": "Order",
    "common.learn_more": "Learn more",
    "common.all": "All",
    "common.loading": "Loading...",
    "common.back": "Back to catalog",

    "hero.tagline": "Natural skin & hair care",
    "hero.subtitle": "Natural care cosmetics, crafted with love in the heart of Central Asia",
    "hero.cta_catalog": "View catalog",
    "hero.cta_about": "About the brand",

    "catalog.title": "ASIYÄ Product Line",
    "catalog.subtitle": "Shampoos, conditioners, shower gels, soaps and gift sets — all in one place",
    "catalog.collection": "Collection",
    "catalog.empty": "No products in this category yet",
    "catalog.tag_new": "New",
    "catalog.tag_hit": "Bestseller",

    "product.back": "Back to catalog",
    "product.volume": "Volume",
    "product.category": "Category",
    "product.production": "Production",
    "product.production_val": "Telli Ondiris, Almaty",
    "product.certs": "Certificates",
    "product.related": "Related products",
    "product.buy_kaspi": "Buy on Kaspi.kz",
    "product.buy_wb": "Buy on Wildberries",
    "product.buy_ozon": "Buy on Ozon",

    "new_products.tag": "New",
    "new_products.title": "Gift Sets",
    "new_products.desc": "The perfect gift for loved ones — ASIYÄ natural cosmetics sets, carefully selected for complete care.",
    "new_products.cta": "View sets",
    "new_products.checklist.0": "Shampoos and conditioners",
    "new_products.checklist.1": "Shower gels",
    "new_products.checklist.2": "Body and hand soap",
    "new_products.checklist.3": "Hand lotion",

    "about.title": "About the brand",
    "about.hero_title": "Beauty and heritage of Central Asia",

    "footer.subscribe_title": "Subscribe to ASIYÄ news",
    "footer.subscribe_desc": "Be the first to know about new releases and promotions",
    "footer.your_email": "Your email",
    "footer.subscribe": "Subscribe",
    "footer.stay_tuned": "Stay tuned",

    "news.tagline": "Good news",
    "news.title": "What's new at ASIYÄ",
    "news.read_more": "Read more",
  },
};

const insTrans = db.prepare("INSERT INTO translations (key, locale, value) VALUES (?, ?, ?)");
let total = 0;
for (const [locale, dict] of Object.entries(UI)) {
  for (const [key, value] of Object.entries(dict)) {
    insTrans.run(key, locale, value);
    total++;
  }
}
console.log(`[seed] UI-переводов добавлено: ${total}`);

console.log("[seed] ✅ Готово!");
