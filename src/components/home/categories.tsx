import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/api";

export async function Categories() {
  const cats = await getCategories();
  return (
    <section className="container-x py-20">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">01 &middot; Categories</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Pick your shape.</h2>
        </div>
        <Link href="/shop" className="hidden text-sm font-medium hover:text-primary md:inline-flex">
          View all <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-surface rounded-md"
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute left-4 top-4 font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</div>
            <div className="absolute bottom-5 left-5 right-5">
              <div className="font-display text-2xl font-semibold">{c.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
