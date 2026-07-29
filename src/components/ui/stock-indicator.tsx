"use client";

import { cn } from "@/lib/utils";

export function StockIndicator({
  quantity,
  lowThreshold = 10,
  className,
}: {
  quantity: number;
  lowThreshold?: number;
  className?: string;
}) {
  if (quantity === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-destructive", className)}>
        <span className="size-1.5 rounded-full bg-destructive" />
        Out of stock
      </span>
    );
  }

  if (quantity <= lowThreshold) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-warning animate-pulse-soft", className)}>
        <span className="size-1.5 rounded-full bg-warning" />
        Only {quantity} left in stock
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-success", className)}>
      <span className="size-1.5 rounded-full bg-success" />
      In stock
    </span>
  );
}
