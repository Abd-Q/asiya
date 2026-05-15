import { useI18n } from "../i18n";
import FlowerDecor from "../components/FlowerDecor";


// МЕНЯЙ ТУТ — ABOUT
const ABOUT_IMAGE ="/assets/source/asselle_tasmagambetova.jpg";
const ABOUT_IMAGE_WIDTH = 430;
const PAGE_BG = "#fffaf0";
const SECTION_PADDING = "86px 28px";

export default function AboutPage() {
  const { t } = useI18n();

  return (
      <section style={{...styles.page, background: PAGE_BG, padding: SECTION_PADDING}}>
        <FlowerDecor variant="light"/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"/>
        <div style={styles.inner}>
          <div>
            <p style={styles.tag}>{t.about.section_tag}</p>
            <h1 style={styles.title}>{t.about.hero_title}</h1>
            <div style={styles.textBox}>
              {t.about.paragraphs.map((text: string) => <p key={text} style={styles.text}>{text}</p>)}
            </div>
          </div>
          <div style={styles.imageBox}>
            <img src={ABOUT_IMAGE} alt="About ASIYÄ" style={{
              width: ABOUT_IMAGE_WIDTH,
              background: "transparent",
              filter: "drop-shadow(0 22px 30px rgba(45,51,38,.14))"
            }}/>
          </div>
        </div>
      </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {position: "relative", overflow: "hidden", minHeight: "100vh" },
  inner: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 60, alignItems: "center" },
  tag: { margin: "0 2px 12px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, },
  title: { margin: 0, color: "#25301f", fontSize: 58, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1.5 },
  textBox: { marginTop: 28, display: "grid", gap: 14 },
  text: { margin: 0, color: "#6f6244", fontSize: 15, lineHeight: 1.85 },
  imageBox: { minHeight: 480, borderRadius: 36, background: "#f6efde", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 70px rgba(45,51,38,.12)" },
};
