import { useI18n } from "../i18n";
import FlowerDecor from "../components/FlowerDecor";

import { useRouter } from "../context/RouterContext";

// МЕНЯЙ ТУТ — NEWS
const PAGE_BG = "#fffaf0";
const SECTION_PADDING = "20px 28px";
const CARD_HEIGHT = 360;
// ВАЖНО: картинки новостей берутся только из product images.


export default function NewsPage() {
  const { t } = useI18n();
  const { navigate } = useRouter();

  return (
    <section style={{ ...styles.page, background: PAGE_BG, padding: SECTION_PADDING }}>
      <FlowerDecor variant="light" />
      <div style={styles.header}>

        <h1 style={styles.title}>{t.news.hero_title}</h1>
        <p style={styles.subtitle}>{t.news.subtitle}</p>
      </div>

      <div style={styles.grid}>
        {t.news.articles.map((news: any, index: number) => (
          <article key={news.title} style={{ ...styles.card, minHeight: CARD_HEIGHT }}>
            <p style={styles.meta}>{news.src} · {news.date}</p>
            <h3 style={styles.cardTitle}>{news.title}</h3>
            <p style={styles.cardText}>{news.excerpt}</p>
            <button style={styles.button} onClick={() => navigate("newsDetail", { newsId: index })}>{t.news.read_more} →</button>
          </article>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { position: "relative", overflow: "hidden", minHeight: "100vh" },
  header: { position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto 44px", textAlign: "center" },
  tag: { margin: "0 0 12px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  title: { margin: 0, color: "#25301f", fontSize: 58, lineHeight: 1.05, fontWeight: 900 },
  subtitle: { color: "#6f6244", fontSize: 16, lineHeight: 1.7 },
  grid: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 },
  card: { background: "#f6efde", borderRadius: 28, padding: 24, boxShadow: "0 18px 44px rgba(45,51,38,.08)" },
  imageButton: { height: 142, width: "100%", border: 0, borderRadius: 20, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, cursor: "pointer" },
  newsImg: { height: 136, maxWidth: "100%", objectFit: "contain", background: "transparent", filter: "drop-shadow(0 18px 24px rgba(45,51,38,.14))" },
  meta: { margin: 0, color: "#657447", fontSize: 12, fontWeight: 900 },
  cardTitle: { margin: "12px 0", color: "#25301f", fontSize: 21, lineHeight: 1.25 },
  cardText: { margin: 0, color: "#6f6244", fontSize: 14, lineHeight: 1.7 },
  button: { marginTop: 18, border: 0, background: "transparent", color: "#657447", fontWeight: 900, cursor: "pointer", padding: 0 },
};
