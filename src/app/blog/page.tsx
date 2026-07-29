"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog";

gsap.registerPlugin(ScrollTrigger);

const sectionGradients = [
  "from-cyan/5 via-transparent to-cyan/5",
  "from-violet/5 via-transparent to-violet/5",
  "from-rose/5 via-transparent to-rose/5",
];

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

  const getFeaturedGradient = (idx: number) => sectionGradients[idx % sectionGradients.length];

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
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface" />
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-gradient-to-br from-cyan/10 via-violet/10 to-rose/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 size-64 rounded-full bg-amber/10 blur-3xl" />
        <div ref={headerRef} className="container-x relative py-12 md:py-16 opacity-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
            EYCE Journal
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-primary to-cyan bg-clip-text text-transparent">
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent md:hidden" />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full bg-gradient-to-r from-cyan to-violet px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {featured.readTime}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl transition-colors bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-cyan">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-8 overflow-hidden rounded-full ring-2 ring-primary/20">
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
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Browse all
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">All articles</h2>
          </div>
          <div className="hidden sm:flex gap-1">
            {rest.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        </div>
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-item group overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-surface to-surface/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 opacity-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${idx % 3 === 0 ? "bg-cyan/10 text-cyan" : idx % 3 === 1 ? "bg-violet/10 text-violet" : "bg-rose/10 text-rose"}`}>
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
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 overflow-hidden rounded-full ring-1 ring-primary/20">
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
