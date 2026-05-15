import { useState } from "react";
import { useI18n } from "../i18n";
import { useRouter } from "../context/RouterContext";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, CategorySlug } from "../data/products";

// МЕНЯЙ ТУТ — КАТАЛОГ
const CATALOG_COLUMNS = 6;
const CATALOG_GAP = 16;
const PAGE_BG = "#f6efde";
const CARD_GRID_MAX_WIDTH = 1320;
const SECTION_PADDING = "0px 28px";

export default function CatalogPage() {
  const { t } = useI18n();
  const { categoryFilter } = useRouter();
  const [category, setCategory] = useState<CategorySlug | "all">(categoryFilter);

  const categories: { slug: CategorySlug | "all"; label: string }[] = [
    { slug: "all", label: t.categories.all },
    { slug: "hair", label: t.categories.hair },
    { slug: "body", label: t.categories.body },
    { slug: "soap", label: t.categories.soap },
    { slug: "sets", label: t.categories.sets },
  ];

  const filteredProducts = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === category);

  return (
    <section style={{ ...styles.page, background: PAGE_BG }}>
      <div style={styles.hero}>
        <p style={styles.tag}>{t.catalog.collection}</p>
        <h1 style={styles.title}>{t.catalog.title}</h1>
        <p style={styles.subtitle}>{t.catalog.subtitle}</p>
      </div>

      <div style={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            style={{
              ...styles.filterButton,
              background: category === cat.slug ? "#657447" : "#fffaf0",
              color: category === cat.slug ? "#fffaf0" : "#25301f",
            }}
            onClick={() => setCategory(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ ...styles.grid, maxWidth: CARD_GRID_MAX_WIDTH, gap: CATALOG_GAP, gridTemplateColumns: `repeat(${CATALOG_COLUMNS}, minmax(0, 1fr))` }}>
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      <div style={styles.benefits}>
        {[
          t.why.reasons[1]?.title || "Натуральные ингредиенты",
          t.why.certs[2]?.title || "Безопасные формулы",
          t.why.certs[0]?.title || "Halal сертификация",
          t.why.prod_features[0]?.title || "Собственное производство",
        ].map((item, index) => <div key={item} style={styles.benefit}><span style={styles.benefitIcon}>{["🌿", "✓", "☪", "🏭"][index]}</span><b>{item}</b></div>)}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { position: "relative", overflow: "hidden", padding: SECTION_PADDING, minHeight: "100vh" },
  hero: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "54px 0 46px" },
  tag: { margin: "0 0 12px", color: "#657447", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  title: { maxWidth: 720, margin: 0, color: "#25301f", fontSize: 58, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1.8,   whiteSpace: "nowrap" },
  subtitle: { maxWidth: 640, margin: "20px 0 0", color: "#6f6244", fontSize: 17, lineHeight: 1.7 },
  filters: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto 32px", display: "flex", gap: 10, flexWrap: "wrap" },
  filterButton: { height: 42, border: "1px solid rgba(101,116,71,.2)", borderRadius: 99, padding: "0 18px", fontWeight: 900, cursor: "pointer" },
  grid: { position: "relative", zIndex: 2, margin: "0 auto", display: "grid" },
  benefits: { position: "relative", zIndex: 2, maxWidth: 1320, margin: "38px auto 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  benefit: { background: "#fffaf0", borderRadius: 24, padding: 20, display: "flex", alignItems: "center", gap: 14, color: "#25301f", boxShadow: "0 18px 44px rgba(45,51,38,.07)" },
  benefitIcon: { width: 42, height: 42, borderRadius: 99, background: "#e8dcc2", display: "flex", alignItems: "center", justifyContent: "center" },
};
