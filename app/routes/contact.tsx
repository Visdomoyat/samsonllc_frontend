import { useState } from "react";
import { Link } from "react-router";

import packagingBox from "~/assets/image/packaging-2.jpeg";
import Spinner from "~/components/Spinner";
import { ApiError } from "~/lib/api";
import { submitContact } from "~/lib/contact";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — Eliteforge Peptide" },
    { name: "description", content: "Get in touch with Eliteforge Peptide" },
  ];
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
          <form
            className="rounded-2xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold text-brand">Send a message</h2>
            <p className="mt-1 text-sm text-brand/60">
              We typically respond within one business day.
            </p>

            {sent && (
              <p
                className="mt-4 rounded-xl border border-accent-emerald/30 bg-accent-emerald/10 px-4 py-3 text-sm font-medium text-brand"
                role="status"
              >
                Message sent. We&apos;ll get back to you soon.
              </p>
            )}

            {error && (
              <p
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Name
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15 disabled:opacity-60"
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15 disabled:opacity-60"
                  autoComplete="email"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-brand">
                Message
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="rounded-xl border border-brand/15 px-4 py-2.5 text-base font-normal outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15 disabled:opacity-60"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-muted py-3 text-sm font-bold text-white transition hover:from-accent hover:to-accent-teal disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {submitting ? <Spinner className="text-white" /> : null}
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
