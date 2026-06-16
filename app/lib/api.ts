import { apiUrl } from "./env";

export type ProductVariant = {
  id: number;
  size_value: string;
  size_unit: "mg" | "ml";
  size_label: string;
  price: string;
  is_active: boolean;
  display_order: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  variants: ProductVariant[];
  price_from: string | null;
  created_at: string;
  updated_at: string;
};

export function formatProductPrice(price: string): string {
  const amount = Number.parseFloat(price);
  if (!Number.isFinite(amount)) return price;
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizeVariant(raw: ProductVariant): ProductVariant {
  return {
    ...raw,
    is_active: Boolean(raw.is_active),
  };
}

export function normalizeProduct(raw: Product & { price?: string }): Product {
  const variants = Array.isArray(raw.variants)
    ? raw.variants.map(normalizeVariant).filter((variant) => variant.is_active)
    : [];

  let priceFrom = raw.price_from ?? null;
  if (!priceFrom && variants.length > 0) {
    const prices = variants
      .map((variant) => Number.parseFloat(variant.price))
      .filter((value) => Number.isFinite(value));
    if (prices.length > 0) {
      priceFrom = Math.min(...prices).toFixed(2);
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    image_url: raw.image_url,
    variants,
    price_from: priceFrom,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

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

export async function getProducts(request?: Request) {
  const data = await apiFetch<{ products: (Product & { price?: string })[] }>(
    "/products/",
    { request },
  );
  return {
    products: data.products.map(normalizeProduct),
  };
}

export type BundleTier = {
  quantity: number;
  discount_percent: number | null;
  line_total: string;
  label: string;
};

export type StackBlend = {
  id: number;
  name: string;
  kind: "stack" | "blend";
  kind_label: string;
  description: string;
  price: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  bundle_tiers?: BundleTier[];
};

export function getStackBlends(request?: Request, landing = false) {
  const query = landing ? "?landing=1" : "";
  return apiFetch<{ stack_blends: StackBlend[] }>(
    `/stack-blends${query}`,
    { request },
  );
}

export function getStackBlend(id: number, request?: Request) {
  return apiFetch<{ stack_blend: StackBlend }>(`/stack-blends/${id}/`, {
    request,
  });
}
