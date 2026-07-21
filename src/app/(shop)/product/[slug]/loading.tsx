export default function ProductLoading() {
  return (
    <section className="container-x py-10 md:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
        <div className="space-y-6">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-2 pt-4">
            <div className="size-10 animate-pulse rounded-full bg-muted" />
            <div className="size-10 animate-pulse rounded-full bg-muted" />
            <div className="size-10 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </section>
  );
}
