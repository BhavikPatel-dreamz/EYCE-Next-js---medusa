"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap, Truck, Shield } from "lucide-react";

const promos = [
  { text: "Free shipping on orders over $60", icon: Truck },
  { text: "100% authentic products — guaranteed", icon: Shield },
  { text: "21+ age verification required at checkout", icon: Zap },
  { text: "New flavors dropping weekly — stay tuned", icon: Zap },
];

export function AnnouncementBar() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const Icon = promos[active].icon;

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
              className="flex items-center gap-2 text-[11px] font-semibold tracking-wide"
            >
              <Icon className="size-3 shrink-0" />
              {promos[active].text}
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
