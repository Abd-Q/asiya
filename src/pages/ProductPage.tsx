import { useI18n } from "../i18n";
import FlowerDecor from "../components/FlowerDecor";
import { useRouter } from "../context/RouterContext";
import { PRODUCTS, Product } from "../data/products";
import ProductCard from "../components/ProductCard";

// МЕНЯЙ ТУТ — PRODUCT PAGE
const PAGE_BG = "#f6efde";
const SECTION_PADDING = "70px 28px";
const PRODUCT_IMAGE_HEIGHT = 500;
const RELATED_COLUMNS = 4;
const RELATED_GAP = 18;

export default function ProductPage() {
  const { t, locale } = useI18n();
  const { productId, navigate } = useRouter();

  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const productName = (product[`name_${locale}` as keyof Product] as string) || product.name_ru;
  const productDesc = (product[`desc_${locale}` as keyof Product] as string) || product.desc_ru;
  const relatedProducts = PRODUCTS.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4);

  return (
    <section style={{ ...styles.page, background: PAGE_BG, padding: SECTION_PADDING }}>
      <FlowerDecor variant="light" />
      <div style={styles.productGrid}>
        <div style={styles.mediaBox}>
          <img src={product.image} alt={productName} style={{ height: PRODUCT_IMAGE_HEIGHT, objectFit: "contain", background: "transparent", filter: "drop-shadow(0 24px 32px rgba(45,51,38,.16))" }} />
        </div>

        <div style={styles.infoBox}>
          <button style={styles.backButton} onClick={() => navigate("catalog")}>← {t.product.back}</button>
          <p style={styles.tag}>{t.product.category}</p>
          <h1 style={styles.title}>{productName}</h1>
          <p style={styles.text}>{productDesc}</p>

          <div style={styles.metaLine}><span>{t.product.volume}</span><b>{product.vol}</b></div>
          <div style={styles.metaLine}><span>{t.product.production}</span><b>{t.product.production_val}</b></div>
          <div style={styles.metaLine}><span>{t.product.certs}</span><b>Halal · ISO 22716</b></div>

          <div style={styles.buttons}>
            <a href={product.kaspi} target="_blank" rel="noreferrer" style={{ ...styles.button, background: "#e83b45" }}>{t.product.buy_kaspi}</a>
            <a href={product.wb} target="_blank" rel="noreferrer" style={{ ...styles.button, background: "#7b2ff2" }}>WB</a>
            <a href={product.ozon} target="_blank" rel="noreferrer" style={{ ...styles.button, background: "#1268ff" }}>Ozon</a>
          </div>
        </div>
      </div>


      <div style={{ ...styles.relatedGrid, gridTemplateColumns: `repeat(${RELATED_COLUMNS}, 1fr)`, gap: RELATED_GAP }}>
        {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { position: "relative", overflow: "hidden", minHeight: "100vh" },
  productGrid: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: ".95fr 1.05fr", gap: 50, alignItems: "center" },
  mediaBox: { minHeight: 600, background: "#fffaf0", borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 70px rgba(45,51,38,.12)" },
  infoBox: { background: "rgba(255,250,240,.55)", borderRadius: 32, padding: 38 },
  backButton: { border: 0, background: "transparent", color: "#657447", fontWeight: 900, cursor: "pointer", padding: 0, marginBottom: 18 },
  tag: { margin: "0 0 12px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  title: { margin: 0, color: "#25301f", fontSize: 54, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1.4 },
  text: { margin: "22px 0", color: "#6f6244", fontSize: 16, lineHeight: 1.85 },
  metaLine: { display: "flex", justifyContent: "space-between", gap: 18, padding: "16px 0", borderBottom: "1px solid rgba(101,116,71,.16)", color: "#25301f" },
  buttons: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 },
  button: { display: "inline-flex", height: 46, alignItems: "center", justifyContent: "center", borderRadius: 99, padding: "0 18px", color: "#fff", fontWeight: 900 },
  relatedHeader: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "64px auto 24px" },
  relatedTitle: { margin: 0, color: "#25301f", fontSize: 38 },
  relatedGrid: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "grid" },
};
