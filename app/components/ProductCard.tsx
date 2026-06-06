import { useState } from "react";
import { Link } from "react-router";

import { useCart } from "~/context/CartContext";
import type { Product } from "~/lib/api";

type ProductCardProps = {
  product: Product;
  showShopLink?: boolean;
};

export default function ProductCard({
  product,
  showShopLink = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

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
        <p className="mt-3 text-xl font-bold text-brand">${product.price}</p>

        <div className={`mt-4 flex gap-2 ${showShopLink ? "" : ""}`}>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
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
