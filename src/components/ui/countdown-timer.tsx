"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownTimer({
  target,
  className,
  showLabels = true,
  size = "sm",
}: {
  target: Date;
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "lg";
}) {
  const calc = useCallback(() => calcTimeLeft(target), [target]);
  const [timeLeft, setTimeLeft] = useState(calc);

  useEffect(() => {
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  if (timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds === 0) {
    return <span className={cn("text-muted-foreground", className)}>Offer ended</span>;
  }

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  const numSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className={cn("font-display font-bold tabular-nums leading-none", numSize)}>
              {String(item.value).padStart(2, "0")}
            </span>
            {showLabels && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                {item.label}
              </span>
            )}
          </div>
          {i < items.length - 1 && (
            <span className={cn("font-display font-bold text-muted-foreground -mt-3", numSize)}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
