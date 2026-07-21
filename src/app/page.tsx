import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { ValueProps } from "@/components/home/value-props";
import { EditorialSplit } from "@/components/home/editorial-split";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const { products: list } = await getProducts({ limit: 1 });
  const heroProduct = list[0] ?? null;

  return (
    <>
      <Hero product={heroProduct} />
      <ValueProps />
      <Categories />
      <FeaturedGrid />
      <EditorialSplit />
      <Testimonials />
      <Newsletter />
    </>
  );
}
