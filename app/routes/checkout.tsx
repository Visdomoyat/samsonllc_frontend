import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import CheckoutPayment from "~/components/CheckoutPayment";
import Spinner from "~/components/Spinner";
import { useCart } from "~/context/CartContext";
import { ApiError } from "~/lib/api";
import {
  CHECKOUT_ORDER_STORAGE_KEY,
  createOrder,
  readCheckoutPaymentLock,
  type CreateOrderPayload,
} from "~/lib/checkout";
import { cartItemKey, cartLineTotal } from "~/lib/cartItem";

function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function readStoredOrderId(): number | null {
  return readCheckoutPaymentLock();
}

export function meta() {
  return [{ title: "Checkout — Eliteforge Peptide" }];
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, hydrated } = useCart();
  const [orderId, setOrderId] = useState<number | null>(readStoredOrderId);
  const [submitting, setSubmitting] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const orderSubmitInFlight = useRef(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");

  useEffect(() => {
    if (hydrated && !orderId && items.length === 0) {
      navigate("/shop", { replace: true });
    }
  }, [hydrated, orderId, items.length, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (orderSubmitInFlight.current || submitting) {
      return;
    }

    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    const payload: CreateOrderPayload = {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      shipping_address: {
        line1: line1.trim(),
        line2: line2.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: country.trim() || "US",
      },
      items: items.map((item) =>
        item.itemType === "stack_blend"
          ? { stack_blend_id: item.id, quantity: item.quantity }
          : {
              product_variant_id: item.variantId!,
              quantity: item.quantity,
            },
      ),
    };

    orderSubmitInFlight.current = true;
    setSubmitting(true);
    try {
      const { order } = await createOrder(payload);
      sessionStorage.setItem(
        CHECKOUT_ORDER_STORAGE_KEY,
        String(order.id),
      );
      setOrderId(order.id);
      clearCart();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Could not create order",
      );
    } finally {
      orderSubmitInFlight.current = false;
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center text-brand/70">
        <Spinner />
        <p className="mt-4">Loading checkout…</p>
      </main>
    );
  }

  if (!orderId && items.length === 0) {
    return null;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-brand">Checkout</h1>

      {orderId ? (
        <div className="mt-8">
          <CheckoutPayment
            orderId={orderId}
            onBusyChange={setPaymentBusy}
          />
          {!paymentBusy && (
            <p className="mt-6 text-center text-sm text-brand/60">
              <Link
                to="/shop"
                className="font-medium text-brand hover:underline"
              >
                Continue shopping
              </Link>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand">Your cart</h2>
            <ul className="mt-4 divide-y divide-brand/10">
              {items.map((item) => (
                <li
                  key={cartItemKey(item)}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <div className="min-w-0 text-left">
                    <p className="font-medium text-brand">
                      {item.name}
                      <span className="font-normal text-brand/60">
                        {" "}
                        × {item.quantity}
                      </span>
                    </p>
                    {item.sizeLabel && (
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                        {item.sizeLabel}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-brand/70">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-medium text-brand">
                    ${cartLineTotal(item).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-brand/10 pt-4 font-semibold text-brand">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
          </section>

          <section className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand">
              Shipping information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium text-brand sm:col-span-2">
                Full name
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand sm:col-span-2">
                Email
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="email"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand sm:col-span-2">
                Address line 1
                <input
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="address-line1"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand sm:col-span-2">
                Address line 2 (optional)
                <input
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="address-line2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand">
                City
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="address-level2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand">
                State
                <input
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="address-level1"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand">
                Postal code
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="postal-code"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-brand">
                Country
                <input
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="rounded-lg border border-brand/15 px-3 py-2 font-normal outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                  autoComplete="country"
                />
              </label>
            </div>
          </section>

          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-muted disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {submitting ? <Spinner className="text-white" /> : null}
            Continue to payment
          </button>
        </form>
      )}
    </main>
  );
}
