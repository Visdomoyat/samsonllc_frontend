import { apiUrl } from "./env";

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

type ApiRequestInit = RequestInit & {
  request?: Request;
};

async function apiFetch<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { request: incomingRequest, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cookie = incomingRequest?.headers.get("Cookie");
  if (cookie) headers.set("Cookie", cookie);

  const response = await fetch(apiUrl(path), {
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

export function getProducts(request?: Request) {
  return apiFetch<{ products: Product[] }>("/products/", { request });
}
