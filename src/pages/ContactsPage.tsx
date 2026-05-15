import { useI18n } from "../i18n";
import FlowerDecor from "../components/FlowerDecor";

// МЕНЯЙ ТУТ — CONTACTS
const PAGE_BG = "#f6efde";
const SECTION_PADDING = "20px 28px";
const EMAIL_LINK = "mailto:info@telli.kz";
const INSTAGRAM_LINK = "https://instagram.com/asiya_kazakhstan";
const EMAIL_TEXT = "info@telli.kz";
const INSTAGRAM_TEXT = "@asiya_kazakhstan";

export default function ContactsPage() {
  const { t } = useI18n();

  return (
      <section style={{ ...styles.page, background: PAGE_BG, padding: SECTION_PADDING }}>
        <FlowerDecor variant="light" />

        <div style={styles.header}>
          <h1 style={styles.title}>{t.contacts.hero_title}</h1>
        </div>

        <div style={styles.grid}>
          {/* ЛЕВАЯ КАРТОЧКА */}
          <div style={styles.leftCard}>
            <h2 style={styles.secondTitle}>{t.contacts.coop_title}</h2>
            <p style={styles.text}>{t.contacts.coop_desc}</p>

            <div style={styles.items}>
              {t.contacts.coop_items.map((item: any) => (
                  <div key={item.title} style={styles.item}>
                    <h3 style={styles.itemTitle}>{item.title}</h3>
                    <p style={styles.itemText}>{item.desc}</p>
                  </div>
              ))}
            </div>

            <a href={EMAIL_LINK} style={styles.button}>
              {t.contacts.coop_cta} →
            </a>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div style={styles.rightWrap}>

            {/* КАРТА */}
            <div style={styles.mapBox}>
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.4174936009567!2d76.96097197700355!3d43.221705671125925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836f09c2cfc2eb%3A0x710615cfa5b0d6!2z0KLQtdC70LvQuA!5e0!3m2!1sru!2sus!4v1778818913399!5m2!1sru!2sus"
                  style={styles.map}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* КОНТАКТЫ */}
            <div style={styles.contactCard}>
              <div style={styles.contactLine}>
    <span style={styles.icon}>
      <img src="/icons/2.png" style={styles.iconImg}/>
    </span>
                <span>{t.contacts.address_val}</span>
              </div>

              <a href={EMAIL_LINK} style={styles.contactLine}>
    <span style={styles.icon}>
      <img src="/icons/3.png" style={styles.iconImg}/>
    </span>
                <span>{EMAIL_TEXT}</span>
              </a>

              <a href={INSTAGRAM_LINK} style={styles.contactLine}>
    <span style={styles.icon}>
      <img src="/icons/4.png" style={styles.iconImg}/>
    </span>
                <span>{INSTAGRAM_TEXT}</span>
              </a>
            </div>

          </div>
        </div>
      </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },

  header: {
    position: "relative",
    zIndex: 2,
    maxWidth: 900,
    margin: "0 auto 44px",
    textAlign: "center",
  },

  title: {
    margin: 0,
    color: "#25301f",
    fontSize: 58,
    lineHeight: 1.05,
    fontWeight: 900,
  },

  grid: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr .85fr",
    gap: 28,
    alignItems: "stretch",
  },

  leftCard: {
    alignSelf: "center",
    background: "#fffaf0",
    borderRadius: 32,
    padding: 38,
    boxShadow: "0 18px 44px rgba(45,51,38,.08)",
  },

  rightWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 16,
  },

  mapBox: {
    width: "100%",
    height: 350,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 18px 44px rgba(45,51,38,.12)",
  },

  map: {
    width: "100%",
    height: "100%",
    border: 0,
  },

  contactCard: {
    width: "100%",
    minHeight: 180,
    background: "#6f6244",
    borderRadius: 32,
    padding: 30,
    color: "#fffaf02",
    boxShadow: "0 24px 70px rgba(45,51,38,.14)",
  },

  secondTitle: {
    margin: 0,
    color: "#25301f",
    fontSize: 42,
    lineHeight: 1.1,
  },

  text: {
    color: "#6f6244",
    fontSize: 15,
    lineHeight: 1.8,
  },

  items: {
    display: "grid",
    gap: 14,
    margin: "28px 0",
  },

  item: {
    padding: 18,
    background: "#f6efde",
    borderRadius: 20,
  },

  itemTitle: {
    margin: 0,
    color: "#25301f",
    fontSize: 18,
  },

  itemText: {
    margin: "8px 0 0",
    color: "#6f6244",
    fontSize: 14,
    lineHeight: 1.6,
  },

  button: {
    display: "inline-flex",
    height: 50,
    alignItems: "center",
    borderRadius: 99,
    padding: "0 24px",
    background: "#657447",
    color: "#fffaf0",
    fontWeight: 900,
  },

  contactLine: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "0 0 18px",
    color: "#fffaf0",
    fontSize: 16,
    lineHeight: 1.7,
    textDecoration: "none",
  },

  icon: {
    width: 36,
    height: 36,
    minWidth: 36,
    background: "#6f6244",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
};