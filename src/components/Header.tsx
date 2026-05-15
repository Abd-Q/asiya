import { useState } from "react";
import { useI18n, Locale } from "../i18n";
import { useRouter, Page } from "../context/RouterContext";

// МЕНЯЙ ТУТ
const LOGO_IMAGE = "/assets/source/Рисунок1.png";
const HEADER_HEIGHT = 82;
const LOGO_WIDTH = 128;
const TOPBAR_TEXT = "ASIYA- это не просто уход, а целый ритуал, соединяющий красоту и наследие Центрально-Азиатского региона";
const HEADER_BG = "rgba(246,239,222,.92)";
const BUTTON_BG = "#3D4727";
const BUTTON_TEXT = "#fffaf0";

const LOCALES: Locale[] = ["ru", "kk", "en"];

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const { page, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { key: Page; label: string }[] = [
    { key: "about", label: t.nav.about },
    { key: "why", label: t.nav.why_us },
    { key: "catalog", label: t.nav.catalog },
    { key: "news", label: t.nav.news },
    { key: "contacts", label: t.nav.contacts },
  ];

  function go(nextPage: Page) {
    navigate(nextPage);
    setMenuOpen(false);
  }

  return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"/>
        <div style={styles.topbar}>{TOPBAR_TEXT}</div>

        <header style={{...styles.header, height: HEADER_HEIGHT, background: HEADER_BG}}>
          <div style={styles.inner}>
            <button style={styles.logoButton} onClick={() => go("home")}>
              <img src={LOGO_IMAGE} alt="ASIYÄ" style={{width: LOGO_WIDTH, height: "auto"}}/>
            </button>

            <nav style={styles.nav}>
              {navLinks.map((link) => (
                  <button
                      key={link.key}
                      style={{...styles.navButton, color: page === link.key ? "#3D4727" : "#3D4727"}}
                      onClick={() => go(link.key)}
                  >
                    {link.label}
                  </button>
              ))}
            </nav>

            <div style={styles.rightSide}>
              <div style={styles.langs}>
                {LOCALES.map((l) => (
                    <button
                        key={l}
                        style={{
                          ...styles.langButton,
                          background: locale === l ? "#3D4727" : "transparent",
                          color: locale === l ? "#fff" : "#3D4727"
                        }}
                        onClick={() => setLocale(l)}
                    >
                      {l.toUpperCase()}
                    </button>
                ))}
              </div>

              <button style={{...styles.callButton, background: BUTTON_BG, color: BUTTON_TEXT}}
                      onClick={() => go("contacts")}>
                {t.nav.call}
              </button>

              <button style={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            </div>
          </div>
        </header>

        {menuOpen && (
            <div style={styles.mobileMenu}>
              {navLinks.map((link) => (
                  <button key={link.key} style={styles.mobileLink} onClick={() => go(link.key)}>{link.label}</button>
              ))}
            </div>
        )}
      </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#BEAE3C",
    color: "#fffaf0",
    fontSize: 18,
    letterSpacing: .2,
    fontFamily: "Montserrat, sans-serif",

  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(101,116,71,.15)",
  },
  inner: {
    maxWidth: 1320,
    height: "100%",
    margin: "0 auto",
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logoButton: {border: 0, background: "transparent", padding: 0, cursor: "pointer"},
  nav: {display: "flex", alignItems: "center", gap: 22},
  navButton: {
    border: 0,
    background: "transparent",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: .9,
    whiteSpace: "nowrap"
  },
  rightSide: {display: "flex", alignItems: "center", gap: 14},
  langs: {display: "flex", alignItems: "center", gap: 5},
  langButton: {
    width: 34,
    height: 30,
    border: "1px solid rgba(101,116,71,.35)",
    borderRadius: 99,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800
  },
  callButton: {
    height: 42,
    border: 0,
    borderRadius: 99,
    padding: "0 20px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  burger: {display: "none", border: 0, background: "transparent", fontSize: 28, cursor: "pointer"},
  mobileMenu: {
    display: "grid",
    gap: 8,
    padding: 20,
    background: "#f6efde",
    borderBottom: "1px solid rgba(101,116,71,.15)"
  },
  mobileLink: {textAlign: "left", border: 0, background: "#fffaf0", borderRadius: 14, padding: 14, fontWeight: 800},
};
