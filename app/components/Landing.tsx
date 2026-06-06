import { Link } from "react-router";

import landing from "~/assets/image/landing.png";
import packaging from "~/assets/image/packaging.jpeg";
import packagingBox from "~/assets/image/packaging-2.jpeg";
import ProductCard from "~/components/ProductCard";
import type { Product } from "~/lib/api";

const trustItems = [
  "99% Purity Standard",
  "Research Grade",
  "Laboratory Quality",
  "High Purity",
  "Fast Tracked Shipping",
  "Secure Checkout",
] as const;

const highlights = [
  {
    title: "Research-grade quality",
    description:
      "Every batch is held to strict purity standards so you know exactly what you are working with.",
    accent: "from-accent to-accent-teal",
    icon: "🧪",
  },
  {
    title: "Transparent sourcing",
    description:
      "Clear product details and documentation — no guesswork, no surprises in your lab.",
    accent: "from-accent-teal to-accent-emerald",
    icon: "🔬",
  },
  {
    title: "Fast, reliable shipping",
    description:
      "Branded packaging, careful handling, and prompt dispatch so your research stays on schedule.",
    accent: "from-accent-purple to-accent",
    icon: "📦",
  },
  {
    title: "Dedicated support",
    description:
      "Questions about products or orders? Our team responds quickly with the details you need.",
    accent: "from-vial to-accent-purple",
    icon: "💬",
  },
] as const;

const stats = [
  { value: "99%", label: "Purity target" },
  { value: "24h", label: "Order processing" },
  { value: "100%", label: "Research use" },
  { value: "US", label: "Domestic shipping" },
] as const;

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
      <section className="hero-gradient relative overflow-hidden">
        <div
          className="glow-orb pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div
          className="glow-orb pointer-events-none absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-accent-purple/20 blur-3xl"
          aria-hidden
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-12 lg:py-24 lg:text-left">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-accent uppercase backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              Eliteforge Research Peptides
            </span>
            <h1 className="mt-6 text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              Precision Peptides for{" "}
              <span className="gradient-text">Serious Research</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75 lg:mx-0">
              Premium research peptides in lab-grade packaging — backed by 99%
              purity standards, transparent sourcing, and a team that puts your
              work first.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
                >
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-[11px] font-medium tracking-wide text-white/60 uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/shop"
                className="rounded-xl bg-gradient-to-r from-accent to-accent-teal px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition hover:brightness-110"
              >
                Browse the shop
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="hero-float relative flex shrink-0 items-center justify-center lg:flex-1 lg:justify-end">
            <div
              className="absolute inset-0 rounded-full bg-vial/30 blur-3xl"
              aria-hidden
            />
            <img
              src={landing}
              alt="Eliteforge peptide vials — Tesamorelin, BPC-157/TB-500, GHK-Cu"
              className="relative h-auto w-full max-w-sm object-contain sm:max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Trust marquee */}
      <div className="overflow-hidden border-y border-brand/10 bg-white py-3">
        <div className="marquee-track flex w-max gap-8">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold text-brand/80"
            >
              <span className="text-accent">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <section className="molecule-pattern mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Why Eliteforge
          </p>
          <h2 className="mt-2 text-3xl font-bold text-brand sm:text-4xl">
            Built for researchers who demand more
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand/70">
            From purity testing to branded packaging, every detail is designed
            for professional laboratory use.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ title, description, accent, icon }) => (
            <li
              key={title}
              className="card-shine group relative overflow-hidden rounded-2xl border border-brand/10 p-6 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-xl shadow-md`}
              >
                {icon}
              </div>
              <h3 className="font-bold text-brand">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Packaging showcase */}
      <section className="border-y border-brand/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <img
              src={packagingBox}
              alt="Eliteforge branded peptide shipping box"
              className="h-56 w-full rounded-2xl border border-brand/10 object-cover shadow-lg sm:h-64"
            />
             <img
              src={landing}
              alt="Eliteforge peptide vials"
              className="h-56 w-full rounded-2xl border border-brand/10 bg-brand object-contain p-4 shadow-md sm:h-64"
            />
            <img
              src={packaging}
              alt="Eliteforge research peptide packaging bundles"
              className="h-56 w-full rounded-2xl border border-brand/10 object-cover shadow-md sm:h-64"
            />
           
          </div>

          <div className="mt-10 sm:mt-12 text-center mx-auto">
            <p className="text-sm font-bold tracking-widest text-accent-purple uppercase">
              Professional packaging
            </p>
            <h2 className="mt-2 text-3xl font-bold text-brand sm:text-4xl ">
              Lab-grade presentation, every order
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-brand/70 mx-auto">
              Every shipment leaves in Eliteforge-branded packaging — research
              grade, laboratory quality, and high purity clearly marked on every
              box. Your peptides arrive protected and ready for the bench.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:max-w-4xl mx-auto">
              {[
                "Branded cobalt vials with batch labeling",
                "Secure, tamper-aware packaging",
                "Research use only — clearly marked",
                "Tracked shipping with email updates",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-brand/80"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-emerald/15 text-xs text-accent-emerald">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-muted"
            >
              View catalog
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold tracking-widest text-accent-purple uppercase ">
                Our Catalog
              </p>
              <h2 className="mt-1 text-3xl font-bold text-brand sm:text-4xl">
                Featured products
              </h2>
              <p className="mt-2 text-brand/70">
                A selection from our research peptide catalog — add to cart or
                explore the full shop.
              </p>
            </div>
            <Link
              to="/shop"
              className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              View all products →
            </Link>
          </div>

          {productsError && (
            <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
              {productsError}
            </p>
          )}

          {!productsError && featuredProducts.length === 0 && (
            <p className="mt-8 rounded-2xl border border-brand/10 bg-white p-10 text-center text-brand/70">
              New products coming soon. Check back shortly or{" "}
              <Link to="/contact" className="font-semibold text-accent underline">
                get in touch
              </Link>
              .
            </p>
          )}

          {featuredProducts.length > 0 && (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} showShopLink />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-muted to-vial px-8 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
            }}
          />
          <img
            src={landing}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -left-4 h-32 w-auto object-contain opacity-30 sm:h-40 lg:h-48"
          />
          <img
            src={landing}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-4 -bottom-6 h-32 w-auto scale-x-[-1] object-contain opacity-30 sm:h-40 lg:h-48"
          />
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-widest text-accent uppercase">
              Start your order
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Ready to place an order?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80">
              Browse our full catalog, add items to your cart, and reach out if
              you have questions about any product.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-brand transition hover:bg-surface"
              >
                Start shopping
              </Link>
              <Link
                to="/contact"
                className="inline-block rounded-xl border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
