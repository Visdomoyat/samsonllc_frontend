import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";

import { CHECKOUT_ORDER_STORAGE_KEY } from "~/lib/checkout";

export function meta() {
  return [{ title: "Payment cancelled — Eliteforge LLC" }];
}

export default function CheckoutCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    sessionStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
  }, []);

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand/60">
        Eliteforge LLC
      </p>
      <h1 className="mt-2 text-2xl font-bold text-brand">Payment cancelled</h1>
      <p className="mt-4 text-brand/70">
        Your order{orderId ? ` #${orderId}` : ""} is saved but not paid. You can
        try checkout again anytime from the shop.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-muted"
        >
          Return to Eliteforge LLC
        </Link>
        <Link
          to="/shop"
          className="rounded-lg border border-brand/20 px-6 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
