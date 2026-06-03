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

async function publicFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = apiUrl(path);
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      `Cannot reach the API at ${url}. Is Django running on port 8000?`,
      0,
    );
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
  return publicFetch<StripePayResponse>(`/orders/${orderId}/pay/stripe/`, {
    method: "POST",
  });
}

export function payWithPayPal(orderId: number) {
  return publicFetch<PayPalPayResponse>(`/orders/${orderId}/pay/paypal/`, {
    method: "POST",
  });
}

export function capturePayPal(orderId: number) {
  return publicFetch<{ order: Order }>(`/orders/${orderId}/paypal/capture/`, {
    method: "POST",
  });
}

export const CHECKOUT_ORDER_STORAGE_KEY = "eliteforge-checkout-order-id";
