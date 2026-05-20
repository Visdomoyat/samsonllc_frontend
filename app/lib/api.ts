import { getApiBaseUrl } from "./env";

export type ApiUser = {
  id: number;
  username: string;
};

export type ApiSession =
  | { authenticated: false }
  | { authenticated: true; user: ApiUser };

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

type ApiRequestInit = RequestInit & {
  request?: Request;
};

async function apiFetch<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { request: incomingRequest, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  if (rest.method && rest.method !== "GET" && !headers.has("X-CSRFToken")) {
    const csrf = getCookie("csrftoken");
    if (csrf) headers.set("X-CSRFToken", csrf);
  }

  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cookie = incomingRequest?.headers.get("Cookie");
  if (cookie) headers.set("Cookie", cookie);

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : response.statusText;
    throw new ApiError(message || "Request failed", response.status);
  }

  return data as T;
}

export function getHealth(request?: Request) {
  return apiFetch<{ status: string; service: string }>("/api/health/", {
    request,
  });
}

export function getSession(request?: Request) {
  return apiFetch<ApiSession>("/api/auth/session/", { request });
}

export function login(username: string, password: string) {
  return apiFetch<ApiSession>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return apiFetch<{ authenticated: false }>("/api/auth/logout/", {
    method: "POST",
  });
}

export function getProducts(request?: Request) {
  return apiFetch<{ products: Product[] }>("/api/products/", { request });
}
