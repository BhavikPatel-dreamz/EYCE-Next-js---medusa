"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

const promos = [
  "Free US shipping on orders over $60",
  "Lifetime warranty on all silicone gear",
  "Same-day dispatch before 2pm EST",
];

export function AnnouncementBar() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] font-semibold tracking-wide"
            >
              {promos[active]}
            </motion.span>
          </AnimatePresence>
          <span className="flex gap-1 ml-3">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`size-1.5 rounded-full transition-colors ${
                  i === active ? "bg-primary-foreground" : "bg-primary-foreground/40"
                }`}
                aria-label={`Promo ${i + 1}`}
              />
            ))}
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-primary-foreground/10 transition-colors"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
