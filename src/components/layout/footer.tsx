import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      ["All Products", "/shop"],
      ["Bongs", "/shop?category=bongs"],
      ["Dab Rigs", "/shop?category=dab-rigs"],
      ["Hand Pipes", "/shop?category=hand-pipes"],
      ["Accessories", "/shop?category=accessories"],
      ["Limited Drops", "/shop?featured=true"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Shipping Info", "/about"],
      ["Returns & Exchanges", "/about"],
      ["Warranty Policy", "/about"],
      ["FAQ", "/about"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About EYCE", "/about"],
      ["Our Story", "/about"],
      ["Wholesale", "/about"],
      ["Press", "/about"],
      ["Careers", "/about"],
    ],
  },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

const paymentMethods = ["Visa", "MC", "Amex", "PayPal", "Apple Pay"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/images/logo.svg"
              alt="EYCE"
              width={168}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Silicone-first smoking gear. Engineered in the USA to survive whatever happens next — freezes, drops, and dishwashers included.
          </p>

          {/* Socials */}
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>

          {/* Trust note */}
          <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-muted-foreground border border-border/60 rounded-lg px-3 py-2 w-fit">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            US-Based · Family-Owned · Est. 2013
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted-foreground font-mono md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span>© {new Date().getFullYear()} Eyce Molds. All rights reserved.</span>
            <Link href="/about" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/60">21+ only · For legal use only</span>
            {/* Payment icons */}
            <div className="flex items-center gap-1.5">
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
