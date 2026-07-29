"use client";

import { useGsapReveal } from "@/hooks/use-gsap";

const brands = [
  { name: "Geek Bar", logo: "https://www.google.com/s2/favicons?domain=geekbar.com&sz=64" },
  { name: "Elf Bar", logo: "https://www.google.com/s2/favicons?domain=elfbar.com&sz=64" },
  { name: "SMOK", logo: "https://res.smoktech.com/www/files/v2/w/images_web/small_icon/y6vcxbx1_logo-black@2x.png" },
  { name: "Vaporesso", logo: "https://www.google.com/s2/favicons?domain=vaporesso.com&sz=64" },
  { name: "Uwell", logo: "https://logo.clearbit.com/myuwell.com" },
  { name: "Lost Vape", logo: "https://lostvape.com/wp-content/uploads/2025/12/logo.png" },
  { name: "Geek Bar", logo: "https://www.google.com/s2/favicons?domain=geekbar.com&sz=64" },
  { name: "Elf Bar", logo: "https://www.google.com/s2/favicons?domain=elfbar.com&sz=64" },
];

export function BrandShowcase() {
  const ref = useGsapReveal({ y: 20 });

  return (
    <section className="relative border-y border-border/60 bg-gradient-to-r from-primary/[0.02] via-violet/[0.02] to-primary/[0.02] overflow-hidden">
      <div ref={ref} className="container-x py-10 opacity-0">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-6">
          Trusted brands
        </p>
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee gap-12 items-center">
            {brands.map((b, i) => (
              <div key={`${b.name}-${i}`} className="flex items-center gap-3 shrink-0 hover:scale-105 transition-transform">
                <div className="h-12 w-24 overflow-hidden rounded-xl bg-surface/80 ring-1 ring-primary/10 flex items-center justify-center px-3">
                  <img src={b.logo} alt={b.name} className="max-h-8 w-auto object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
