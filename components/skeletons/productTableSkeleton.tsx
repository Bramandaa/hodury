"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProductTableSkeleton() {
  return (
    <div>
      {/* Desktop: Table Skeleton */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-12 text-left">No</th>
              <th className="w-[30%] text-left">Nama</th>
              <th className="w-[30%] text-left">Kategori</th>
              <th className="w-[10%] text-left">Harga</th>
              <th className="w-[20%] text-center">Status</th>
              <th className="w-[10%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr
                key={i}
                className="border-b animate-pulse hover:bg-gray-50 transition-colors"
              >
                <td className="py-2">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
                <td className="py-2">
                  <Skeleton className="h-4 w-32 rounded" />
                </td>
                <td className="py-2">
                  <Skeleton className="h-4 w-40 rounded" />
                </td>
                <td className="py-2">
                  <Skeleton className="h-4 w-24 rounded" />
                </td>
                <td className="py-2 text-center">
                  <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                </td>
                <td className="py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View Skeleton */}
      <div className="space-y-4 md:hidden">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="bg-white p-4 rounded-lg shadow border space-y-2"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <div className="flex justify-end">
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-[100px] rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
