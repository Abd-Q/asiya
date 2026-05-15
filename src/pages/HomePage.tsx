import { useI18n } from "../i18n";
import { useRouter } from "../context/RouterContext";
import HeroSection from "../components/HeroSection";
import FlowerDecor from "../components/FlowerDecor";
import { PRODUCT_IMAGE } from "../data/products";
import { useState } from "react";

// МЕНЯЙ ТУТ — ГЛАВНАЯ
const GIFT_IMAGES = [PRODUCT_IMAGE(13), PRODUCT_IMAGE(12)];
const GIFT_IMAGE_WIDTH = 500;
const NEWS_CARD_HEIGHT = 330;
const SECTION_PADDING = "82px 28px";
const CREAM_BG = "#f6efde";
const LIGHT_BG = "#fffaf0";
const DARK_BG = "#2f3825";
const PRIMARY = "#657447";
const NEWS_IMAGES = [PRODUCT_IMAGE(0), PRODUCT_IMAGE(2), PRODUCT_IMAGE(10)];

export default function HomePage() {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [giftIndex, setGiftIndex] = useState(0);

  const nextGift = () => {
    setGiftIndex((prev) => (prev + 1) % GIFT_IMAGES.length);
  };

  const prevGift = () => {
    setGiftIndex((prev) => (prev - 1 + GIFT_IMAGES.length) % GIFT_IMAGES.length);
  };

  return (
    <>
      <HeroSection />

      <section style={{ ...styles.section, padding: SECTION_PADDING, background: LIGHT_BG }}>
        <FlowerDecor variant="light" />
        <div style={styles.giftGrid}>
          <div>
            <p style={styles.tag}>{t.new_products.tag}</p>
            <h2 style={styles.title}>{t.new_products.title}</h2>
            <p style={styles.text}>{t.new_products.desc}</p>
            <div style={styles.checklist}>
              {t.new_products.checklist.map((item: string) => <div key={item} style={styles.check}>✓ {item}</div>)}
            </div>
            <button style={{ ...styles.primaryButton, background: PRIMARY }} onClick={() => navigate("catalog", { category: "sets" })}>{t.new_products.cta} →</button>
          </div>

          <div style={styles.giftImageBox}>
            <span style={styles.newBadge}>{t.catalog.tag_new}</span>
            <img
                  src={GIFT_IMAGES[giftIndex]}
                  alt="Gift set"
                  style={{ width: GIFT_IMAGE_WIDTH }}
              />
            <button type="button" onClick={prevGift} style={styles.sliderPrev}>‹</button>
              <button type="button" onClick={nextGift} style={styles.sliderNext}>›</button>
          </div>
        </div>
      </section>

      <section style={{...styles.section, padding: SECTION_PADDING, background: DARK_BG, color: "#fffaf0"}}>
        <FlowerDecor variant="dark"/>
        <div style={styles.centerTitle}>
          <p style={{...styles.tag, color: "#d7b978"}}>{t.news.tagline}</p>
          <h2 style={{ ...styles.title, color: "#fffaf0" }}>{t.news.title}</h2>
        </div>

        <div style={styles.newsGrid}>
          {t.news.articles.slice(0, 3).map((news: any, index: number) => (
            <article key={index} style={{ ...styles.newsCard, minHeight: NEWS_CARD_HEIGHT }}>
              <p style={styles.newsMeta}>{news.src} · {news.date}</p>
              <h3 style={styles.newsTitle}>{news.title}</h3>
              <p style={styles.newsText}>{news.excerpt}</p>
              <button style={styles.readMore} onClick={() => navigate("newsDetail", { newsId: index })}>{t.news.read_more} →</button>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...styles.section, padding: SECTION_PADDING, background: CREAM_BG }}>
        <FlowerDecor variant="light" />
        <div style={styles.newsletter}>
          <p style={styles.tag}>{t.footer.stay_tuned}</p>
          <h2 style={styles.title}>{t.footer.subscribe_title}</h2>
          <p style={styles.text}>{t.footer.subscribe_desc}</p>
          <form style={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input style={styles.emailInput} type="email" placeholder={t.footer.your_email} />
            <button style={{ ...styles.primaryButton, background: PRIMARY }}>{t.footer.subscribe}</button>
          </form>
        </div>
      </section>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { position: "relative", overflow: "hidden" },
  giftGrid: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 70 },
  tag: { margin: "0 0 12px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  title: { margin: 0, color: "#25301f", fontSize: 48, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1.3 },
  text: { maxWidth: 620, color: "#6f6244", fontSize: 15, lineHeight: 1.85, margin: "22px 0 0" },
  checklist: { display: "grid", gap: 10, margin: "26px 0 30px" },
  check: { color: "#25301f", fontWeight: 800, fontSize: 15 },
  primaryButton: { height: 50, border: 0, borderRadius: 99, padding: "0 24px", color: "#fffaf0", fontWeight: 900, cursor: "pointer" },
  giftImageBox: { position: "relative", minHeight: 450, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 38, background: "#fffaf0", boxShadow: "0 24px 70px rgba(45,51,38,.12)" },
  newBadge: { position: "absolute", top: 28, right: 28, background: "#d7b978", color: "#25301f", height: 38, display: "flex", alignItems: "center", padding: "0 16px", borderRadius: 99, fontWeight: 900, fontSize: 12 },
  centerTitle: { position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto 44px", textAlign: "center" },
  newsGrid: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  newsCard: { background: "rgba(255,250,240,.08)", border: "1px solid rgba(255,250,240,.14)", borderRadius: 28, padding: 24 },
  newsImage: { height: 130, borderRadius: 20, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  newsImg: { height: 124, maxWidth: "100%", objectFit: "contain", background: "transparent", filter: "drop-shadow(0 18px 24px rgba(0,0,0,.14))" },
  newsMeta: { color: "#d7b978", fontSize: 12, fontWeight: 900, margin: 0 },
  newsTitle: { color: "#fffaf0", fontSize: 20, lineHeight: 1.25, margin: "12px 0" },
  newsText: { color: "rgba(255,250,240,.72)", fontSize: 14, lineHeight: 1.65, margin: 0 },
  readMore: { marginTop: 18, border: 0, background: "transparent", color: "#d7b978", fontWeight: 900, cursor: "pointer", padding: 0 },
  newsletter: { position: "relative", zIndex: 2, maxWidth: 980, margin: "0 auto", padding: 50, borderRadius: 36, background: "#fffaf0", textAlign: "center", boxShadow: "0 24px 70px rgba(45,51,38,.10)" },
  newsletterForm: { margin: "30px auto 0", maxWidth: 620, display: "flex", gap: 10, background: "#f6efde", borderRadius: 99, padding: 8 },
  emailInput: { flex: 1, border: 0, outline: 0, background: "transparent", padding: "0 18px", fontSize: 14 },
  sliderPrev: {
    position: "absolute",
    left: 18,
    top: "50%",
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: 0,
    background: "rgba(37,48,31,.18)",
    color: "#25301f",
    fontSize: 34,
    lineHeight: "38px",
    cursor: "pointer",
    zIndex: 5,
  },

  sliderNext: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: 0,
    background: "rgba(37,48,31,.18)",
    color: "#25301f",
    fontSize: 34,
    lineHeight: "38px",
    cursor: "pointer",
    zIndex: 5,
  },
};
