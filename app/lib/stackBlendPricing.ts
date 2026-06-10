export function calculateStackBlendTotal(
  unitPrice: string | number,
  quantity: number,
): number {
  const price = Number.parseFloat(String(unitPrice));
  if (!Number.isFinite(price) || quantity <= 0) return 0;

  if (quantity === 1) return price;
  if (quantity === 2) return price * 2 * 0.95;
  if (quantity === 3) return price * 3 * 0.9;
  return price * 3 * 0.9 + price * (quantity - 3);
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
