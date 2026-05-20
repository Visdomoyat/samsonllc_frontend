import { Link } from "react-router";

import logo from "~/assets/image/logo.jpeg";
import { useCart } from "~/context/CartContext";
import type { Product } from "~/lib/api";

const highlights = [
  {
    title: "Research-grade quality",
    description:
      "Every batch is held to strict standards so you know exactly what you are working with.",
  },
  {
    title: "Transparent sourcing",
    description:
      "Clear product details and documentation — no guesswork, no surprises.",
  },
  {
    title: "Fast, reliable shipping",
    description:
      "Orders are packed carefully and shipped promptly so your research stays on schedule.",
  },
] as const;

function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm transition hover:shadow-md">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-surface text-sm text-brand/40">
          No image
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-brand">{product.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-brand/70">
          {product.description}
        </p>
        <p className="mt-3 font-semibold text-brand">${product.price}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex-1 rounded-lg bg-brand py-2 text-sm font-medium text-white transition hover:bg-brand-muted"
          >
            Add to cart
          </button>
          <Link
            to="/shop"
            className="rounded-lg border border-brand/15 px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand/5"
          >
            Shop
          </Link>
        </div>
      </div>
    </article>
  );
}

type LandingProps = {
  featuredProducts: Product[];
  productsError: string | null;
};

export default function Landing({
  featuredProducts,
  productsError,
}: LandingProps) {

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #001b44 0%, transparent 50%), radial-gradient(circle at 80% 20%, #001b44 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:gap-16 lg:text-left">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand/60">
              Eliteforge Peptides
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-brand sm:text-5xl lg:text-6xl">
              Precision peptides for serious research
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-brand/70 lg:mx-0">
              Discover a curated catalog of premium peptides — backed by quality
              you can trust and a team that puts your work first.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/shop"
                className="rounded-lg bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-muted"
              >
                Browse the shop
              </Link>
              <Link
                to="/contact"
                className="rounded-lg border border-brand/20 bg-white px-8 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
              >
                Contact us
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-brand/10">
            <img
              src={logo}
              alt="Eliteforge Peptide"
              className="h-auto w-full max-w-xs object-contain sm:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand sm:text-3xl">
            Why researchers choose Eliteforge
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand/70">
            We focus on what matters most: consistent quality, clear information,
            and dependable service.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {highlights.map(({ title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
                <span className="text-lg font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-brand">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured products */}
      <section className="border-t border-brand/10 bg-white/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                Featured products
              </h2>
              <p className="mt-2 text-brand/70">
                A selection from our catalog — add to cart or explore the full
                shop.
              </p>
            </div>
            <Link
              to="/shop"
              className="shrink-0 text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              View all products →
            </Link>
          </div>

          {productsError && (
            <p className="mt-8 text-red-600">{productsError}</p>
          )}

          {!productsError && featuredProducts.length === 0 && (
            <p className="mt-8 rounded-xl border border-brand/10 bg-surface p-8 text-center text-brand/70">
              New products coming soon. Check back shortly or{" "}
              <Link to="/contact" className="font-medium text-brand underline">
                get in touch
              </Link>
              .
            </p>
          )}

          {featuredProducts.length > 0 && (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-2xl bg-brand px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to place an order?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Browse our full catalog, add items to your cart, and reach out if you
            have questions about any product.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-brand transition hover:bg-surface"
          >
            Start shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
