import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-x py-14">
      <div className="mb-10">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-48 md:h-12 md:w-64 lg:h-14 lg:w-72" />
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-10" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="group relative">
            <div className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                <Skeleton className="absolute inset-0 rounded-lg" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
