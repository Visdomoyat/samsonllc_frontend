import { Link } from "react-router";

import packagingBox from "~/assets/image/packaging-2.jpeg";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — Eliteforge Peptide" },
    { name: "description", content: "Get in touch with Eliteforge Peptide" },
  ];
}

export default function Contact() {
  return (
    <div className="bg-surface">
      <section className="hero-gradient border-b border-brand/10 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Support
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Questions about products, orders, or research applications? We&apos;re
            here to help.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:py-16">
        <div className="lg:col-span-3">
          <form className="rounded-2xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-brand">Send a message</h2>
            <p className="mt-1 text-sm text-brand/60">
              We typically respond within one business day.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Name
                <input
                  type="text"
                  name="name"
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Email
                <input
                  type="email"
                  name="email"
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                  autoComplete="email"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Message
                <textarea
                  name="message"
                  rows={5}
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-brand to-brand-muted py-3 text-sm font-bold text-white transition hover:from-accent hover:to-accent-teal sm:w-auto sm:px-8"
              >
                Send message
              </button>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-brand/10 shadow-md">
            <img
              src={packagingBox}
              alt="Eliteforge branded peptide packaging"
              className="w-full object-cover"
            />
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
              <h3 className="font-bold text-brand">Order support</h3>
              <p className="mt-1 text-sm text-brand/70">
                Tracking, shipping, or payment questions? Include your order
                number for faster help.
              </p>
            </div>
            <div className="rounded-xl border border-accent-teal/20 bg-accent-teal/5 p-5">
              <h3 className="font-bold text-brand">Product inquiries</h3>
              <p className="mt-1 text-sm text-brand/70">
                Ask about purity, specifications, or availability for any
                peptide in our catalog.
              </p>
            </div>
            <Link
              to="/shop"
              className="block rounded-xl bg-brand py-3 text-center text-sm font-bold text-white transition hover:bg-brand-muted"
            >
              Browse the shop →
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
