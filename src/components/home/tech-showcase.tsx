"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Snowflake, Wrench, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Snowflake,
    title: "Platinum-Cured Silicone",
    description: "Food-safe, medical-grade silicone that handles freezing temperatures, drops from height, and daily dishwasher cycles without degrading.",
    stat: "100%",
    label: "Platinum cured",
  },
  {
    icon: Wrench,
    title: "Modular Design",
    description: "Swap out bowls, downstems, and accessories. Every component is interchangeable so you customize your setup and replace only what you need.",
    stat: "3-in-1",
    label: "Configurable",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    description: "We stand behind every piece. If it breaks under normal use we replace it — no receipts, no questions, no expiry date.",
    stat: "∞",
    label: "Guarantee",
  },
  {
    icon: Award,
    title: "Dishwasher Safe",
    description: "Silicone doesn't harbor bacteria and doesn't absorb odors. Toss it in the top rack. It comes out clean every time.",
    stat: "4.9",
    label: "Average rating",
  },
];

export function TechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 88%", once: true },
        },
      );

      const cards = cardsRef.current?.querySelectorAll(".tech-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container-x">
        <div ref={headerRef} className="mb-12 max-w-xl opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
            Why silicone
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Built different by design.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Every engineering decision we&apos;ve made comes back to one promise — gear that keeps up with your life, not the other way around.
          </p>
        </div>

        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="tech-card rounded-xl border border-border bg-card p-6 opacity-0"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-5 border-t border-border/60 pt-4 flex items-baseline justify-between">
                  <span className="font-display text-xl font-black text-primary">{item.stat}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
