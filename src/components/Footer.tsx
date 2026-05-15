import { useState } from "react";
import { useI18n } from "../i18n";
import { useRouter, Page } from "../context/RouterContext";
import FlowerDecor from "./FlowerDecor";

// МЕНЯЙ ТУТ
const FOOTER_LOGO = "/assets/source/logo-main.png";
const FOOTER_BG = "#733d11";
const FOOTER_TEXT = "#fff7e8";
const FOOTER_PADDING = "80px 28px 28px";

const EMAIL_LINK = "mailto:info@telli.kz";
const INSTAGRAM_LINK = "https://instagram.com/asiya_kazakhstan";

export default function Footer() {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");

  const navLinks: { key: Page; label: string }[] = [
    { key: "about", label: t.nav.about },
    { key: "why", label: t.nav.why_us },
    { key: "catalog", label: t.nav.catalog },
    { key: "news", label: t.nav.news },
    { key: "contacts", label: t.nav.contacts },
  ];

  return (
      <footer style={{ ...styles.footer, background: FOOTER_BG, color: FOOTER_TEXT, padding: FOOTER_PADDING }}>
        <FlowerDecor variant="footer" />

        <div style={styles.inner}>

          {/* 🔥 СОТРУДНИЧЕСТВО */}
          <div style={styles.coop}>
            <p style={styles.tag}>● СВЯЖИТЕСЬ С НАМИ</p>

            <h2 style={styles.coopTitle}>Сотрудничество</h2>

            <div style={styles.coopItem}>
              <div style={styles.icon}>💬</div>
              <div>
                <p style={styles.coopMain}>Вопросы и предложения</p>
                <p style={styles.coopSub}>Замечания или идеи по улучшению продукции</p>
              </div>
            </div>

            <div style={styles.coopItem}>
              <div style={styles.icon}>🤝</div>
              <div>
                <p style={styles.coopMain}>Сотрудничество и карьера</p>
                <p style={styles.coopSub}>Партнерство или присоединение к команде</p>
              </div>
            </div>

            <a href={EMAIL_LINK} style={styles.coopButton}>
              НАПИСАТЬ НАМ →
            </a>
          </div>

          {/* 📩 ПОДПИСКА */}
          <div style={styles.subscribe}>
            <p style={styles.tag}>● БУДЬТЕ В КУРСЕ</p>

            <h2 style={styles.coopTitle}>Подпишись на рассылку</h2>

            <p style={styles.subText}>
              Получайте новости, анонсы и специальные предложения первыми!
            </p>

            <div style={styles.form}>
              <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.your_email}
              />
              <button style={styles.sendButton}>Подписаться</button>
            </div>
          </div>

          {/* 📌 НАВИГАЦИЯ + КОНТАКТЫ */}
          <div style={styles.rightBlock}>
            <div>
              <h3 style={styles.columnTitle}>{t.footer.navigation}</h3>
              {navLinks.map((link) => (
                  <button key={link.key} style={styles.footerLink} onClick={() => navigate(link.key)}>
                    {link.label}
                  </button>
              ))}
            </div>

            <div>
              <h3 style={styles.columnTitle}>{t.footer.contacts}</h3>
              <p style={styles.contactLine}>Алматы, Казахстан</p>
              <p style={styles.contactLine}>Telli Ondiris</p>
              <a href={EMAIL_LINK} style={styles.contactLine}>info@telli.kz</a>
              <a href={INSTAGRAM_LINK} style={styles.contactLine}>@asiya_kazakhstan</a>
            </div>
          </div>

        </div>

        <div style={styles.bottom}>
          <p>© {new Date().getFullYear()} ASIYÄ. {t.footer.rights}</p>
          <p>{t.footer.tagline}</p>
        </div>
      </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: { position: "relative", overflow: "hidden" },

  inner: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.2fr 1.2fr 1fr",
    gap: 60,
  },

  tag: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#F1D1B1",
    marginBottom: 10,
  },

  coop: {},

  coopTitle: {
    fontSize: 28,
    marginBottom: 30,
    color: "#fff",
  },

  coopItem: {
    display: "flex",
    gap: 14,
    marginBottom: 20,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#5c3b1f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  coopMain: {
    margin: 0,
    color: "#fff",
  },

  coopSub: {
    margin: 0,
    fontSize: 13,
    opacity: 0.7,
  },

  coopButton: {
    display: "inline-block",
    marginTop: 20,
    padding: "12px 24px",
    borderRadius: 999,
    background: "#F1D1B1",
    color: "#27311f",
    fontWeight: 700,
  },

  subscribe: {},

  subText: {
    opacity: 0.7,
    marginBottom: 20,
  },

  form: {
    display: "flex",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: 999,
    border: "none",
  },

  sendButton: {
    padding: "14px 24px",
    borderRadius: 999,
    border: "none",
    background: "#F1D1B1",
    color: "#27311f",
    fontWeight: 700,
    cursor: "pointer",
  },

  rightBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },

  columnTitle: {
    marginBottom: 12,
    color: "#F1D1B1",
    fontSize: 14,
  },

  footerLink: {
    display: "block",
    background: "none",
    border: 0,
    color: "#fff",
    opacity: 0.8,
    cursor: "pointer",
    marginBottom: 6,
  },

  contactLine: {
    display: "block",
    marginBottom: 6,
    opacity: 0.8,
  },

  bottom: {
    marginTop: 60,
    paddingTop: 20,
    borderTop: "1px solid rgba(255,255,255,.1)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    opacity: 0.7,
  },
};