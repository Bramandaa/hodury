"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchFormSkeleton() {
  return (
    <div className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm animate-pulse">
      {/* Input keyword */}
      <div className="flex-1">
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Select kategori */}
      <div>
        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Select status */}
      <div>
        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Tombol submit */}
      <div className="flex items-end">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
