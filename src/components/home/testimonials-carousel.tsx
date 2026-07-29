"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/80?img=1",
    rating: 5,
    text: "Best vape shop I've ever used. The shipping was incredibly fast and the product quality is outstanding. My go-to for all my vaping needs.",
  },
  {
    name: "James K.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/80?img=3",
    rating: 5,
    text: "Incredible selection and even better customer service. They helped me find the perfect pod system and I couldn't be happier with my purchase.",
  },
  {
    name: "Emily R.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    text: "The flavors are amazing and the prices can't be beat. I've recommended this shop to all my friends. 10/10 experience every time.",
  },
  {
    name: "Mike T.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/80?img=8",
    rating: 4,
    text: "Great product selection and fast delivery. The discreet shipping is a nice touch. Would appreciate more flavor options in the future.",
  },
  {
    name: "Lisa P.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/80?img=9",
    rating: 5,
    text: "Been shopping here for over a year now. Consistent quality, fair prices, and they always throw in a little extra. Can't recommend enough.",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = (i: number) => setCurrent(i);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const id = window.setInterval(next, 5000);
    return () => window.clearInterval(id);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet/5 via-primary/5 to-surface/50" />
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-violet/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-x max-w-4xl relative">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Testimonials</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">What our <span className="gradient-text">customers</span> say</h2>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-4">
              <div className="relative size-16 overflow-hidden rounded-full border-2 border-primary/20 ring-2 ring-primary/10">
                <Image src={t.avatar} alt={t.name} fill sizes="64px" className="object-cover" />
              </div>
            </div>
            <div className="flex justify-center gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("size-4", i < t.rating ? "fill-amber-400 text-amber-400" : "text-border")}
                />
              ))}
            </div>
            <blockquote className="text-lg leading-relaxed text-foreground/80 font-medium">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current ? "w-6 bg-primary glow-primary" : "w-2 bg-border hover:bg-muted-foreground",
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
