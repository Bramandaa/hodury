import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 animate-pulse">
      {/* Bagian kiri: daftar item */}
      <div className="flex-1 space-y-4">
        {/* Pilih semua */}
        <Card className="rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-5 h-5 md:w-8 md:h-8 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-12 rounded-md" />
          </div>
        </Card>

        {/* Daftar item skeleton */}
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className={`relative rounded-lg shadow-sm overflow-hidden transition-all duration-300 py-1 ${
              i === 2 ? "mb-60 md:mb-0" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              {/* Checkbox */}
              <Skeleton className="w-5 h-5 md:w-6 md:h-6 rounded-sm" />

              {/* Gambar produk */}
              <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg shrink-0" />

              {/* Nama dan harga */}
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Kontrol jumlah & hapus */}
              <div className="flex flex-col items-end space-y-2 shrink-0">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bagian kanan: ringkasan belanja */}
      <div className="w-full md:w-[35%]">
        <Card className="rounded-lg shadow-sm fixed bottom-0 left-0 right-0 z-20 md:sticky md:top-[72px]">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
