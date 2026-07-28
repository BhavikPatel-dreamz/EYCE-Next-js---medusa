"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight, Instagram } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const posts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=85",
    handle: "@tokesmith_co",
    likes: "2.4k",
    tag: "#EYCE",
    large: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=85",
    handle: "@glass.free.life",
    likes: "1.1k",
    tag: "#BuiltToBounce",
    large: false,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=85",
    handle: "@campvibes_usa",
    likes: "3.8k",
    tag: "#SiliconeFirst",
    large: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=85",
    handle: "@rigsessions",
    likes: "2.1k",
    tag: "#EYCERig",
    large: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=85",
    handle: "@nitemode_420",
    likes: "4.6k",
    tag: "#EYCEBeaker",
    large: false,
  },
];

export function InstagramCommunity() {
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

      const tiles = gridRef.current?.querySelectorAll(".ig-tile");
      if (tiles?.length) {
        gsap.fromTo(
          tiles,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container-x">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 opacity-0">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
              <Instagram className="size-3.5" /> @eyce_official
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Tag <span className="text-primary">#EYCE</span> to be featured.
            </h2>
          </div>
          <a
            href="https://instagram.com/eyce_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors shrink-0"
          >
            <Instagram className="size-4" />
            Follow us
          </a>
        </div>

        {/* Mosaic grid */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ gridAutoRows: "220px" }}>
          {/* Hero tile */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-tile group relative col-span-2 row-span-2 overflow-hidden rounded-xl bg-surface opacity-0"
          >
            <Image
              src={posts[0].image}
              alt="EYCE community"
              fill
              className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block font-mono text-[11px] text-white/70 mb-1">{posts[0].tag}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{posts[0].handle}</span>
                <span className="text-xs text-white/50">♥ {posts[0].likes}</span>
              </div>
            </div>
          </a>

          {/* Four smaller tiles */}
          {posts.slice(1).map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-tile group relative overflow-hidden rounded-xl bg-surface opacity-0"
            >
              <Image
                src={post.image}
                alt="EYCE community"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="font-mono text-[10px] text-primary">{post.tag}</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-medium text-white">{post.handle}</span>
                  <span className="text-[10px] text-white/50">♥ {post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
