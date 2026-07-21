import Link from "next/link";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold">
            EYCE<span className="text-primary">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Silicone-first smoking gear. Engineered to survive whatever happens next.
          </p>
        </div>
        {[
          { title: "Shop", links: [["All products", "/shop"], ["Bongs", "/shop?category=bongs"], ["Dab Rigs", "/shop?category=dab-rigs"], ["Hand Pipes", "/shop?category=hand-pipes"], ["Accessories", "/shop?category=accessories"]] },
          { title: "Support", links: [["Shipping", "/about"], ["Returns", "/about"], ["Warranty", "/about"], ["Contact", "/contact"]] },
          { title: "Company", links: [["About", "/about"], ["Wholesale", "/about"], ["Press", "/about"]] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-muted-foreground transition-colors hover:text-primary">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-muted-foreground font-mono md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Eyce Molds &mdash; All rights reserved.</span>
          <span>21+ only. Intended for legal use.</span>
        </div>
      </div>
    </footer>
  );
}
