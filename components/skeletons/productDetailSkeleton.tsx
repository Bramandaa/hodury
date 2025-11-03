import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Image */}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <Skeleton className="w-full max-w-60 aspect-square rounded-lg" />
        </div>

        {/* Middle Info */}
        <div className="space-y-4 md:col-span-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />

          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Right Summary (optional) */}
        <div className="md:col-span-3 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </section>
  );
}
