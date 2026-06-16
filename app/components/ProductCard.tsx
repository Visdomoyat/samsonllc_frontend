import { useMemo, useState } from "react";
import { Link } from "react-router";

import { useCart } from "~/context/CartContext";
import type { Product, ProductVariant } from "~/lib/api";

type ProductCardProps = {
  product: Product;
  showShopLink?: boolean;
};

function sortVariants(variants: ProductVariant[]) {
  return [...variants].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }
    const aSize = Number.parseFloat(a.size_value);
    const bSize = Number.parseFloat(b.size_value);
    if (Number.isFinite(aSize) && Number.isFinite(bSize) && aSize !== bSize) {
      return aSize - bSize;
    }
    return a.id - b.id;
  });
}

export default function ProductCard({
  product,
  showShopLink = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const variants = useMemo(
    () => sortVariants(product.variants.filter((variant) => variant.is_active)),
    [product.variants],
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => variants[0]?.id ?? null,
  );
  const [added, setAdded] = useState(false);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem(product, selectedVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  const priceLabel = selectedVariant
    ? `$${selectedVariant.price}`
    : product.price_from
      ? `From $${product.price_from}`
      : "—";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
      <div className="relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand/5 via-accent/5 to-accent-purple/5 text-sm text-brand/40">
            No image
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          99% Purity
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          Research grade
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-brand group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-brand/70">
          {product.description}
        </p>

        {variants.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand/50">
              Select size
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.map((variant) => {
                const selected = variant.id === selectedVariant?.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      selected
                        ? "border-brand bg-brand text-white"
                        : "border-brand/15 bg-white text-brand hover:border-accent/40"
                    }`}
                  >
                    {variant.size_label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-brand/50">No sizes available</p>
        )}

        <p className="mt-3 text-xl font-bold text-brand">{priceLabel}</p>

        <div className={`mt-4 flex gap-2 ${showShopLink ? "" : ""}`}>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              added
                ? "bg-accent-emerald/15 text-accent-emerald"
                : "bg-gradient-to-r from-brand to-brand-muted text-white hover:from-accent hover:to-accent-teal"
            }`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          {showShopLink && (
            <Link
              to="/shop"
              className="rounded-xl border border-brand/15 px-4 py-2.5 text-sm font-medium text-brand transition hover:border-accent/40 hover:bg-accent/5"
            >
              Shop
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
