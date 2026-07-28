"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Shield, HeartHandshake, PackageCheck, Headphones } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Shield,
    title: "Lifetime Warranty Guarantee",
    desc: "If your silicone breaks or chips under normal use, we replace it 100% free.",
  },
  {
    icon: PackageCheck,
    title: "Discreet & Express Shipping",
    desc: "Plain unbranded packaging delivered to your doorstep within 2-4 business days.",
  },
  {
    icon: HeartHandshake,
    title: "30-Day Money Back",
    desc: "Not 100% satisfied? Return unused gear within 30 days for a full refund.",
  },
  {
    icon: Headphones,
    title: "US-Based Support Team",
    desc: "Real human customer support available Mon-Fri to help with orders & questions.",
  },
];

export function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".badge-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 88%", once: true },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-border/40 py-16">
      <div className="container-x">
        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="badge-card flex gap-4 items-start p-4 rounded-xl hover:bg-surface/50 transition-colors opacity-0"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-foreground">{b.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
