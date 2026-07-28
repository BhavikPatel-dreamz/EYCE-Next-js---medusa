"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const bullets = [
  "100% platinum-cured food-safe silicone",
  "Freeze solid, dishwasher clean, drop freely",
  "Modular — swap bowls, stems, and colors",
  "Backed by a lifetime replacement guarantee",
];

export function EditorialSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        },
      );

      gsap.fromTo(
        textRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        },
      );

      const bullets = textRef.current?.querySelectorAll(".editorial-bullet");
      if (bullets?.length) {
        gsap.fromTo(
          bullets,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          },
        );
      }

      const ctaButtons = textRef.current?.querySelectorAll(".editorial-cta");
      if (ctaButtons?.length) {
        gsap.fromTo(
          ctaButtons,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 border-y border-border/60">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">

          {/* Images */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=900&auto=format&fit=crop&q=85"
                alt="EYCE silicone durability"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm px-4 py-3">
                <p className="font-display text-2xl font-black text-white">13+</p>
                <p className="text-[11px] font-mono text-white/50 mt-0.5 uppercase tracking-wider">Years in business</p>
              </div>
            </div>

            <div className="absolute -right-4 top-10 hidden lg:block">
              <div className="relative h-44 w-36 overflow-hidden rounded-xl border-[3px] border-background shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop&q=85"
                  alt="EYCE outdoor lifestyle"
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="opacity-0">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
              Our Manifesto
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Glass breaks.{" "}
              <span className="text-muted-foreground">Silicone doesn&apos;t.</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              We started with one mold in a garage and a single conviction — that the piece you love shouldn&apos;t be one you baby. Thirteen years later that conviction is still the reason we build the way we do.
            </p>

            <ul className="mt-7 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="editorial-bullet flex items-start gap-3 text-sm opacity-0">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="editorial-cta inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors opacity-0"
              >
                Our story <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/shop"
                className="editorial-cta inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors opacity-0"
              >
                Browse gear
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
