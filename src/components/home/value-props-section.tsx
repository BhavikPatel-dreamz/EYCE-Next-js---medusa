"use client";

import { Truck, ShieldCheck, CreditCard, Sparkles, RotateCcw, Headphones } from "lucide-react";
import { useGsapStagger } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

const props = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $60", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "256-bit SSL encrypted", color: "from-blue-500/20 to-blue-500/5 border-blue-500/20" },
  { icon: Sparkles, title: "Premium Quality", desc: "100% authentic products", color: "from-purple-500/20 to-purple-500/5 border-purple-500/20" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day money-back guarantee", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20" },
  { icon: Headphones, title: "24/7 Support", desc: "Live chat & email support", color: "from-rose-500/20 to-rose-500/5 border-rose-500/20" },
  { icon: CreditCard, title: "Buy Now Pay Later", desc: "Klarna, Afterpay & more", color: "from-teal-500/20 to-teal-500/5 border-teal-500/20" },
];

export function ValuePropsSection() {
  const ref = useGsapStagger(".value-card", { y: 20, stagger: 0.08 });

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-1/2 size-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-20 size-72 rounded-full bg-violet/8 blur-3xl" />
      <div className="container-x relative">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Why shop with us</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The <span className="gradient-text">EYCE</span> difference</h2>
        </div>
        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {props.map((p) => (
            <div
              key={p.title}
              className={cn(
                "value-card opacity-0 flex items-start gap-4 rounded-xl border p-5 bg-gradient-to-br transition-all duration-300 card-hover",
                p.color,
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                <p.icon className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">{p.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
