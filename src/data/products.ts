// src/data/products.ts
// Раньше это был статичный массив. Теперь — API-клиент и типы.
// Все данные подгружаются из бэкенда (см. src/context/ProductsContext.tsx).
import { apiUrl } from "../config";

export type CategorySlug = string;  // теперь строка — категории динамические

export interface ProductTranslation {
  name: string;
  short_desc: string;
  full_desc: string;
}

export interface ProductImage {
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  slug: string;
  cat: CategorySlug;
  category_id: number;
  vol: string;
  tag: "new" | "hit" | "";
  image: string;
  images: ProductImage[];
  kaspi: string;
  wb: string;
  ozon: string;
  translations: Record<string, ProductTranslation>;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  slug: CategorySlug;
  sort_order: number;
  translations: Record<string, string>;
}

export async function fetchProducts(params: { category?: string } = {}): Promise<Product[]> {
  const url = new URL(apiUrl("/api/products"));
  if (params.category && params.category !== "all") {
    url.searchParams.set("category", params.category);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Не удалось загрузить продукты");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(apiUrl("/api/products/" + id));
  if (!res.ok) throw new Error("Не удалось загрузить продукт");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(apiUrl("/api/categories"));
  if (!res.ok) throw new Error("Не удалось загрузить категории");
  return res.json();
}
