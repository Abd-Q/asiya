import { useI18n } from "../i18n";
import { useRouter } from "../context/RouterContext";
import { useProducts } from "../context/ProductsContext";
import FlowerDecor from "../components/FlowerDecor";

// МЕНЯЙ ТУТ — СТРАНИЦА ОТДЕЛЬНОЙ НОВОСТИ
const PAGE_BG = "#fffaf0";
const SECTION_PADDING = "76px 28px";
const ARTICLE_IMAGE_HEIGHT = 330;

export default function NewsDetailPage() {
  const { t } = useI18n();
  const { newsId, navigate } = useRouter();
  const { products } = useProducts();

  const article = t.news.articles[newsId] || t.news.articles[0];
  // Берем картинки из любых товаров с фото — циклично по newsId
  const productsWithImages = products.filter((p) => p.image);
  const image = productsWithImages.length > 0
    ? productsWithImages[newsId % productsWithImages.length].image
    : "";

  return (
    <section style={{ ...styles.page, background: PAGE_BG, padding: SECTION_PADDING }}>
      <FlowerDecor variant="light" />

      <article style={styles.article}>
        <button style={styles.backButton} onClick={() => navigate("news")}>← {t.common.back || "Назад"}</button>

        <div style={styles.heroGrid}>
          <div>
            <p style={styles.meta}>{article.src} · {article.date}</p>
            <h1 style={styles.title}>{article.title}</h1>
            <p style={styles.lead}>{article.excerpt}</p>
          </div>

          <div style={styles.imageBox}>
            {image ? (
              <img src={image} alt="" style={{ height: ARTICLE_IMAGE_HEIGHT, maxWidth: "100%", objectFit: "contain", background: "transparent", filter: "drop-shadow(0 24px 34px rgba(45,51,38,.16))" }} />
            ) : (
              <div style={{ height: ARTICLE_IMAGE_HEIGHT, display: "flex", alignItems: "center", justifyContent: "center", color: "#bfb89a" }}>Нет фото</div>
            )}
          </div>
        </div>

        <div style={styles.content}>
          <p>{article.excerpt}</p>
          <p>
            ASIYÄ создаёт натуральную уходовую косметику, вдохновлённую природой Казахстана и культурой Центральной Азии. В каждом продукте бренд соединяет мягкие формулы, эстетичную упаковку и внимание к ежедневному уходу.
          </p>
          <p>
            Мы сохраняем спокойный, чистый и честный подход: понятный состав, аккуратная подача и продукты, которые легко встроить в ежедневную рутину ухода за волосами и телом.
          </p>
          <p>
            Следите за нашими обновлениями, новыми коллекциями и специальными предложениями на сайте ASIYÄ.
          </p>
        </div>
      </article>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { position: "relative", minHeight: "100vh", overflow: "hidden" },
  article: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto" },
  backButton: { border: 0, background: "transparent", color: "#657447", fontWeight: 900, cursor: "pointer", padding: 0, marginBottom: 24 },
  heroGrid: { display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 46, alignItems: "center", marginBottom: 38 },
  meta: { margin: "0 0 14px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  title: { margin: 0, color: "#25301f", fontSize: 56, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1.4 },
  lead: { maxWidth: 720, margin: "24px 0 0", color: "#6f6244", fontSize: 18, lineHeight: 1.75 },
  imageBox: { minHeight: 430, borderRadius: 36, background: "#f6efde", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 70px rgba(45,51,38,.10)" },
  content: { maxWidth: 860, background: "#f6efde", borderRadius: 32, padding: 42, color: "#4d462f", fontSize: 17, lineHeight: 1.9, boxShadow: "0 18px 44px rgba(45,51,38,.08)" },
};
