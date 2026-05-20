import { useState } from "react";
import { useLoaderData } from "react-router";

import { ApiError, getProducts, type Product } from "~/lib/api";
import { useCart } from "~/context/CartContext";
import type { Route } from "./+types/shop";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

  try {
    const { products } = await getProducts(request);
    const filtered = query
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query),
        )
      : products;
    return { products: filtered, query, productsError: null };
  } catch (error) {
    return {
      products: null,
      query,
      productsError:
        error instanceof ApiError ? error.message : "Could not load products",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shop — Eliteforge Peptide" },
    { name: "description", content: "Browse our peptide products" },
  ];
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-brand/10 bg-white">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-surface text-brand/40">
          No image
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-medium text-brand">{product.name}</h2>
        <p className="mt-1 line-clamp-3 flex-1 text-sm text-brand/70">
          {product.description}
        </p>
        <p className="mt-3 text-lg font-semibold text-brand">${product.price}</p>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-4 w-full rounded-lg py-2.5 text-sm font-medium transition ${
            added
              ? "bg-brand/10 text-brand"
              : "bg-brand text-white hover:bg-brand-muted"
          }`}
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </li>
  );
}

export default function Shop() {
  const { products, query, productsError } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-brand">Shop</h1>
      {query && (
        <p className="mt-2 text-brand/70">
          Results for &ldquo;{query}&rdquo;
        </p>
      )}
      {productsError && (
        <p className="mt-6 text-red-600">{productsError}</p>
      )}
      {products && products.length === 0 && (
        <p className="mt-6 text-brand/70">No products found.</p>
      )}
      {products && products.length > 0 && (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </main>
  );
}
