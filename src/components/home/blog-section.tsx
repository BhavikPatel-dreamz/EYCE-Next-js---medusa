"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { blogPosts } from "@/data/blog";

gsap.registerPlugin(ScrollTrigger);

export function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 88%", once: true },
        },
      );

      const cards = gridRef.current?.querySelectorAll(".blog-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [featured, ...rest] = blogPosts;

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container-x">
        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between gap-6 mb-10 opacity-0">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
              From the blog
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Stories & guides.
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid gap-5 lg:grid-cols-2">
          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="blog-card group relative overflow-hidden rounded-2xl bg-surface opacity-0 lg:row-span-2"
          >
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/60">
                    <Clock className="size-3" />
                    {featured.readTime}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white leading-tight md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-2 max-w-md">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                  <Calendar className="size-3" />
                  {featured.date}
                </div>
              </div>
            </div>
          </Link>

          {/* Smaller posts */}
          {rest.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-card group flex gap-5 overflow-hidden rounded-2xl bg-surface p-4 transition-colors hover:bg-surface/80 opacity-0"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-2.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Calendar className="size-2.5" />
                  {post.date}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all articles
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
