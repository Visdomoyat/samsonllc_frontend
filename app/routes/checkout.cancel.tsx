import { Link, useSearchParams } from "react-router";

export function meta() {
  return [{ title: "Payment cancelled — Eliteforge Peptide" }];
}

export default function CheckoutCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-brand">Payment cancelled</h1>
      <p className="mt-4 text-brand/70">
        Your order{orderId ? ` #${orderId}` : ""} is saved but not paid. You can
        return to checkout and try again when you are ready.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/checkout"
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-muted"
        >
          Return to checkout
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
