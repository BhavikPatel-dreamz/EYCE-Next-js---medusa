import Link from "next/link";
import { getProducts } from "@/lib/api";

export async function EditorialSplit() {
  const { products: list } = await getProducts({ limit: 1 });
  const product = list[0] ?? null;

  return (
    <section className="container-x py-24">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Manifesto</div>
        </div>
        <div className="md:col-span-8">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] md:text-5xl">
            Glass breaks. <span className="text-muted-foreground">Silicone doesn&apos;t.</span> We started with one mold in a garage and a promise &mdash; that a piece you love shouldn&apos;t be a piece you baby.
          </h2>
        </div>
      </div>
    </section>
  );
}
