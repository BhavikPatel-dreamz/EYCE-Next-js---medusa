import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";

export async function FeaturedGrid() {
  const { products: items } = await getProducts({ limit: 8 });
  return (
    <section className="container-x py-20">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">02 &middot; Bestsellers</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">This week&apos;s essentials.</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
