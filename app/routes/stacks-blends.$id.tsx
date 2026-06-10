import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";

import { ApiError, getStackBlend } from "~/lib/api";
import {
  calculateStackBlendTotal,
  formatUsd,
} from "~/lib/stackBlendPricing";
import { useCart } from "~/context/CartContext";
import type { Route } from "./+types/stacks-blends.$id";

export async function loader({ params, request }: Route.LoaderArgs) {
  const id = Number.parseInt(params.id ?? "", 10);
  if (!Number.isFinite(id)) {
    throw new Response("Not found", { status: 404 });
  }

  try {
    const { stack_blend } = await getStackBlend(id, request);
    return { stackBlend: stack_blend };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not found", { status: 404 });
    }
    throw error;
  }
}

export function meta({ data }: Route.MetaArgs) {
  const name = data?.stackBlend?.name ?? "Stack / blend";
  return [
    { title: `${name} — Eliteforge Peptide` },
    {
      name: "description",
      content: data?.stackBlend?.description ?? "Ready-made stack or blend",
    },
  ];
}

export default function StackBlendDetail() {
  const { stackBlend } = useLoaderData<typeof loader>();
  const { addStackBlendItem, openCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const unitPrice = Number.parseFloat(stackBlend.price);
  const lineTotal = calculateStackBlendTotal(stackBlend.price, quantity);
  const standardTotal = unitPrice * quantity;
  const savings = Math.max(0, standardTotal - lineTotal);

  function handleAddToCart() {
    addStackBlendItem(stackBlend, quantity);
    openCart();
  }

  function handleBuyNow() {
    addStackBlendItem(stackBlend, quantity);
    navigate("/checkout");
  }

  const tiers = stackBlend.bundle_tiers ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to="/"
        className="text-sm font-medium text-brand/60 transition hover:text-brand"
      >
        ← Back to home
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple/15 via-white to-accent-teal/15 p-10 ring-1 ring-brand/10">
          <span className="absolute left-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand shadow">
            {stackBlend.kind_label}
          </span>
          {stackBlend.image_url ? (
            <img
              src={stackBlend.image_url}
              alt={stackBlend.name}
              className="mx-auto max-h-[28rem] w-full object-contain drop-shadow-2xl"
              style={{ transform: "rotate(-8deg)" }}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-brand/40">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-brand sm:text-4xl">
            {stackBlend.name}
          </h1>
          {stackBlend.description && (
            <p className="mt-4 text-brand/70">{stackBlend.description}</p>
          )}

          <section className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h2 className="text-xl font-bold text-brand">Bundle &amp; save</h2>
            <p className="mt-1 text-sm text-brand/70">
              Standard price: {formatUsd(unitPrice)} each
            </p>

            {tiers.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {tiers.map((tier) => (
                  <li
                    key={tier.quantity}
                    className="flex items-center justify-between rounded-lg bg-white/80 px-4 py-2 text-sm"
                  >
                    <span className="text-brand">
                      {tier.quantity === 4 ? "4+" : `Buy ${tier.quantity}`}
                      {tier.discount_percent
                        ? ` · ${tier.discount_percent}% off`
                        : tier.quantity === 4
                          ? " · bundle pricing"
                          : ""}
                    </span>
                    <span className="font-semibold text-brand">
                      {formatUsd(Number.parseFloat(tier.line_total))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <div className="mt-8">
            <label
              htmlFor="stack-blend-qty"
              className="text-sm font-semibold text-brand"
            >
              Quantity
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/15 bg-white text-brand hover:bg-brand/5"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="stack-blend-qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10);
                  setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                }}
                className="w-20 rounded-lg border border-brand/15 px-3 py-2 text-center text-brand"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/15 bg-white text-brand hover:bg-brand/5"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-brand/10 bg-white p-4">
              <div className="flex justify-between text-brand">
                <span>Your total</span>
                <span className="text-xl font-bold">{formatUsd(lineTotal)}</span>
              </div>
              {savings > 0 && (
                <p className="mt-1 text-right text-sm font-medium text-accent-emerald">
                  You save {formatUsd(savings)}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-xl border border-brand/20 bg-white py-3 text-sm font-bold text-brand transition hover:bg-brand/5"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-muted"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
