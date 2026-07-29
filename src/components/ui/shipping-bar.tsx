"use client";

import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export function ShippingBar({
  subtotal,
  freeThreshold = 60,
  currency = "EUR",
  className,
}: {
  subtotal: number;
  freeThreshold?: number;
  currency?: string;
  className?: string;
}) {
  const remaining = freeThreshold - subtotal;
  const percentage = Math.min(100, (subtotal / freeThreshold) * 100);
  const isFree = subtotal >= freeThreshold;

  return (
    <div className={cn("rounded-xl border border-border/60 bg-surface/50 p-4", className)}>
      <div className="flex items-center gap-2 text-sm mb-2">
        <Truck className={cn("size-4", isFree ? "text-success" : "text-primary")} />
        <span className="font-medium text-xs">
          {isFree
            ? "You qualify for free shipping!"
            : `Add ${formatPrice(remaining, currency)} more for free shipping`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isFree ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
