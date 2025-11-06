import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ProfileSkeleton() {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-200">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-4 space-y-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full ring-2 ring-primary/20 overflow-hidden">
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" /> {/* Name */}
            <Skeleton className="h-3 w-48" /> {/* Email */}
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Phone icon */}
              <Skeleton className="h-3 w-32" /> {/* Phone */}
            </div>
          </div>

          {/* Edit Button */}
          <Skeleton className="h-8 w-20 rounded-xl" />
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
