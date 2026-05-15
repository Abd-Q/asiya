// src/config.ts
// URL бэкенда. Можно переопределить через VITE_API_URL в .env
export const API_URL =
    (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

export function apiUrl(path: string) {
    return API_URL + (path.startsWith("/") ? path : "/" + path);
}

// Преобразует относительный путь картинки в абсолютный URL
// "/uploads/foo.png"  -> "http://localhost:4000/uploads/foo.png"
// "/assets/bar.png"   -> "http://localhost:4000/assets/bar.png"
// "https://..."       -> возвращается без изменений
export function imageUrl(path: string | undefined | null): string {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return API_URL + (path.startsWith("/") ? path : "/" + path);
}
