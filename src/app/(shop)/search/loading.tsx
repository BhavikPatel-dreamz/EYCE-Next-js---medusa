import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-2xl text-center">
        <Skeleton className="mx-auto h-3 w-16" />
        <Skeleton className="mx-auto mt-3 h-10 w-48 md:h-12 md:w-56" />
        <Skeleton className="mx-auto mt-3 h-4 w-64" />
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>

      <div className="mt-10">
        <Skeleton className="mb-6 h-4 w-48" />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
