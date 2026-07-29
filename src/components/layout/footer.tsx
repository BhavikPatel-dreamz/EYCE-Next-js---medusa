import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      ["All Products", "/shop"],
      ["Disposable Vapes", "/shop?category=disposable"],
      ["Pod Systems", "/shop?category=pods"],
      ["E-Liquids", "/shop?category=e-liquid"],
      ["Starter Kits", "/shop?category=kits"],
      ["Accessories", "/shop?category=accessories"],
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
      ["Track Order", "/about"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Our Story", "/about"],
      ["Age Verification", "/about"],
      ["Privacy Policy", "/about"],
      ["Terms of Service", "/about"],
      ["Wholesale", "/about"],
    ],
  },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

const paymentMethods = ["Visa", "MC", "Amex", "PayPal", "Apple Pay", "Klarna"];

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 size-80 rounded-full bg-violet/5 blur-3xl" />

      <div className="container-x relative py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
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
            Your premium destination for disposable vapes, pod systems, e-liquids, and accessories. 100% authentic products with fast, discreet shipping.
          </p>

          {/* Contact info */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span>Austin, TX · USA</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3.5 shrink-0 text-violet" />
              <span>support@eycevape.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="size-3.5 shrink-0 text-amber" />
              <span>1-800-EYCE-VAPE</span>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:scale-110 hover:border-primary hover:text-primary hover:bg-primary/5"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-muted-foreground border border-border/60 rounded-lg px-3 py-2 w-fit bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            US-Based · 21+ Only · Age Verified
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border/60 bg-gradient-to-r from-primary/[0.02] via-violet/[0.02] to-primary/[0.02]">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted-foreground font-mono md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span>© {new Date().getFullYear()} EYCE Vape Co. All rights reserved.</span>
            <Link href="/about" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/60">21+ only · For legal use only</span>
            <div className="flex items-center gap-1.5">
              {paymentMethods.map((m) => (
                <span key={m} className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
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
