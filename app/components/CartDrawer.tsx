import { useEffect } from "react";

import { Link } from "react-router";

import { useCart } from "~/context/CartContext";
import { cartItemKey, cartLineTotal } from "~/lib/cartItem";
import { formatUsd } from "~/lib/stackBlendPricing";

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

function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-brand/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-brand/10 px-5 py-4">
          <h2 id="cart-drawer-title" className="text-lg font-semibold text-brand">
            Your cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-brand/60">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-white/80"
            aria-label="Close cart"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-brand/70">Your cart is empty.</p>
            <p className="mt-2 text-sm text-brand/50">
              Add products from the shop to see them here.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-muted"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li
                  key={cartItemKey(item)}
                  className="flex gap-3 border-b border-brand/10 py-4 last:border-b-0"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-white text-xs text-brand/40">
                      No image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-brand">{item.name}</h3>
                    {item.sizeLabel && (
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                        {item.sizeLabel}
                      </p>
                    )}
                    {item.itemType === "stack_blend" && (
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                        Stack / blend
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-1 line-clamp-3 text-sm text-brand/70">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-brand">
                      {formatUsd(cartLineTotal(item))}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            {
                              itemType: item.itemType,
                              id: item.id,
                              variantId: item.variantId,
                            },
                            item.quantity - 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-brand/15 bg-white text-brand transition hover:bg-brand/5"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm text-brand">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            {
                              itemType: item.itemType,
                              id: item.id,
                              variantId: item.variantId,
                            },
                            item.quantity + 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-brand/15 bg-white text-brand transition hover:bg-brand/5"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeItem({
                            itemType: item.itemType,
                            id: item.id,
                            variantId: item.variantId,
                          })
                        }
                        className="ml-auto text-sm text-brand/50 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-brand/10 bg-surface px-5 py-4">
              <div className="flex items-center justify-between text-brand">
                <span className="font-medium">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="mt-4 block w-full rounded-lg bg-brand py-3 text-center text-sm font-medium text-white transition hover:bg-brand-muted"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full py-2 text-sm text-brand/50 transition hover:text-brand"
              >
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
