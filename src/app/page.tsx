import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { Categories } from "@/components/home/categories";
import { ProductSection } from "@/components/home/product-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { FlashSale } from "@/components/home/flash-sale";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { FAQSection } from "@/components/home/faq-section";
import { Newsletter } from "@/components/home/newsletter";
import { VideoBanner } from "@/components/home/video-banner";
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

      <VideoBanner video="https://www.eyce.com/cdn/shop/videos/c/vp/7f898fd263de48febbe8c25d20ec8a55/7f898fd263de48febbe8c25d20ec8a55.HD-1080p-4.8Mbps-18134283.mp4" />

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

      <VideoBanner video="https://www.eyce.com/cdn/shop/videos/c/vp/5aff0abdf5b942caaa2c1a71aa16f915/5aff0abdf5b942caaa2c1a71aa16f915.HD-1080p-4.8Mbps-87994428.mp4" />

      <div className="section-gradient-5 relative">
        <div className="pointer-events-none absolute -left-32 top-1/2 size-80 rounded-full bg-teal/10 blur-3xl" />
        <ProductSection
          title="Trending Now"
          tag="Popular picks"
          products={trendingData}
        />
      </div>

      <ValuePropsSection />

      <VideoBanner video="https://www.eyce.com/cdn/shop/videos/c/vp/58ae12f6907f4d00a3f4d6731333f532/58ae12f6907f4d00a3f4d6731333f532.HD-1080p-7.2Mbps-19516561.mp4" />

      <TestimonialsCarousel />

      <div className="section-gradient-1 relative">
        <div className="pointer-events-none absolute -right-28 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
        <FAQSection />
      </div>

      <Newsletter />
    </>
  );
}
