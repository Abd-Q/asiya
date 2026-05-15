import { useI18n } from "../i18n";
import { useRouter } from "../context/RouterContext";
import FlowerDecor from "./FlowerDecor";

// МЕНЯЙ ТУТ — HERO
const HERO_IMAGE = "/assets/source/hero-products.png";
const HERO_IMAGE_WIDTH = 500;
const HERO_PADDING = "92px 28px 86px";
const HERO_BG = "#f6efde";
const HERO_TITLE_SIZE = 76;
const HERO_BUTTON_BG = "#657447";

export default function HeroSection() {
  const { t } = useI18n();
  const { navigate } = useRouter();

  return (
    <section style={{ ...styles.hero, background: HERO_BG, padding: HERO_PADDING }}>
      <FlowerDecor variant="hero" />
      <div style={styles.inner}>
        <div style={styles.textSide}>
          <div style={styles.tag}>{t.hero.tagline}</div>
          <h1 style={{ ...styles.title, fontSize: HERO_TITLE_SIZE }}>{t.hero.slides[0].title}</h1>
          <p style={styles.subtitle}>{t.hero.slides[0].sub}</p>
          <p style={styles.description}>{t.hero.subtitle}</p>

          <div style={styles.actions}>
            <button style={{ ...styles.primaryButton, background: HERO_BUTTON_BG }} onClick={() => navigate("catalog")}>{t.hero.cta_catalog} →</button>
            <button style={styles.secondaryButton} onClick={() => navigate("about")}>{t.hero.cta_about}</button>
          </div>

          <div style={styles.dots}>
            <span style={{ ...styles.dot, background: "#657447" }} />
            <span style={styles.dot} />
            <span style={styles.dot} />
          </div>
        </div>

        <div style={styles.imageSide}>
          <div style={styles.imageGlow} />
          <img src={HERO_IMAGE} alt="ASIYÄ products" style={{ ...styles.heroImage, width: HERO_IMAGE_WIDTH }} />
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  hero: { position: "relative", overflow: "hidden" },
  inner: { maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 70 },
  textSide: { position: "relative", zIndex: 2 },
  tag: { display: "inline-flex", marginBottom: 18, color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2.4 },
  title: { margin: 0, color: "#25301f", lineHeight: .96, letterSpacing: -2.5, fontWeight: 900 },
  subtitle: { maxWidth: 560, margin: "26px 0 0", color: "#405033", fontSize: 19, lineHeight: 1.65, fontWeight: 600 },
  description: { maxWidth: 440, margin: "18px 0 0", color: "#7e704e", fontSize: 15, lineHeight: 1.75 },
  actions: { display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" },
  primaryButton: { height: 52, border: 0, borderRadius: 99, padding: "0 26px", color: "#fffaf0", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { height: 52, border: "1px solid rgba(101,116,71,.35)", borderRadius: 99, padding: "0 26px", background: "rgba(255,255,255,.34)", color: "#25301f", fontWeight: 900, cursor: "pointer" },
  dots: { display: "flex", gap: 10, marginTop: 38 },
  dot: { width: 34, height: 7, borderRadius: 99, background: "rgba(101,116,71,.22)" },
  imageSide: { position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 540 },
  imageGlow: { position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(215,185,120,.55), rgba(215,185,120,0) 65%)" },
  heroImage: { position: "relative", zIndex: 2, height: "auto", objectFit: "contain", filter: "drop-shadow(0 28px 42px rgba(45,51,38,.24))" },
};
