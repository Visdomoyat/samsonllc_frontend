import { useState } from "react";
import { Form, Link, useLocation, useNavigate, useSearchParams } from "react-router";

import logo from "~/assets/image/logo.jpeg";
import { useCart } from "~/context/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12L6 6z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function NavLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        isActive
          ? "bg-accent/10 text-accent"
          : "text-brand hover:bg-white hover:text-brand-muted"
      }`}
    >
      {label}
    </Link>
  );
}

function SearchBar({
  className = "",
  onSearch,
}: {
  className?: string;
  onSearch?: () => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultQuery = searchParams.get("q") ?? "";

  return (
    <Form
      role="search"
      className={`relative flex min-w-0 flex-1 items-center ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const query = new FormData(form).get("q");
        const q = typeof query === "string" ? query.trim() : "";
        navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
        onSearch?.();
      }}
    >
      <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-accent/60" />
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Search peptides…"
        className="w-full min-w-0 rounded-full border border-brand/10 bg-white py-2 pr-4 pl-9 text-sm text-brand shadow-sm outline-none transition placeholder:text-brand/40 focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
        aria-label="Search products"
      />
    </Form>
  );
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Promo strip */}
      <div className="bg-gradient-to-r from-brand via-brand-muted to-vial px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-white">
        <span className="text-accent">★</span> Research-grade peptides · 99%
        purity · Fast tracked shipping{" "}
        <Link to="/shop" className="ml-1 underline underline-offset-2 hover:text-accent">
          Shop now
        </Link>
      </div>

      <div className="border-b border-brand/10 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 sm:h-[4.25rem] sm:gap-4">
            <Link
              to="/"
              className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={closeMenu}
            >
              <img
                src={logo}
                alt="Eliteforge Peptide"
                className="h-10 w-auto rounded object-contain sm:h-11"
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 sm:flex lg:gap-6">
              <nav
                className="flex shrink-0 items-center gap-1"
                aria-label="Main navigation"
              >
                {navLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to} label={label} />
                ))}
              </nav>
              <div className="hidden w-full max-w-sm lg:block">
                <SearchBar />
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
                aria-controls="cart-drawer"
              >
                <CartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-teal px-1 text-[10px] font-bold text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-accent/10 sm:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          <div className="hidden pb-3 sm:block lg:hidden">
            <SearchBar />
          </div>
        </div>

        <div
          id="mobile-nav"
          className={`border-t border-brand/10 bg-white sm:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  label={label}
                  onClick={closeMenu}
                />
              ))}
            </nav>
            <SearchBar onSearch={closeMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}
