"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="border-y border-border py-20">
      <div className="container-x">
        <div className="mb-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          03 &middot; From our community
        </div>
        <h2 className="text-center font-display text-3xl font-bold md:text-5xl">Loved by 40,000+ enthusiasts</h2>
        <div className="mx-auto mt-8 max-w-3xl md:mt-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            loop
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="px-4 pb-14 text-center">
                  <div className="mb-4 inline-flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="font-display text-2xl leading-snug font-bold tracking-tight md:text-3xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 text-sm text-muted-foreground">
                    {t.author} &middot; <span className="text-primary">{t.role}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
