import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product, ProductVariant, StackBlend } from "~/lib/api";
import { cartItemKey, cartLineTotal } from "~/lib/cartItem";

const STORAGE_KEY = "eliteforge-cart";

export type CartItemType = "product" | "stack_blend";

export type CartItem = {
  itemType: CartItemType;
  id: number;
  variantId?: number;
  name: string;
  description: string;
  sizeLabel?: string;
  price: string;
  image_url: string | null;
  quantity: number;
};

type CartLineRef = Pick<CartItem, "itemType" | "id" | "variantId">;

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant) => void;
  addStackBlendItem: (stackBlend: StackBlend, quantity: number) => void;
  removeItem: (item: CartLineRef) => void;
  updateQuantity: (item: CartLineRef, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => {
        if (item.itemType === "stack_blend") {
          return (
            typeof item.id === "number" &&
            typeof item.name === "string" &&
            typeof item.price === "string" &&
            typeof item.quantity === "number" &&
            item.quantity > 0
          );
        }
        return (
          item.itemType === "product" &&
          typeof item.id === "number" &&
          typeof item.variantId === "number" &&
          typeof item.name === "string" &&
          typeof item.price === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
        );
      })
      .map((item) => ({
        ...item,
        itemType: item.itemType ?? "product",
        description:
          typeof item.description === "string" ? item.description : "",
        sizeLabel:
          typeof item.sizeLabel === "string" ? item.sizeLabel : undefined,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(parseStoredCart(localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback((product: Product, variant: ProductVariant) => {
    setItems((current) => {
      const key = cartItemKey({
        itemType: "product",
        id: product.id,
        variantId: variant.id,
      });
      const existing = current.find((item) => cartItemKey(item) === key);
      if (existing) {
        return current.map((item) =>
          cartItemKey(item) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          itemType: "product",
          id: product.id,
          variantId: variant.id,
          name: product.name,
          description: product.description,
          sizeLabel: variant.size_label,
          price: variant.price,
          image_url: product.image_url,
          quantity: 1,
        },
      ];
    });
  }, []);

  const addStackBlendItem = useCallback(
    (stackBlend: StackBlend, quantity: number) => {
      const qty = Math.max(1, quantity);
      setItems((current) => {
        const key = cartItemKey({ itemType: "stack_blend", id: stackBlend.id });
        const existing = current.find((item) => cartItemKey(item) === key);
        if (existing) {
          return current.map((item) =>
            cartItemKey(item) === key ? { ...item, quantity: qty } : item,
          );
        }
        return [
          ...current,
          {
            itemType: "stack_blend",
            id: stackBlend.id,
            name: stackBlend.name,
            description: stackBlend.description,
            price: stackBlend.price,
            image_url: stackBlend.image_url,
            quantity: qty,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((item: CartLineRef) => {
    const key = cartItemKey(item);
    setItems((current) => current.filter((line) => cartItemKey(line) !== key));
  }, []);

  const updateQuantity = useCallback((item: CartLineRef, quantity: number) => {
    const key = cartItemKey(item);
    if (quantity < 1) {
      setItems((current) =>
        current.filter((line) => cartItemKey(line) !== key),
      );
      return;
    }
    setItems((current) =>
      current.map((line) =>
        cartItemKey(line) === key ? { ...line, quantity } : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + cartLineTotal(item), 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addItem,
      addStackBlendItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      hydrated,
      itemCount,
      subtotal,
      isOpen,
      addItem,
      addStackBlendItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
