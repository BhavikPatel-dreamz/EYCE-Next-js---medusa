import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedGrid } from "@/components/home/featured-grid";

import { EditorialSplit } from "@/components/home/editorial-split";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { TechShowcase } from "@/components/home/tech-showcase";
import { TrustBadges } from "@/components/home/trust-badges";
import { InstagramCommunity } from "@/components/home/instagram-community";
import { getProducts, getCategories } from "@/lib/api";

export default async function HomePage() {
  const [{ products: list }, categories] = await Promise.all([
    getProducts({ limit: 1 }),
    getCategories(),
  ]);
  const heroProduct = list[0] ?? null;

  return (
    <>
      <Hero product={heroProduct} />
      <TrustBadges />
      <Categories categories={categories} />
      <TechShowcase />
      <FeaturedGrid />
      <EditorialSplit />
      <Testimonials />
      <InstagramCommunity />
      <Newsletter />
    </>
  );
}

