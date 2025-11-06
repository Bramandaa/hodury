"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ProfileSkeleton() {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-200">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-6">
        <div className="flex items-center gap-4">
          {/* Avatar Skeleton */}
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />

          {/* Info Section */}
          <div className="w-full md:flex items-center space-y-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" /> {/* Name */}
              <Skeleton className="h-4 w-56" /> {/* Email */}
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-4 w-4 rounded-full" />{" "}
                {/* Icon placeholder */}
                <Skeleton className="h-4 w-32" /> {/* Phone */}
              </div>
            </div>

            {/* Edit Button Skeleton */}
            <div className="mt-4 md:mt-0">
              <Button
                disabled
                size="sm"
                className="rounded-xl flex items-center gap-1 bg-gray-200 text-transparent cursor-not-allowed"
              >
                <Skeleton className="h-4 w-10" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddressSkeleton() {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-200">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-5 w-24" />
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-4 space-y-6">
        {/* Alamat */}
        <div className="flex items-start gap-3">
          {/* Icon Placeholder */}
          <Skeleton className="h-5 w-5 rounded-full mt-1" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-60" /> {/* Alamat utama */}
            <Skeleton className="h-3 w-48" /> {/* Sub-alamat */}
          </div>
        </div>

        {/* Tombol Edit/Tambah */}
        <div>
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
