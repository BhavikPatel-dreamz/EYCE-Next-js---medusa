"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section className="container-x py-24">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 text-center md:p-10 lg:p-14">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">EYCE<span className="text-primary">.</span></h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Silicone-first smoking gear. Engineered to survive whatever happens next.
        </p>
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); setOk(true); setEmail(""); }}
        >
          <Input
            type="email"
            required
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
          <Button type="submit" size="lg">Subscribe</Button>
        </form>
        {ok && <div className="mt-3 text-xs text-success">Thanks &mdash; check your inbox.</div>}
      </div>
    </section>
  );
}
