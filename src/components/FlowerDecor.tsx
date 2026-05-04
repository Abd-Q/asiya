// МЕНЯЙ ТУТ — ВСЕ ЛИСТОЧКИ И ЦВЕТОЧКИ
// Хочешь убрать декор: поставь SHOW_DECOR = false
// Хочешь заменить цветок/лист: меняй путь в FLOWER_IMAGE / LEAF_IMAGE / MIX_IMAGE
// Хочешь двигать элементы: меняй top/left/right/bottom/width/opacity/rotate прямо в массивах ниже

const SHOW_DECOR = true;

const FLOWER_IMAGE = "public/assets/product-2.png";
const LEAF_IMAGE = "public/assets/product-1.png";
const MIX_IMAGE = "public/assets/product-3.png";
const LAVENDER_IMAGE = "public/assets/product-4.png";

const HERO_FLOWERS = [
  { image: LEAF_IMAGE, top: 30, left: -80, width: 260, opacity: 0.18, rotate: -18 },
  { image: FLOWER_IMAGE, top: 80, right: -70, width: 230, opacity: 0.24, rotate: 18 },
  { image: LAVENDER_IMAGE, bottom: 20, left: 420, width: 150, opacity: 0.32, rotate: -6 },
];

const LIGHT_SECTION_FLOWERS = [
  { image: FLOWER_IMAGE, top: -50, left: -50, width: 190, opacity: 0.24, rotate: -12 },
  { image: LEAF_IMAGE, bottom: -80, right: -60, width: 280, opacity: 0.2, rotate: 20 },
  { image: LAVENDER_IMAGE, top: 90, right: 90, width: 120, opacity: 0.24, rotate: 8 },
];

const DARK_SECTION_FLOWERS = [
  { image: MIX_IMAGE, top: -120, left: -120, width: 390, opacity: 0.08, rotate: -10 },
  { image: FLOWER_IMAGE, bottom: -70, right: -50, width: 230, opacity: 0.12, rotate: 14 },
  { image: LEAF_IMAGE, top: 70, right: 120, width: 200, opacity: 0.08, rotate: -16 },
];

const CATALOG_FLOWERS = [
  { image: LEAF_IMAGE, top: 25, right: -55, width: 250, opacity: 0.18, rotate: 15 },
  { image: FLOWER_IMAGE, top: 155, left: -70, width: 190, opacity: 0.2, rotate: -16 },
  { image: LAVENDER_IMAGE, bottom: 120, right: 30, width: 130, opacity: 0.2, rotate: 8 },
];

const FOOTER_FLOWERS = [
  { image: MIX_IMAGE, top: -130, right: -80, width: 420, opacity: 0.1, rotate: 12 },
  { image: LEAF_IMAGE, bottom: -90, left: -70, width: 320, opacity: 0.12, rotate: -12 },
];

type Variant = "hero" | "light" | "dark" | "catalog" | "footer";

export default function FlowerDecor({ variant = "light" }: { variant?: Variant }) {
  if (!SHOW_DECOR) return null;

  const items =
    variant === "hero" ? HERO_FLOWERS :
    variant === "dark" ? DARK_SECTION_FLOWERS :
    variant === "catalog" ? CATALOG_FLOWERS :
    variant === "footer" ? FOOTER_FLOWERS :
    LIGHT_SECTION_FLOWERS;

  return (
    <div style={styles.wrap} aria-hidden="true">
      {items.map((item, index) => (
        <img
          key={index}
          src={item.image}
          alt=""
          style={{
            ...styles.image,
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            width: item.width,
            opacity: item.opacity,
            transform: `rotate(${item.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 },
  image: { position: "absolute", height: "auto", objectFit: "contain", filter: "drop-shadow(0 18px 22px rgba(45,51,38,.08))" },
};
