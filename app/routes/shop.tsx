import { useLoaderData } from "react-router";

import landing from "~/assets/image/landing.png";
import ProductCard from "~/components/ProductCard";
import { ApiError, getProducts } from "~/lib/api";
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

export default function Shop() {
  const { products, query, productsError } = useLoaderData<typeof loader>();

  return (
    <div className="bg-surface">
      {/* Shop hero */}
      <section className="hero-gradient relative overflow-hidden border-b border-brand/10">
        <img
          src={landing}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-8 bottom-0 h-48 w-auto object-contain opacity-20 sm:h-56 lg:h-64"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Research catalog
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Shop peptides
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Browse our full selection of research-grade peptides. Every product
            is held to 99% purity standards — for laboratory use only.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["99% Purity", "Research Grade", "Lab Quality", "Tracked Shipping"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {badge}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {query && (
          <p className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-brand">
            Showing results for{" "}
            <span className="font-semibold text-accent">&ldquo;{query}&rdquo;</span>
          </p>
        )}

        {productsError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {productsError}
          </p>
        )}

        {products && products.length === 0 && (
          <div className="rounded-2xl border border-brand/10 bg-white p-12 text-center">
            <p className="text-lg font-medium text-brand">No products found.</p>
            <p className="mt-2 text-brand/60">
              Try a different search or check back soon for new listings.
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
