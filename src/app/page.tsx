import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { Categories } from "@/components/home/categories";
import { ProductSection } from "@/components/home/product-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { FlashSale } from "@/components/home/flash-sale";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { FAQSection } from "@/components/home/faq-section";
import { Newsletter } from "@/components/home/newsletter";
import { getProducts, getCategories } from "@/lib/api";

export default async function HomePage() {
  const [
    { products: heroProducts },
    { products: featured },
    { products: bestSellers },
    { products: newArrivals },
    { products: trending },
    { products: saleProducts },
    categories,
  ] = await Promise.all([
    getProducts({ limit: 8 }),
    getProducts({ limit: 8, sort: "newest" }),
    getProducts({ limit: 8, sort: "rating" }),
    getProducts({ limit: 8, sort: "newest" }),
    getProducts({ limit: 8 }),
    getProducts({ limit: 8, sort: "rating" }),
    getCategories(),
  ]);

  // Simulate curated sections from the same product pool
  const bestSellersData = bestSellers;
  const newArrivalsData = newArrivals;
  const trendingData = trending;
  const flashSaleData = saleProducts.filter((p) => p.compareAtPrice != null);

  return (
    <>
      <HeroSlider products={heroProducts} />

      <div className="section-gradient-1 relative">
        <div className="pointer-events-none absolute -left-32 top-1/2 size-80 rounded-full bg-primary/10 blur-3xl" />
        <Categories categories={categories} />
      </div>

      <div className="section-gradient-2 relative">
        <div className="pointer-events-none absolute -right-32 top-1/2 size-80 rounded-full bg-violet/10 blur-3xl" />
        <ProductSection
          title="Featured Products"
          tag="New arrivals"
          products={featured}
        />
      </div>

      <div className="section-gradient-3 relative">
        <div className="pointer-events-none absolute -left-28 -top-20 size-72 rounded-full bg-rose/10 blur-3xl" />
        <ProductSection
          title="Best Sellers"
          tag="Top rated"
          products={bestSellersData}
        />
      </div>

      <FlashSale products={flashSaleData.length > 0 ? flashSaleData : featured} />

      <div className="section-gradient-4 relative">
        <div className="pointer-events-none absolute -right-28 -bottom-20 size-72 rounded-full bg-amber/10 blur-3xl" />
        <ProductSection
          title="New Arrivals"
          tag="Fresh drops"
          products={newArrivalsData}
        />
      </div>

      <div className="section-gradient-5 relative">
        <div className="pointer-events-none absolute -left-32 top-1/2 size-80 rounded-full bg-teal/10 blur-3xl" />
        <ProductSection
          title="Trending Now"
          tag="Popular picks"
          products={trendingData}
        />
      </div>

      <ValuePropsSection />

      <TestimonialsCarousel />

      <div className="section-gradient-1 relative">
        <div className="pointer-events-none absolute -right-28 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
        <FAQSection />
      </div>

      <Newsletter />
    </>
  );
}
