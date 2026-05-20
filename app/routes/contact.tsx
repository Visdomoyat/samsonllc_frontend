import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — Eliteforge Peptide" },
    { name: "description", content: "Get in touch with Eliteforge Peptide" },
  ];
}

export default function Contact() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-neutral-900">Contact us</h1>
      <p className="mt-4 text-neutral-600">
        Questions about our products? Reach out and we&apos;ll get back to you
        shortly.
      </p>
      <form className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Name
          <input
            type="text"
            name="name"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Email
          <input
            type="email"
            name="email"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Message
          <textarea
            name="message"
            rows={5}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
        >
          Send message
        </button>
      </form>
    </main>
  );
}
