// src/context/ProductsContext.tsx
// Глобальный store: подтягивает продукты и категории один раз и держит их в памяти.
// Никакого localStorage — всё в памяти процесса страницы.
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Product,
  Category,
  fetchProducts,
  fetchCategories,
} from "../data/products";
import { imageUrl } from "../config";

interface ProductsCtx {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const Ctx = createContext<ProductsCtx>({
  products: [],
  categories: [],
  loading: true,
  error: null,
  reload: async () => {},
});

// Нормализуем URL картинок: бэкенд возвращает относительные пути,
// мы их превращаем в абсолютные (через config.imageUrl).
function normalizeProduct(p: Product): Product {
  return {
    ...p,
    image: imageUrl(p.image),
    images: (p.images || []).map((i) => ({ ...i, url: imageUrl(i.url) })),
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods.map(normalizeProduct));
      setCategories(cats);
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Ctx.Provider value={{ products, categories, loading, error, reload: load }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProducts() {
  return useContext(Ctx);
}
