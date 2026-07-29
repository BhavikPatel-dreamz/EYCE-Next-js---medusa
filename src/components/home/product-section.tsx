import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

export function ProductSection({
  title,
  tag,
  products,
  viewAllHref = "/shop",
}: {
  title: string;
  tag?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            {tag && (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">{tag}</p>
            )}
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
