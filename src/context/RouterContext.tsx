import { createContext, useContext, useState, ReactNode } from "react";
import { CategorySlug } from "../data/products";

export type Page =
  | "home"
  | "about"
  | "why"
  | "catalog"
  | "product"
  | "news"
  | "newsDetail"
  | "contacts";

interface RouterCtx {
  page: Page;
  productId: number;
  newsId: number;
  categoryFilter: CategorySlug | "all";
  navigate: (page: Page, opts?: { productId?: number; newsId?: number; category?: CategorySlug | "all" }) => void;
}

const RouterContext = createContext<RouterCtx>({
  page: "home",
  productId: 0,
  newsId: 0,
  categoryFilter: "all",
  navigate: () => {},
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [productId, setProductId] = useState<number>(0);
  const [newsId, setNewsId] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<CategorySlug | "all">("all");

  const navigate: RouterCtx["navigate"] = (nextPage, opts) => {
    if (opts?.productId !== undefined) setProductId(opts.productId);
    if (opts?.newsId !== undefined) setNewsId(opts.newsId);
    if (opts?.category !== undefined) setCategoryFilter(opts.category);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <RouterContext.Provider value={{ page, productId, newsId, categoryFilter, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
