"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "How old do I need to be to purchase?", a: "You must be 21 years or older to purchase any products from our store. We use age verification at checkout and may request ID verification." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days within the US. Express shipping (1-3 business days) is available at checkout. Free shipping on orders over $60." },
  { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact our support team for a full refund or exchange." },
  { q: "Are your products authentic?", a: "Absolutely. We source directly from manufacturers and authorized distributors. Every product is 100% authentic with full warranty coverage." },
  { q: "Do you ship discreetly?", a: "Yes. All orders ship in plain, unmarked packaging with no branding or product descriptions on the outside." },
  { q: "Can I track my order?", a: "Yes! Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20">
      <div className="container-x max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">FAQ</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Got <span className="gradient-text">questions?</span></h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border overflow-hidden transition-all duration-200 card-hover",
                openIndex === i && "border-primary/30 bg-gradient-to-br from-primary/[0.02] to-violet/[0.02]",
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className={cn("font-medium text-sm transition-colors", openIndex === i && "text-primary")}>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    openIndex === i ? "rotate-180 text-primary" : "text-muted-foreground",
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
