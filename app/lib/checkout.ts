import { apiUrl } from "./env";
import { ApiError } from "./api";

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type CreateOrderPayload = {
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  items: { product_id: number; quantity: number }[];
};

export type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
};

export type Order = {
  id: number;
  status: string;
  customer_name: string;
  customer_email: string;
  total: string;
  item_count: number;
  payment_provider: string | null;
  paid_at: string | null;
  is_paid: boolean;
  tracking_number: string | null;
  tracking_emailed_at: string | null;
  created_at: string;
  updated_at?: string;
  shipping_address?: ShippingAddress;
  items?: OrderItem[];
  stripe_checkout_pending?: boolean;
  paypal_checkout_pending?: boolean;
};

export type PaymentConfig = {
  stripe_enabled: boolean;
  paypal_enabled: boolean;
  stripe_publishable_key: string | null;
  paypal_client_id: string | null;
  paypal_mode: string;
};

export type StripePayResponse = {
  provider: "stripe";
  checkout_url: string;
  session_id: string;
  order_id: number;
};

export type PayPalPayResponse = {
  provider: "paypal";
  approval_url: string;
  paypal_order_id: string;
  order_id: number;
};

type ErrorBody = { error?: string };

async function parseJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({})) as Promise<T>;
}

const DEFAULT_TIMEOUT_MS = 45_000;

async function publicFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = apiUrl(path);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "The server took too long to respond. Please try again.",
        0,
      );
    }
    throw new ApiError(
      `Cannot reach the API at ${url}. Is Django running on port 8000?`,
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const text = await response.text();
  let data: T & ErrorBody = {} as T & ErrorBody;
  if (text) {
    try {
      data = JSON.parse(text) as T & ErrorBody;
    } catch {
      throw new ApiError(
        response.ok
          ? "Invalid response from server"
          : `Server error (${response.status}). Check the API is running.`,
        response.status,
      );
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : response.statusText;
    throw new ApiError(message || "Request failed", response.status);
  }

  return data as T;
}

export function getPaymentConfig() {
  return publicFetch<PaymentConfig>("/config/payments/");
}

export function createOrder(payload: CreateOrderPayload) {
  return publicFetch<{ order: Order }>("/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrder(orderId: number) {
  return publicFetch<{ order: Order }>(`/orders/${orderId}/`);
}

export function payWithStripe(orderId: number) {
  return publicFetch<StripePayResponse>(
    `/orders/${orderId}/pay/stripe/`,
    { method: "POST" },
    60_000,
  );
}

export function payWithPayPal(orderId: number) {
  return publicFetch<PayPalPayResponse>(
    `/orders/${orderId}/pay/paypal/`,
    { method: "POST" },
    60_000,
  );
}

export function releaseStripeCheckout(orderId: number) {
  return publicFetch<{ released: boolean; order: Order }>(
    `/orders/${orderId}/pay/stripe/release/`,
    { method: "POST" },
  );
}

export function releasePayPalCheckout(orderId: number) {
  return publicFetch<{ released: boolean; order: Order }>(
    `/orders/${orderId}/pay/paypal/release/`,
    { method: "POST" },
  );
}

export function releasePendingPayments(orderId: number) {
  return Promise.allSettled([
    releaseStripeCheckout(orderId),
    releasePayPalCheckout(orderId),
  ]);
}

export function capturePayPal(orderId: number) {
  return publicFetch<{ order: Order }>(`/orders/${orderId}/paypal/capture/`, {
    method: "POST",
  });
}

export const CHECKOUT_ORDER_STORAGE_KEY = "eliteforge-checkout-order-id";
export const CHECKOUT_PAYMENT_LOCK_KEY = "eliteforge-checkout-payment-lock";

export function setCheckoutPaymentLock(orderId: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_ORDER_STORAGE_KEY, String(orderId));
  localStorage.setItem(CHECKOUT_PAYMENT_LOCK_KEY, String(orderId));
}

export function clearCheckoutPaymentLock() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_PAYMENT_LOCK_KEY);
}

export function readCheckoutPaymentLock(): number | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(CHECKOUT_PAYMENT_LOCK_KEY) ??
    sessionStorage.getItem(CHECKOUT_ORDER_STORAGE_KEY);
  if (!raw) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) ? id : null;
}
