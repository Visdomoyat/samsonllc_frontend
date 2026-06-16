import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

import Spinner from "~/components/Spinner";
import { ApiError } from "~/lib/api";
import {
  capturePayPal,
  clearCheckoutPaymentLock,
  confirmStripeCheckout,
  getOrder,
  type Order,
} from "~/lib/checkout";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_MS = 60_000;

async function tryConfirmStripe(orderId: number, sessionId?: string | null) {
  try {
    const confirmed = await confirmStripeCheckout(
      orderId,
      sessionId?.trim() || undefined,
    );
    return confirmed.order;
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function meta() {
  return [{ title: "Order confirmed — Eliteforge Peptide" }];
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="mt-6 rounded-xl border border-brand/10 bg-white p-6 text-left shadow-sm">
      <h2 className="font-semibold text-brand">Order #{order.id}</h2>
      <p className="mt-1 text-sm text-brand/70">
        {order.customer_name} · {order.customer_email}
      </p>
      {order.shipping_address && (
        <p className="mt-3 text-sm text-brand/70">
          {order.shipping_address.line1}
          {order.shipping_address.line2
            ? `, ${order.shipping_address.line2}`
            : ""}
          <br />
          {order.shipping_address.city}, {order.shipping_address.state}{" "}
          {order.shipping_address.postal_code}
          <br />
          {order.shipping_address.country}
        </p>
      )}
      {order.items && order.items.length > 0 && (
        <ul className="mt-4 divide-y divide-brand/10 text-sm">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-2 text-brand"
            >
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>${item.line_total}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 border-t border-brand/10 pt-4 font-semibold text-brand">
        Total: ${order.total}
      </p>
    </div>
  );
}

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const orderId = orderIdParam ? Number.parseInt(orderIdParam, 10) : NaN;

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<
    "loading" | "paid" | "pending" | "error"
  >("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    clearCheckoutPaymentLock();
  }, []);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setStatus("error");
      setMessage("Missing or invalid order ID.");
      return;
    }

    let cancelled = false;

    async function resolvePayment() {
      try {
        const orderPromise = getOrder(orderId);
        const timeoutPromise = sleep(15_000).then(() => {
          throw new ApiError(
            "The server took too long to confirm your order. Please refresh this page.",
            0,
          );
        });
        let { order: current } = await Promise.race([
          orderPromise,
          timeoutPromise,
        ]);
        if (cancelled) return;

        const markPaid = (o: Order) => {
          setOrder(o);
          setStatus("paid");
          setMessage("Payment successful");
        };

        if (current.is_paid || current.status === "paid") {
          markPaid(current);
          return;
        }

        const likelyStripe =
          Boolean(sessionId) || current.payment_provider === "stripe";
        if (likelyStripe && current.status === "pending") {
          const confirmed = await tryConfirmStripe(orderId, sessionId);
          if (confirmed) {
            current = confirmed;
            if (cancelled) return;
            if (current.is_paid || current.status === "paid") {
              markPaid(current);
              return;
            }
          }
        }

        const likelyPayPal = current.payment_provider === "paypal";
        if (likelyPayPal && current.status === "pending") {
          try {
            const captured = await capturePayPal(orderId);
            current = captured.order;
            if (cancelled) return;
            if (current.is_paid || current.status === "paid") {
              markPaid(current);
              return;
            }
          } catch {
            // Webhook may still complete
          }
        }

        setOrder(current);
        setStatus("pending");
        setMessage("Processing payment…");

        const startedAt = Date.now();
        let pollCount = 0;
        while (Date.now() - startedAt < POLL_MAX_MS && !cancelled) {
          await sleep(POLL_INTERVAL_MS);
          pollCount += 1;

          if (
            likelyStripe &&
            current.status === "pending" &&
            pollCount % 3 === 0
          ) {
            const confirmed = await tryConfirmStripe(orderId, sessionId);
            if (confirmed) {
              current = confirmed;
              if (cancelled) return;
              setOrder(current);
              if (current.is_paid || current.status === "paid") {
                markPaid(current);
                return;
              }
            }
          }

          const refreshed = await getOrder(orderId);
          current = refreshed.order;
          if (cancelled) return;
          setOrder(current);

          if (current.is_paid || current.status === "paid") {
            markPaid(current);
            return;
          }
        }

        setStatus("pending");
        setMessage(
          "Payment is still processing. We will email you when it is confirmed.",
        );
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            err instanceof ApiError
              ? err.message
              : "Could not load order details",
          );
        }
      }
    }

    resolvePayment();

    return () => {
      cancelled = true;
    };
  }, [orderId, sessionId]);

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 text-brand/70">
          <Spinner className="h-8 w-8" />
          <p>Confirming your payment…</p>
        </div>
      )}

      {status === "paid" && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-brand">{message}</h1>
          <p className="mt-2 text-brand/70">
            Thank you for your order. A confirmation will be sent to your email.
          </p>
          {order && <OrderSummary order={order} />}
        </>
      )}

      {status === "pending" && (
        <>
          <Spinner className="mx-auto h-8 w-8 text-brand" />
          <h1 className="mt-6 text-2xl font-bold text-brand">{message}</h1>
          {order && <OrderSummary order={order} />}
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-brand">Something went wrong</h1>
          <p className="mt-2 text-red-600">{message}</p>
        </>
      )}

      <Link
        to="/shop"
        className="mt-8 inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-muted"
      >
        Back to shop
      </Link>
    </main>
  );
}
