import { Link } from "react-router";

import type { StackBlend } from "~/lib/api";
import { formatUsd } from "~/lib/stackBlendPricing";

type StackBlendTileProps = {
  item: StackBlend;
  /** Alternate diagonal tilt for visual variety */
  tilt?: "left" | "right";
};

export default function StackBlendTile({
  item,
  tilt = "right",
}: StackBlendTileProps) {
  const rotation = tilt === "left" ? "-14deg" : "12deg";
  const tileGradient =
    item.kind === "stack"
      ? "from-accent-purple/20 via-accent/15 to-accent-teal/20"
      : "from-accent-teal/20 via-accent-emerald/15 to-accent/20";

  return (
    <article className="group flex h-full flex-col">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${tileGradient} p-6 shadow-md ring-1 ring-brand/10 transition group-hover:shadow-xl`}
      >
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand shadow-sm">
          {item.kind_label}
        </span>

        <div className="absolute inset-0 flex items-center justify-center p-8">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="max-h-full max-w-full object-contain drop-shadow-2xl transition duration-300 group-hover:scale-105"
              style={{ transform: `rotate(${rotation})` }}
            />
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-xl bg-white/60 text-sm text-brand/50"
              style={{ transform: `rotate(${rotation})` }}
            >
              No image
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/30 blur-2xl"
          aria-hidden
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <h3 className="text-lg font-bold text-brand">{item.name}</h3>
        <p className="mt-1 text-sm font-semibold text-accent">
          From {formatUsd(Number.parseFloat(item.price))}
        </p>
        <Link
          to={`/stacks-blends/${item.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-muted"
        >
          Shop now
        </Link>
      </div>
    </article>
  );
}
