import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "The story, craft and philosophy behind EYCE.",
};

export default function AboutPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Our story</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Craft, not <span className="text-primary">commodity.</span>
        </h1>
        <p className="mt-6 text-muted-foreground">
          EYCE started in a garage in 2013 with a stubborn idea: that a piece you love
          shouldn&apos;t be a piece you baby. We pioneered silicone-first smoking gear and
          haven&apos;t looked back. Every piece is engineered to survive whatever happens next.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {[
          { n: "01", t: "Materials", c: "Platinum-cured silicone. Medical-grade, food-safe, and virtually indestructible. No plastic in the vapor path." },
          { n: "02", t: "Craft", c: "Every piece is designed and tested by hand. We engineer for durability, flavor, and the kind of quality you can feel." },
          { n: "03", t: "Responsibility", c: "We ship in recyclable packaging, offer lifetime repair, and never sell to those under 21." },
        ].map((s) => (
          <div key={s.n} className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="font-display text-3xl text-primary">{s.n}</div>
            <div className="mt-2 font-display text-xl font-bold">{s.t}</div>
            <p className="mt-3 text-sm text-muted-foreground">{s.c}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid overflow-hidden rounded-2xl border border-border lg:grid-cols-2">
        <div className="relative min-h-[240px] md:min-h-[380px]">
          <Image
            src="https://images.unsplash.com/photo-1567721913486-6585f069b332?w=1400&q=80&auto=format&fit=crop"
            alt="Our workshop"
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 bg-card p-6 md:p-10 lg:p-14">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">The workshop</div>
          <h2 className="font-display text-3xl leading-tight font-bold md:text-4xl">
            Built in a garage. Refined by obsession.
          </h2>
          <p className="text-muted-foreground">
            Our workshop is where it all started. Come by appointment &mdash; we
            love showing people how the sausage is made.
          </p>
        </div>
      </div>
    </div>
  );
}
