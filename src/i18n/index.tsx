// src/i18n/index.tsx
// i18n со смешанной стратегией:
//   1. Базовая структура — статичные файлы ru/kk/en (содержат массивы и объекты).
//   2. Поверх неё накладываются плоские переводы из БД (по ключам "nav.about" и т.д.).
//   3. Компоненты используют t.* как раньше — без изменений.
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ru from "./ru";
import kk from "./kk";
import en from "./en";
import { apiUrl } from "../config";

export type Locale = "ru" | "kk" | "en";

export type Translations = typeof ru;

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  loading: boolean;
}

const I18nContext = createContext<I18nCtx>({
  locale: "ru",
  setLocale: () => {},
  t: ru,
  loading: false,
});

function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(cloneDeep) as any;
  const out: any = {};
  for (const k of Object.keys(value as any)) out[k] = cloneDeep((value as any)[k]);
  return out;
}

// Применяем плоский override вида "nav.about" -> "О НАС"
// или "new_products.checklist.0" -> "Шампуни и кондиционеры".
function applyOverride(target: any, key: string, value: string) {
  const parts = key.split(".");
  let cur = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(next);
    if (cur[p] == null) cur[p] = nextIsIndex ? [] : {};
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur) && /^\d+$/.test(last)) cur[Number(last)] = value;
  else cur[last] = value;
}

async function fetchOverrides(locale: Locale): Promise<Record<string, string>> {
  try {
    const res = await fetch(apiUrl("/api/translations/" + locale));
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [merged, setMerged] = useState<Record<Locale, Translations>>({
    ru: cloneDeep(ru),
    kk: cloneDeep(kk),
    en: cloneDeep(en),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result: any = {
        ru: cloneDeep(ru),
        kk: cloneDeep(kk),
        en: cloneDeep(en),
      };
      const all = await Promise.all(
        (["ru", "kk", "en"] as Locale[]).map(
          async (l) => [l, await fetchOverrides(l)] as const
        )
      );
      for (const [l, dict] of all) {
        for (const [key, value] of Object.entries(dict)) {
          if (value !== "" && value != null) applyOverride(result[l], key, value);
        }
      }
      if (!cancelled) {
        setMerged(result);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: merged[locale], loading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
