"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const perks = [
  { icon: Shield, label: "Lifetime warranty" },
  { icon: Truck, label: "Free shipping 60+" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Headphones, label: "US support" },
];

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = ref.current?.querySelectorAll(".trust-item");
      if (items?.length) {
        gsap.fromTo(
          items,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
          },
        );
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border-y border-border/60 bg-surface/30">
      <div className="container-x py-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="trust-item flex items-center justify-center gap-2.5 py-1 opacity-0">
                <Icon className="size-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
