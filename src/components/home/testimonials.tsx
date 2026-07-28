"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: "t1",
    quote: "Dropped my Beaker off a balcony onto concrete. Not a scratch. The lifetime warranty is real — I tested it.",
    author: "Marcus L.",
    location: "Denver, CO",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://i.pravatar.cc/80?img=11",
    product: "Molino Beaker",
  },
  {
    id: "t2",
    quote: "The Spark Rig hits cleaner than any glass I've owned. And when my dog knocked it over? Zero damage. I'm a convert.",
    author: "Priya S.",
    location: "Austin, TX",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://i.pravatar.cc/80?img=25",
    product: "Spark Rig II",
  },
  {
    id: "t3",
    quote: "Hammer Pipe fits in my jacket pocket. It's been camping, kayaking, and through a full dishwasher cycle. Still perfect.",
    author: "Julien R.",
    location: "Portland, OR",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://i.pravatar.cc/80?img=53",
    product: "Hammer Pipe",
  },
  {
    id: "t4",
    quote: "I've bought glass that costs 3x as much and broke in the first month. EYCE is the only brand I trust now.",
    author: "Taylor M.",
    location: "Brooklyn, NY",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://i.pravatar.cc/80?img=47",
    product: "Spoon Pipe",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container-x">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
            Customer Reviews
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Loved by 40,000+ enthusiasts.
          </h2>
          {/* Stars row */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              4.9 / 5.0 · 12,400+ reviews
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="mx-auto max-w-2xl">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            spaceBetween={24}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="px-2 pb-12">
                  <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-lg">
                    {/* Stars */}
                    <div className="inline-flex gap-0.5 mb-6">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <div className="relative size-12 overflow-hidden rounded-full ring-2 ring-border">
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-foreground">{t.author}</div>
                        <div className="text-xs text-muted-foreground">{t.location}</div>
                      </div>
                      <div className="ml-4 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t.product}
                      </div>
                    </div>
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
