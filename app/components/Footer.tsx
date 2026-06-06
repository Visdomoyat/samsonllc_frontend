import { Link } from "react-router";

import logo from "~/assets/image/logo.jpeg";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={logo}
              alt="Eliteforge Peptides"
              className="h-12 w-auto rounded-md bg-white/95 object-contain p-1"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Research-grade peptides for serious laboratories. Quality you can
              verify, shipping you can count on.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
              Quality
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>99% purity standard</li>
              <li>Research use only</li>
              <li>Lab-grade packaging</li>
              <li>Tracked shipping</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
              Contact
            </h3>
            <p className="mt-4 text-sm text-white/75">
              Questions about products or orders?
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-block text-sm font-medium text-accent transition hover:text-white"
            >
              Get in touch →
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-xs leading-relaxed text-white/50">
            Products sold by Eliteforge are intended for laboratory and research
            use only. Not for human consumption. © {new Date().getFullYear()}{" "}
            Eliteforge LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
