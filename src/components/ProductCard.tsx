import { useI18n } from "../i18n";
import { Product } from "../data/products";
import { useRouter } from "../context/RouterContext";

// МЕНЯЙ ТУТ — КАРТОЧКИ ТОВАРА
const CARD_WIDTH = "100%";
const CARD_MIN_HEIGHT = 318;
const CARD_PADDING = 14;
const IMAGE_HEIGHT = 176;
const CARD_RADIUS = 24;
const CARD_BG = "#fffaf0";
const CARD_BORDER = "1px solid rgba(101,116,71,.14)";
const BUTTON_HEIGHT = 30;
const CARD_FLOWER_IMAGE = "/assets/branch-leaves.png";
const CARD_FLOWER_WIDTH = 58;

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n();
  const { navigate } = useRouter();

  const productName = (product[`name_${locale}` as keyof Product] as string) || product.name_ru;
  const tagText = product.tag === "new" ? t.catalog.tag_new : product.tag === "hit" ? t.catalog.tag_hit : "";

  function stopClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <article style={{ ...styles.card, width: CARD_WIDTH, minHeight: CARD_MIN_HEIGHT, padding: CARD_PADDING, borderRadius: CARD_RADIUS, background: CARD_BG, border: CARD_BORDER }} onClick={() => navigate("product", { productId: product.id })}>
      {tagText && <span style={styles.tag}>{tagText}</span>}



      <div style={styles.imageBox}>
        <img src={product.image} alt={productName} style={{ ...styles.image, height: IMAGE_HEIGHT }} />
      </div>

      <h3 style={styles.name}>{productName}</h3>
      <p style={styles.volume}>{product.vol}</p>

      <div style={styles.buttons} onClick={stopClick}>
        <a href={product.kaspi} target="_blank" rel="noreferrer" style={{ ...styles.buyButton, height: BUTTON_HEIGHT, background: "#e83b45" }}>Kaspi</a>
        <a href={product.wb} target="_blank" rel="noreferrer" style={{ ...styles.buyButton, height: BUTTON_HEIGHT, background: "#7b2ff2" }}>WB</a>
        <a href={product.ozon} target="_blank" rel="noreferrer" style={{ ...styles.buyButton, height: BUTTON_HEIGHT, background: "#1268ff" }}>Ozon</a>
      </div>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { position: "relative", cursor: "pointer", boxShadow: "0 18px 44px rgba(45,51,38,.08)", transition: "transform .2s ease", display: "flex", flexDirection: "column" },
  cardFlower: { position: "absolute", right: 8, top: 8, opacity: .16, transform: "rotate(18deg)", pointerEvents: "none", zIndex: 1 },
  tag: { position: "absolute", top: 12, left: 12, zIndex: 3, height: 28, display: "inline-flex", alignItems: "center", padding: "0 10px", borderRadius: 99, background: "#657447", color: "#fffaf0", fontSize: 10, fontWeight: 900 },
  imageBox: { position: "relative", zIndex: 2, height: 178, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2, background: "transparent", borderRadius: 18 },
  image: { width: "100%", objectFit: "contain", background: "transparent", filter: "drop-shadow(0 20px 24px rgba(45,51,38,.18))" },
  name: { position: "relative", zIndex: 2, margin: "6px 0 0", color: "#25301f", fontSize: 13, lineHeight: 1.25, minHeight: 40, fontWeight: 900 },
  volume: { position: "relative", zIndex: 2, margin: "6px 0 10px", color: "#7e704e", fontSize: 12, fontWeight: 700 },
  buttons: { position: "relative", zIndex: 2, marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 },
  buyButton: { display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 900 },
};
