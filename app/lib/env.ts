/**
 * API base URL including /api prefix, e.g. http://127.0.0.1:8000/api
 *
 * Browser dev: uses `/api` (Vite proxy → Django) to avoid CORS issues.
 * SSR / production server: uses API_URL or VITE_API_BASE_URL.
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.SSR) {
    const base =
      (typeof process !== "undefined" && process.env.API_URL) ||
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "http://127.0.0.1:8000/api";
    return String(base).replace(/\/$/, "");
  }

  // Local dev in the browser — proxy avoids localhost → 127.0.0.1 CORS problems
  if (import.meta.env.DEV) {
    return "/api";
  }

  const base =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "/api";
  return String(base).replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
