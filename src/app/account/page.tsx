"use client";

import Link from "next/link";
import { ChevronRight, User, Package, Heart, Settings, LogOut, MapPin, CreditCard } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const menuItems = [
  { icon: Package, label: "Orders", desc: "View and track your orders" },
  { icon: Heart, label: "Wishlist", desc: "Your saved items" },
  { icon: MapPin, label: "Addresses", desc: "Manage shipping addresses" },
  { icon: CreditCard, label: "Payment methods", desc: "Manage saved cards" },
  { icon: Settings, label: "Settings", desc: "Preferences and notifications" },
];

export default function AccountPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-background">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Account</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-cyan/10 via-violet/10 to-rose/10 blur-3xl" />
        <div ref={headerRef} className="container-x relative py-12 md:py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet p-0.5">
              <div className="flex size-full items-center justify-center rounded-full bg-surface">
                <User className="size-7 text-foreground" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">John Doe</h1>
              <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              Member since 2025
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container-x py-8">
        <div className="mx-auto max-w-lg space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="group flex w-full items-center gap-4 rounded-xl bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}

          <button className="group flex w-full items-center gap-4 rounded-xl bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose/10 text-rose group-hover:bg-rose group-hover:text-white transition-colors">
              <LogOut className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Sign out</div>
              <div className="text-xs text-muted-foreground">Log out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
