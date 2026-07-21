"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function PriceRangeSlider({
  min = 0,
  max = 500,
  initialMin,
  initialMax,
}: {
  min?: number;
  max?: number;
  initialMin?: number;
  initialMax?: number;
}) {
  const [lo, setLo] = useState(initialMin ?? min);
  const [hi, setHi] = useState(initialMax ?? max);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"lo" | "hi" | null>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const resolve = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const raw = ((clientX - rect.left) / rect.width) * (max - min) + min;
      return Math.round(Math.min(max, Math.max(min, raw)));
    },
    [min, max],
  );

  const commit = useCallback(() => {
    const form = trackRef.current?.closest("form");
    if (form) form.requestSubmit();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const v = resolve(e.clientX);
      if (v == null) return;
      if (dragging.current === "lo") setLo(Math.min(v, hi - 1));
      else if (dragging.current === "hi") setHi(Math.max(v, lo + 1));
    };
    const onUp = () => {
      if (dragging.current) commit();
      dragging.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [hi, lo, resolve, commit]);

  const onTouch = useCallback(
    (thumb: "lo" | "hi") => (e: React.TouchEvent) => {
      e.preventDefault();
      dragging.current = thumb;
      const v = resolve(e.touches[0].clientX);
      if (v == null) return;
      if (thumb === "lo") setLo(Math.min(v, hi - 1));
      else setHi(Math.max(v, lo + 1));
    },
    [hi, lo, resolve],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>${lo}</span>
        <span>${hi}</span>
      </div>

      <div ref={trackRef} className="relative h-5 select-none touch-none">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />

        <input type="hidden" name="minPrice" value={lo > min ? lo : ""} />
        <input type="hidden" name="maxPrice" value={hi < max ? hi : ""} />

        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-primary bg-background shadow-sm active:cursor-grabbing"
          style={{ left: `${pct(lo)}%` }}
          onMouseDown={() => (dragging.current = "lo")}
          onTouchStart={onTouch("lo")}
        />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-primary bg-background shadow-sm active:cursor-grabbing"
          style={{ left: `${pct(hi)}%` }}
          onMouseDown={() => (dragging.current = "hi")}
          onTouchStart={onTouch("hi")}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
}
