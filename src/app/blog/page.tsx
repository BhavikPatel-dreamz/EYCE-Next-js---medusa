"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [featured, ...rest] = blogPosts;

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
        },
      );

      const cards = gridRef.current?.querySelectorAll(".blog-item");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.2,
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-background">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-surface via-background to-surface">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,transparent_50%)] opacity-[0.07]" />
        <div ref={headerRef} className="container-x relative py-12 md:py-16 opacity-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
            EYCE Journal
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Stories & guides.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Deep dives into materials, care tips, product launches, and the thinking behind everything we build.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{blogPosts.length}</span>
            <span>article{blogPosts.length !== 1 && "s"}</span>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="container-x py-10">
        <Link
          href={`/blog/${featured.slug}`}
          className="blog-item group relative block overflow-hidden rounded-2xl bg-surface opacity-0"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {featured.readTime}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-8 overflow-hidden rounded-full">
                    <Image
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{featured.author.name}</div>
                    <div className="text-[10px] text-muted-foreground">{featured.author.role}</div>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="size-3" />
                  {featured.date}
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                Read article <ArrowUpRight className="size-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* All Posts Grid */}
      <div className="container-x pb-20">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">All articles</h2>
        </div>
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-item group overflow-hidden rounded-2xl bg-surface transition-colors hover:bg-surface/80 opacity-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-2.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 overflow-hidden rounded-full">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{post.author.name}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="size-2.5" />
                    {post.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
