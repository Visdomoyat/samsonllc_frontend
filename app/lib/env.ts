/**
 * Base URL for the Django API.
 * - In the browser during dev, leave empty to use the Vite proxy (/api → backend).
 * - During SSR, set API_URL or VITE_API_URL to the full backend URL (e.g. http://127.0.0.1:8000).
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.SSR) {
    return (
      (typeof process !== "undefined" && process.env.API_URL) ||
      import.meta.env.VITE_API_URL ||
      "http://127.0.0.1:8000"
    );
  }
  return import.meta.env.VITE_API_URL || "";
}
