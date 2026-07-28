import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedGrid } from "@/components/home/featured-grid";

import { EditorialSplit } from "@/components/home/editorial-split";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { TechShowcase } from "@/components/home/tech-showcase";
import { TrustBadges } from "@/components/home/trust-badges";
import { InstagramCommunity } from "@/components/home/instagram-community";
import { BlogSection } from "@/components/home/blog-section";
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

      <div className="bg-gradient-to-b from-emerald-100 to-emerald-50/0">
        <TrustBadges />
      </div>

      <div className="bg-gradient-to-b from-sky-100 to-sky-50/0">
        <Categories categories={categories} />
      </div>

      <div className="bg-gradient-to-b from-violet-100 via-indigo-100 to-violet-50/0">
        <TechShowcase />
      </div>

      <div className="bg-gradient-to-b from-amber-100 to-amber-50/0">
        <FeaturedGrid />
      </div>

      <div className="bg-gradient-to-b from-rose-100 via-pink-100 to-rose-50/0">
        <EditorialSplit />
      </div>

      <div className="bg-gradient-to-b from-teal-100 to-teal-50/0">
        <BlogSection />
      </div>

      <div className="bg-gradient-to-b from-orange-100 to-orange-50/0">
        <Testimonials />
      </div>

      <div className="bg-gradient-to-b from-fuchsia-100 via-purple-100 to-fuchsia-50/0">
        <InstagramCommunity />
      </div>

      <div className="bg-gradient-to-b from-lime-100 to-emerald-100">
        <Newsletter />
      </div>
    </>
  );
}
