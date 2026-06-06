import { useEffect, useState } from "react";

import Spinner from "~/components/Spinner";
import PayPalLogo from "~/components/PayPalLogo";
import { ApiError } from "~/lib/api";
import {
  getPaymentConfig,
  payWithPayPal,
  payWithStripe,
  type PaymentConfig,
} from "~/lib/checkout";

type PayTarget = "stripe" | "paypal" | null;

export default function CheckoutPayment({ orderId }: { orderId: number }) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [paying, setPaying] = useState<PayTarget>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingConfig(true);
    setConfigError(null);

    getPaymentConfig()
      .then((data) => {
        if (!cancelled) setConfig(data);
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
  }, []);

  async function handleStripe() {
    setPayError(null);
    setPaying("stripe");
    try {
      const data = await payWithStripe(orderId);
      window.location.href = data.checkout_url;
    } catch (err) {
      setPayError(
        err instanceof ApiError ? err.message : "Stripe checkout failed",
      );
      setPaying(null);
    }
  }

  async function handlePayPal() {
    setPayError(null);
    setPaying("paypal");
    try {
      const data = await payWithPayPal(orderId);
      window.location.href = data.approval_url;
    } catch (err) {
      setPayError(
        err instanceof ApiError ? err.message : "PayPal checkout failed",
      );
      setPaying(null);
    }
  }

  const busy = paying !== null;

  return (
    <section className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
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
              disabled={busy}
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
              disabled={busy}
              aria-label="Pay with PayPal"
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

      {payError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {payError}
        </p>
      )}
    </section>
  );
}
