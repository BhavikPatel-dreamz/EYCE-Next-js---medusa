import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";

export async function FeaturedGrid() {
  const { products: items } = await getProducts({ limit: 8 });
  return (
    <section className="container-x py-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
            Bestsellers
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            This week&apos;s essentials.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          Shop all <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {/* Mobile view all */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View all products <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
