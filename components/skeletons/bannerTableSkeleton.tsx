"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BannerTableSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto animate-in fade-in duration-300">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-12 text-left">No</th>
            <th className="w-[50%] text-left">Nama</th>
            <th className="w-[40%] text-left">Gambar</th>
            <th className="w-[10%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }).map((_, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
              <td className="py-2">
                <Skeleton className="h-4 w-6" />
              </td>
              <td className="py-2">
                <Skeleton className="h-4 w-[180px]" />
              </td>
              <td className="py-2">
                <div className="relative h-16 aspect-3/1">
                  <Skeleton className="h-full w-full" />
                </div>
              </td>
              <td className="py-2 text-center space-x-2 flex justify-center">
                <Skeleton className="h-7 w-7 rounded-md inline-block" />
                <Skeleton className="h-7 w-7 rounded-md inline-block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination & Limit Select Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
