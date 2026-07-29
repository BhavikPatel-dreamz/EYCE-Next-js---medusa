"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

gsap.registerPlugin(ScrollTrigger);

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", once: true },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20">
      <div className="container-x">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-8 py-14 md:px-16 md:py-20 opacity-0"
        >
          {/* Background decorations */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-violet/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative mx-auto max-w-xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-violet/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary mb-6 border border-primary/20">
              <Mail className="size-3.5" /> Newsletter
            </div>

            <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl gradient-text">
              Drop-proof deals. In your inbox.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Be first to know about new drops, limited colorways, and subscriber-only discounts. No spam, ever.
            </p>

            {ok ? (
              <div className="mt-8 flex items-center justify-center gap-3 text-sm font-medium text-foreground">
                <CheckCircle2 className="size-5 text-primary" />
                You&apos;re in — check your inbox for a welcome gift.
              </div>
            ) : (
              <form
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOk(true);
                  setEmail("");
                }}
              >
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 bg-background border-border/80 focus:border-primary rounded-xl"
                />
                <Button type="submit" size="lg" className="gradient-btn h-12 gap-2 rounded-xl font-semibold shrink-0 shadow-lg">
                  Subscribe
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-muted-foreground font-mono">
              Join 14,000+ subscribers · Unsubscribe any time · No spam
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
