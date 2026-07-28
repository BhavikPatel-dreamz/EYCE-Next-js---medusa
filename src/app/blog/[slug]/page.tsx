import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, ArrowLeft, Tag } from "lucide-react";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/data/blog";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} · EYCE`,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-background">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-foreground font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden md:h-[50vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Article */}
      <div className="container-x -mt-20 relative z-10 pb-20">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {post.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3 pb-8 border-b border-border/60">
            <div className="relative size-10 overflow-hidden rounded-full">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">{post.author.role}</div>
            </div>
          </div>

          {/* Content */}
          <article
            className="prose prose-sm prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-10 pt-8 border-t border-border/60">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="size-3.5 text-muted-foreground" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="border-t border-border/60 bg-surface/30 py-16">
          <div className="container-x">
            <div className="mb-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                Keep reading
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Related articles</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-background transition-colors hover:bg-surface/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                        {r.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="size-2.5" />
                        {r.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
