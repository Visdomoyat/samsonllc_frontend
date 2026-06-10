import type { CartItem } from "~/context/CartContext";
import { calculateStackBlendTotal } from "~/lib/stackBlendPricing";

export function cartItemKey(item: Pick<CartItem, "itemType" | "id">): string {
  return `${item.itemType}:${item.id}`;
}

export function cartLineTotal(item: CartItem): number {
  if (item.itemType === "stack_blend") {
    return calculateStackBlendTotal(item.price, item.quantity);
  }
  const unit = Number.parseFloat(item.price);
  return Number.isFinite(unit) ? unit * item.quantity : 0;
}
