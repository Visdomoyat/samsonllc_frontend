import { useEffect, useRef, useState } from "react";

import Spinner from "~/components/Spinner";
import PayPalLogo from "~/components/PayPalLogo";
import { ApiError } from "~/lib/api";
import {
  getOrder,
  getPaymentConfig,
  payWithPayPal,
  payWithStripe,
  setCheckoutPaymentLock,
  type Order,
  type PaymentConfig,
} from "~/lib/checkout";

type PayTarget = "stripe" | "paypal" | null;

type CheckoutPaymentProps = {
  orderId: number;
  onBusyChange?: (busy: boolean) => void;
};

export default function CheckoutPayment({
  orderId,
  onBusyChange,
}: CheckoutPaymentProps) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [paying, setPaying] = useState<PayTarget>(null);
  const payInFlight = useRef(false);
  const stripeCheckoutPending = order?.stripe_checkout_pending === true;
  const paypalCheckoutPending = order?.paypal_checkout_pending === true;

  useEffect(() => {
    onBusyChange?.(paying !== null);
  }, [paying, onBusyChange]);

  useEffect(() => {
    let cancelled = false;
    setLoadingConfig(true);
    setConfigError(null);

    Promise.all([getPaymentConfig(), getOrder(orderId)])
      .then(([paymentConfig, orderResponse]) => {
        if (!cancelled) {
          setConfig(paymentConfig);
          setOrder(orderResponse.order);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setConfigError(
            err instanceof ApiError
              ? err.message
              : "Could not load payment options",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingConfig(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function redirectToPayment(
    provider: PayTarget,
    fetchUrl: () => Promise<{ checkout_url?: string; approval_url?: string }>,
  ) {
    if (payInFlight.current || paying) return;

    payInFlight.current = true;
    setPayError(null);
    setPaying(provider);

    try {
      const data = await fetchUrl();
      const targetUrl = data.checkout_url ?? data.approval_url;

      if (!targetUrl) {
        throw new ApiError("Payment provider did not return a checkout URL.", 502);
      }

      setCheckoutPaymentLock(orderId);
      window.location.assign(targetUrl);
    } catch (err) {
      setPayError(
        err instanceof ApiError ? err.message : "Payment checkout failed",
      );
      setPaying(null);
      payInFlight.current = false;
    }
  }

  function handleStripe() {
    return redirectToPayment("stripe", () => payWithStripe(orderId));
  }

  function handlePayPal() {
    return redirectToPayment("paypal", () => payWithPayPal(orderId));
  }

  const busy = paying !== null;

  return (
    <section className="relative rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
      {busy && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/90 px-6 text-center"
          role="status"
          aria-live="polite"
        >
          <Spinner className="h-8 w-8" />
          <p className="text-sm font-medium text-brand">
            Redirecting to{" "}
            {paying === "stripe" ? "card checkout" : "PayPal"}…
          </p>
          <p className="text-xs text-brand/60">
            Please wait — do not close this page or start a new order.
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold text-brand">Choose how to pay</h2>
      <p className="mt-1 text-sm text-brand/70">
        Order #{orderId} is saved. Complete payment to confirm your purchase.
      </p>

      {loadingConfig && (
        <div className="mt-6 flex items-center gap-2 text-brand/70">
          <Spinner />
          <span className="text-sm">Loading payment options…</span>
        </div>
      )}

      {configError && (
        <p className="mt-4 text-sm text-red-600">{configError}</p>
      )}

      {!loadingConfig && config && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {config.stripe_enabled ? (
            <button
              type="button"
              onClick={handleStripe}
              disabled={busy || paypalCheckoutPending}
              title={
                paypalCheckoutPending
                  ? "Complete or cancel PayPal checkout before using card payment"
                  : undefined
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying === "stripe" ? <Spinner className="text-white" /> : null}
              Pay with card
            </button>
          ) : null}

          {config.paypal_enabled ? (
            <button
              type="button"
              onClick={handlePayPal}
              disabled={busy || stripeCheckoutPending}
              aria-label="Pay with PayPal"
              title={
                stripeCheckoutPending
                  ? "Complete or cancel card checkout before using PayPal"
                  : undefined
              }
              className="inline-flex min-h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-[#cba032] bg-[#ffc439] px-6 py-3 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying === "paypal" ? (
                <Spinner />
              ) : (
                <>
                  <PayPalLogo className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-semibold text-[#2c2e2f]">
                    Pay with PayPal
                  </span>
                </>
              )}
            </button>
          ) : null}

          {!config.stripe_enabled && !config.paypal_enabled && (
            <p className="text-sm text-brand/70">Payments not configured</p>
          )}
        </div>
      )}

      {stripeCheckoutPending && (
        <p className="mt-4 text-sm text-brand/70">
          Card checkout is in progress for this order. Finish paying with your
          card, or cancel that checkout, before using PayPal.
        </p>
      )}

      {paypalCheckoutPending && (
        <p className="mt-4 text-sm text-brand/70">
          PayPal checkout is in progress for this order. Finish paying with
          PayPal, or cancel that checkout, before using your card.
        </p>
      )}

      {payError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {payError}
        </p>
      )}
    </section>
  );
}
